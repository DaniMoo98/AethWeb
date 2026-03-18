// ============================================================
//  AETHRYA — Content Renderer
//  Fetches markdown from /content/, parses with marked.js,
//  and renders into the page template with Aethrya styling.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initContentRenderer();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  console.log('Popstate event triggered');
  initContentRenderer();
});


async function initContentRenderer() {
  const container = document.getElementById('content-body');
  const titleEl = document.getElementById('content-title');
  const breadcrumbSection = document.getElementById('breadcrumb-section');
  const breadcrumbPage = document.getElementById('breadcrumb-page');

  if (!container) return;

  // Determine content path from URL
  const params = new URLSearchParams(window.location.search);
  let contentPath = params.get('p') || window.location.hash.slice(1);

  if (!contentPath) {
    contentPath = 'home';
  }

  // Clean the path
  contentPath = contentPath.replace(/^\//, '').replace(/\.md$/, '');

  // Build the fetch URL
  const mdUrl = `/content/${contentPath}.md`;
  console.log('Fetching markdown from:', mdUrl);

  try {
    const response = await fetch(mdUrl);
    if (!response.ok) {
        console.error('Fetch failed for:', mdUrl, response.status);
        throw new Error(`Content not found (${response.status})`);
    }

    let markdown = await response.text();
    console.log('Markdown received, length:', markdown.length);

    // Parse YAML frontmatter
    const frontmatter = parseFrontmatter(markdown);
    let bodyText = normalizeContentText(frontmatter.body);

    // Set page title and breadcrumbs
    const title = frontmatter.meta?.title || formatTitle(contentPath);
    const section = contentPath.split('/')[0];

    // Strip redundant leading headings from body if they match title
    bodyText = bodyText.trim();
    const cleanTitle = title.replace(/^["'](.*)["']$/, '$1').toLowerCase().trim();
    
    // Check first few lines for matching headers (H1, H2, H3)
    const lines = bodyText.split(/\r?\n/);
    let strippedLines = 0;
    
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Match # Header, ## Header, ### Header or **Header** (if lone line)
        const headerMatch = line.match(/^(?:#+\s+|\*\*)(.+?)(?:\s*#*|\*\*)$/);
        if (headerMatch) {
            const headerText = headerMatch[1].trim().replace(/^["'](.*)["']$/, '$1').toLowerCase();
            if (headerText === cleanTitle) {
                lines[i] = ''; // Remove the line
                strippedLines++;
                continue; // Keep checking next line in case of multiple headers
            }
        }
        break; // Stop at first non-matching non-empty line
    }
    
    if (strippedLines > 0) {
        bodyText = lines.join('\n').trim();
    }

    // Strip other redundant metadata lines often found at the top
    bodyText = bodyText.replace(/^(?:\*\*|#|\s)*(?:TITLE|CATEGORY|AUTHOR|DATE|WRITTEN BY):\s*.*$/gim, '').trim();
    bodyText = bodyText.replace(/^(?:\*\*Category:\*\*)\s*.*$/gim, '').trim();
    bodyText = preprocessClassContent(contentPath, bodyText);

    if (titleEl) titleEl.textContent = title.replace(/^["'](.*)["']$/, '$1');
    if (breadcrumbSection) {
      breadcrumbSection.textContent = formatTitle(section);
      breadcrumbSection.href = `#`;
    }
    if (breadcrumbPage) {
      breadcrumbPage.textContent = title;
    }
    document.title = `${title} — Aethrya`;

    // Highlight the active sidebar section
    highlightSidebarSection(section);

    // Render markdown to HTML
    const html = renderMarkdown(bodyText);
    container.innerHTML = html;

  } catch (err) {
    console.error('Content load error:', err);
    container.innerHTML = `
      <div class="content-error">
        <h3>📜 Content Not Found</h3>
        <p>The scroll you seek has not yet been written, or the path is lost to the mists.</p>
        <p><a href="/">Return to the Portal</a></p>
      </div>
    `;
  }
}

function normalizeContentText(text) {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/\u2012/g, '-')
    .replace(/\u00c2/g, ' ')
    .replace(/\u00e2\u20ac\u2122|\u00e2\u20ac\u02dc/g, "'")
    .replace(/\u00e2\u20ac\u0153|\u00e2\u20ac\u009d/g, '"')
    .replace(/\u00e2\u20ac\u201c|\u00e2\u20ac\u201d|\u2013/g, '-')
    .replace(/weild/g, 'wield')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

function preprocessClassContent(contentPath, bodyText) {
  if (!contentPath.startsWith('classes/')) return bodyText;
  bodyText = bodyText.replace(/<summary>\s*\*\*(.*?)\*\*\s*<\/summary>/g, '<summary>$1</summary>');

  if (contentPath.startsWith('classes/combat/')) {
    bodyText = moveCombatFeaturesToEnd(bodyText);
    bodyText = repairNestedDetails(bodyText);
  }

  if (contentPath.startsWith('classes/professional/') && !contentPath.endsWith('/civilian')) {
    return preprocessProfessionalContent(bodyText);
  }

  return bodyText;
}

function moveCombatFeaturesToEnd(text) {
  const featureBlockPattern = /\n##\s+([A-Za-z ]+)\s+Features\s*\n([\s\S]*-<details>\s*<summary>Base Ritual List<\/summary>[\s\S]*-<\/details>\s*)/;
  const match = text.match(featureBlockPattern);
  if (!match) return text;

  const fullMatch = match[0];
  const heading = match[1].trim();
  const block = match[2].trim();
  const trimmed = text.replace(fullMatch, '\n').trim();
  return `${trimmed}\n\n## ${heading} Features\n\n${block}\n`;
}

function repairNestedDetails(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  const stack = [];
  let pendingDetails = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '<details>') {
      pendingDetails += 1;
      continue;
    }

    const summaryMatch = trimmed.match(/^<summary>(.*?)<\/summary>$/);
    if (summaryMatch && pendingDetails > 0) {
      const type = classifyDetailSummary(summaryMatch[1]);
      closeForIncomingType(type, stack, out);

      while (pendingDetails > 0) {
        out.push('<details>');
        pendingDetails -= 1;
      }

      out.push(line);
      stack.push(type);
      continue;
    }

    while (pendingDetails > 0) {
      out.push('<details>');
      pendingDetails -= 1;
      stack.push('unknown');
    }

    if (trimmed === '</details>') {
      if (stack.length) {
        stack.pop();
        out.push(line);
      }
      continue;
    }

    out.push(line);
  }

  while (stack.length) {
    out.push('</div>');
    out.push('</details>');
    stack.pop();
  }

  return out.join('\n');
}

function closeForIncomingType(type, stack, out) {
  if (type === 'rank') {
    while (stack.length && (stack[stack.length - 1] === 'ability' || stack[stack.length - 1] === 'rank' || stack[stack.length - 1] === 'unknown')) {
      out.push('</div>');
      out.push('</details>');
      stack.pop();
    }
    return;
  }

  if (type === 'section') {
    while (stack.length && stack[stack.length - 1] !== 'subclass') {
      out.push('</div>');
      out.push('</details>');
      stack.pop();
    }
    return;
  }

  if (type === 'subclass') {
    while (stack.length) {
      out.push('</div>');
      out.push('</details>');
      stack.pop();
    }
  }
}

function classifyDetailSummary(summaryText) {
  const text = summaryText.replace(/\*\*/g, '').trim();
  if (/^(Novice|Adept|Expert|Master)$/i.test(text)) return 'rank';
  if (/^(Spell List|Rituals|Passives & Perks|Fluff Spells|Expanded Arcana|Expanded Spell List|Unique Crafting|Combative Perks|Non-Combative Perks|Base Spell List|Base Ritual List|Pact Boons)$/i.test(text)) {
    return 'section';
  }
  if (/^(Path|College|Circle|School|Oath|Way|Pact|Death Domain|Life Domain|Nature Domain|Trickery Domain|Twilight Domain|War Domain|Arcane Trickster|Assassin|Phantom|Swashbuckler|Thief|Apothecary|Artisan|Courtier|Homesteader|Aberrant Mind|Divine Soul|Draconic Bloodline|Lunar Sorcery|Shadow Magic|Storm Sorcery|Beast Master|Swarmkeeper|Gloomstalker|Hunter Conclave|Horizon Walker|Arcane Archer|Banneret|Battle Master|Champion|Eldritch Knight|Hexblade|Undying)/i.test(text)) {
    return 'subclass';
  }
  return 'ability';
}

function preprocessProfessionalContent(bodyText) {
  let text = bodyText.replace(/^This page is a work in progress and subject to change\.\s*$/gim, '').trim();

  return text.replace(
    /<details>\s*<summary>(.*?)<\/summary>\s*<div class="details-content">\s*([\s\S]*-)\s*<\/div>\s*<\/details>/g,
    (_, title, content) => renderProfessionalSection(title.trim(), content)
  );
}

function renderProfessionalSection(title, content) {
  const parsed = parseProfessionalSection(content);
  let html = '';

  for (const block of parsed.introBlocks) {
    html += `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`;
  }

  if (parsed.entries.length) {
    html += '<div class="item-catalog">';
    for (const entry of parsed.entries) {
      html += renderProfessionalEntry(entry);
    }
    html += '</div>';
  }

  return `
<details>
<summary>${escapeHtml(title)}</summary>
<div class="details-content">
${html}
</div>
</details>`.trim();
}

function parseProfessionalSection(content) {
  const rawLines = content.split(/\r?\n/).map(line => line.trim());
  const lines = rawLines.filter(Boolean);
  const intro = [];
  const entries = [];
  let i = 0;

  while (i < lines.length && !looksLikeEntryStart(lines, i)) {
    intro.push(lines[i]);
    i += 1;
  }

  while (i < lines.length) {
    if (!looksLikeEntryStart(lines, i)) {
      i += 1;
      continue;
    }

    const entry = { name: lines[i++] };

    if (i < lines.length && !isFieldStart(lines[i]) && !looksLikeEntryStart(lines, i)) {
      entry.type = lines[i++];
    }

    if (lines[i] && /^Item Value$/i.test(lines[i])) i += 1;
    if (lines[i] && /^Tier\b/i.test(lines[i])) entry.tier = lines[i++];

    while (i < lines.length) {
      if (looksLikeEntryStart(lines, i)) break;

      const line = lines[i];

      if (/^Description$/i.test(line)) {
        i += 1;
        const desc = [];
        while (i < lines.length && !isFieldStart(lines[i]) && !looksLikeEntryStart(lines, i)) {
          desc.push(lines[i++]);
        }
        entry.description = desc.join(' ');
        continue;
      }

      if (/^Recipe$/i.test(line)) {
        i += 1;
        const recipe = [];
        while (i < lines.length && !isFieldStart(lines[i]) && !looksLikeEntryStart(lines, i)) {
          recipe.push(lines[i++]);
        }
        entry.recipe = recipe;
        continue;
      }

      if (/^Merchant Cost:/i.test(line)) {
        entry.merchantCost = line.replace(/^Merchant Cost:\s*/i, '');
        i += 1;
        continue;
      }

      if (/^Crafting Energy$/i.test(line)) {
        i += 1;
        if (i < lines.length && /^\d+$/.test(lines[i])) {
          entry.craftingEnergy = lines[i++];
        }
        continue;
      }

      if (!entry.notes) entry.notes = [];
      entry.notes.push(line);
      i += 1;
    }

    entries.push(entry);
  }

  return {
    introBlocks: collapseIntroLines(intro),
    entries
  };
}

function collapseIntroLines(lines) {
  if (!lines.length) return [];
  const blocks = [];
  let current = [];

  for (const line of lines) {
    const isHeadingLike = /^[A-Z0-9][A-Z0-9 '&-]{6,}$/.test(line);
    if (isHeadingLike && current.length) {
      blocks.push(current.join('\n'));
      current = [line];
      continue;
    }
    current.push(line);
  }

  if (current.length) blocks.push(current.join('\n'));
  return blocks;
}

function looksLikeEntryStart(lines, index) {
  const current = lines[index];
  const next = lines[index + 1] || '';
  if (!current) return false;
  if (isFieldStart(current)) return false;
  if (/^(Recipe|Description|Crafting Energy)$/i.test(current)) return false;
  if (/^(Lesser|Greater|Refined Material|Refined Ingredient|Refined Goods|Crafted Armor|Crafted Weapon|Light Armor|Medium Armor|Heavy Armor|Weapon|Armor)$/i.test(current)) return false;
  return /^Item Value$/i.test(next) || /^(Lesser|Greater|Refined Material|Refined Ingredient|Refined Goods|Crafted Armor|Crafted Weapon|Light Armor|Medium Armor|Heavy Armor|Weapon|Armor)$/i.test(next);
}

function isFieldStart(line) {
  return /^(Item Value|Tier\b|Description|Recipe|Merchant Cost:|Crafting Energy)$/i.test(line);
}

function renderProfessionalEntry(entry) {
  const meta = [];
  if (entry.type) meta.push(`<span class="item-chip">${escapeHtml(entry.type)}</span>`);
  if (entry.tier) meta.push(`<span class="item-chip">${escapeHtml(entry.tier)}</span>`);
  if (entry.merchantCost) meta.push(`<span class="item-chip">Merchant Cost: ${escapeHtml(entry.merchantCost)}</span>`);
  if (entry.craftingEnergy) meta.push(`<span class="item-chip">Crafting Energy: ${escapeHtml(entry.craftingEnergy)}</span>`);

  const recipeHtml = entry.recipe?.length
    ? `<div class="item-recipe"><h4>Recipe</h4><ul>${entry.recipe.map(line => `<li>${escapeHtml(line)}</li>`).join('')}</ul></div>`
    : '';
  const notesHtml = entry.notes?.length
    ? `<div class="item-notes">${entry.notes.map(line => `<p>${escapeHtml(line)}</p>`).join('')}</div>`
    : '';

  return `
<article class="item-card">
  <h3>${escapeHtml(entry.name)}</h3>
  ${meta.length ? `<div class="item-meta">${meta.join('')}</div>` : ''}
  ${entry.description ? `<p class="item-description">${escapeHtml(entry.description)}</p>` : ''}
  ${recipeHtml}
  ${notesHtml}
</article>`.trim();
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---- YAML Frontmatter Parser (lightweight) ----
function parseFrontmatter(text) {
  // Primary: Match standard triple-dash block (non-greedy)
  const tripleDashMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  
  if (tripleDashMatch) {
    const yamlStr = tripleDashMatch[1];
    let body = tripleDashMatch[2];
    const meta = {};

    yamlStr.split('\n').forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim();
        meta[key] = value.replace(/^"(.*)"$/, '$1'); // Strip quotes
      }
    });

    // Remove any residual "Title:" or "Category:" lines often left by WA exports at the top of the body
    body = body.replace(/^(?:TITLE|CATEGORY|AUTHOR|DATE):\s*.*$/gim, '').trim();

    return { meta, body };
  }

  // Fallback: No triple-dash, treat whole text as body but still strip WA metadata
  return { 
    meta: {}, 
    body: text.replace(/^(?:TITLE|CATEGORY|AUTHOR|DATE):\s*.*$/gim, '').trim() 
  };
}

// ---- Markdown to HTML Renderer ----
// Uses marked.js if available, otherwise a lightweight fallback
function renderMarkdown(md) {
  if (typeof marked !== 'undefined' && marked.parse) {
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false,
      sanitize: false 
    });
    return marked.parse(md);
  }
  return fallbackRender(md);
}

function fallbackRender(md) {
  let html = md;
  // Basic markdown to HTML
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="section-header">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/\*\*\***(.*)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  
  // Wrap list items
  html = html.replace(/(<li>.*<\/li>\n-)+/g, '<ul>$&</ul>');
  
  // Paragraphs
  html = html.replace(/^(-!<[hluob]|<hr|<li)(.+)$/gm, '<p>$1</p>');
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

// ---- Utilities ----
function formatTitle(slug) {
  if (!slug) return 'Aethrya';
  return slug
    .split('/').pop()
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function highlightSidebarSection(section) {
  document.querySelectorAll('.nav-link.active').forEach(el => el.classList.remove('active'));
  const link = document.querySelector(`.nav-link[data-section="${section}"]`);
  if (link) {
    link.classList.add('active');
    const parent = link.closest('.nav-item.has-submenu');
    if (parent) parent.classList.add('open');
  }
}
