---
title: "Merchant"
category: "Professional Classes"
---

You have a keen eye for a good price, always a bargain to be found and turned around for a tidy profit. A silver tongue and charm are the tools of your trade, honed and as sharp as any blade that a smith might toil for hours over but not you. No, why risk the savage frontier when you can make a living within the comforts and safety of sturdy stone walls- Whether cook or carpenter, you know what they want and how to get it cheap. A quick sale for some is an easy silver for you and all without muddying your boots. Should adventure call you, you know opportunity will present itself, where resources are found so too is profit. The merchant's guild always has what you need stocked, they know you well, and the profits you make. What's the difference of a few silver to them when they know you'll be back to buy more-

## Materials & Creations

<details>
<summary>**MATERIAL ACQUISITION**</summary>
<div class="details-content">

- BE AN ECONOMIC POWERHOUSE

</div>
</details>

<details>
<summary>**ITEM PURCHASING**</summary>
<div class="details-content">

Potion of Restoration
Greater
Item Value
Tier 3
Description
Fully restores your hitpoints. This item can only be used while out of combat
Recipe
1 x Potion of Healing
2 x Nug Fungus
2 x Blood Herb
Merchant Cost: 100 Silver
Crafting Energy
5

Splint
Lesser
Item Value
Tier 2
Description
Apply a splint to your character, guaranteeing a roll of at least 10 on your next use of the Natural Healing ability
Recipe
3 x Linen Wrap
2 x Thick Rope
1 x Oak Plank
Merchant Cost: 100 Silver
Crafting Energy
5

Surgeon's Kit
Greater
Item Value
Tier 3
Description
Use a Surgeon's Kit, guaranteeing a roll of at least 35 on your next use of the Practical Healing ability
Recipe
1 x Decorative Fur
1 x Potion of Restoration
Merchant Cost: 200 Silver
Crafting Energy
20

Wine
Lesser
Item Value
Tier 1
Description
Grants +1 to all Charisma skills and -1 to all Intelligence skills for 6 hours
Recipe
1 x Seasonal Fruit
1 x Boiled Kasuni Juice
Merchant Cost: 10 Silver
Crafting Energy
5

Bread
Lesser
Item Value
Tier 1
Description
Grants +1 Resilience for 6 hours and restores 10 hitpoints
Recipe
1 x Mandrake Root Flour
1 x Animal Fat
Merchant Cost: 10 Silver
Crafting Energy
5

</div>
</details>

<details>
<summary>**RAW MATERIALS**</summary>
<div class="details-content">

No catalog entries were extracted from the source export.

</div>
</details>

<details>
<summary>**REFINED MATERIALS**</summary>
<div class="details-content">

Home
Guides
New Player Guide
Roleplay Guide
Staff Structure
Dungeon Master Guide
Rules
General Rules
Building Rules
Reroll Rules
Class & Profession Change Rules
Combat Rules
Consequence Rules
Charm & Dominate Rules
Infiltration, Raid, & Siege Conflict Rules
Tracking & POIs
Theft Rules
Practical Disguise Rules
Hub Cities & Hub Guard Rules
Setting
The Lost Hills
Season Story
Timeline
Factions
Systems
Languages
Magic
Professions
Wounds System
Factions
Leilon
Phandalin
Southkrypt
Hub Cities & Hub Guard Rules
Classes
Class & Profession Change Rules
Mastery Progression
Becoming a Master
Races
Fabled Race Expectations
Combat
Combat Rules
Aquatic Combat Rules
Feats
Equipment
Wounds
Support
Donation Tiers & Milestones
Thank You for Donating
if ( "" || "Professions" || "" || "")
{
var find_article_url = "/article-data/94135c8f-1222-4062-b10a-3a0e0449fb8c";
$( document ).ready(function()
{
$.ajax({
url: find_article_url,
type: "GET",
dataType: "json",
async: true,
success: function (navData)
{
$("#linear-navigation-container").html(navData.contents);
}
});
});
}
-
Metadata
Article template
Generic article
(CR - Article with Sticky Sidebar)
World
aethrya
Category
Professions
Author
Crikey_Its_BrewaH
Publication Date
1 Mar, 2024
Creation Date
28 Feb, 2024
Last Update Date
1 Mar, 2026
Visibility
Public
Views
6309
Favorites
Comments
0
Tags
Systems Profession Merchant
Hello!
Find your way!
- DO YOU NEED HELP-
- PRICING
- GIFT A MEMBERSHIP!
- ABOUT
- FAQ
- CHANGELOG
Resources
- RANDOM GENERATORS
- WORLDBUILDING PROMPTS
- WHAT IS WORLDBUILDING-
WHO WE ARE
- OUR TEAM
- WE ARE HIRING
- OUR NEWS
LEGAL
- PRIVACY
- TERMS OF SERVICE
- COPYRIGHT
- ETIQUETTE
- ACCESSIBILITY
Get the news
- WORLDANVIL PODCAST
- DISCORD
- BLOG
- BLUESKY
- TWITTER
- YOUTUBE
- TWITCH
- FACEBOOK
- REDDIT
Our Shop
- GIFTS & WORLD ANVIL GEAR
Development
- WORLD ANVIL API
EVENTS
-
STREAMING
-
MAJOR CHALLENGES
- WORLDEMBER
- SUMMERCAMP
REACHING OUT
- JOIN THE AFFILIATE PROGRAM
- GET SPONSORED
A BIG THANK YOU
To all our Our Patrons for their unwavering love and support.
For the amazing images.
His Titanship Christopher Dravus of Ironrise Games,
Our Revered Deity Basic Dragon / Rin &
His Majesty Caeora
var articleMetadata = '';
var author = 0
var writer = 0;
if ( author == 1 && writer == 0 ) {
$( ".visibility-toggler" ).each(function( index ) {
$(this).prepend('
')
id = $(this).attr('id');
if (articleMetadata.hasOwnProperty( id ) ) {
if ( articleMetadata[id] == 1) {
$(this).addClass('visibility-toggler-opaque');
$(this).find('.visibility-toggler-trigger i').toggleClass('fa-eye fa-eye-slash')
}
}
});
$(document).on('click', '.visibility-toggler-trigger', function( event ){
that = $(this);
$.ajax({
url: "/world/article/94135c8f-1222-4062-b10a-3a0e0449fb8c/metadata-key=" + that.parent('.visibility-toggler').attr('id') ,
type: "POST",
dataType: "json",
async: true,
success: function (data)
{
that.parent('.visibility-toggler').toggleClass('visibility-toggler-opaque');
that.find('i').toggleClass('fa-eye fa-eye-slash');
}
});
event.preventDefault();
});
} else {
$( ".visibility-toggler" ).each(function( index ) {
id = $(this).attr('id');
if (articleMetadata.hasOwnProperty( id ) ) {
if ( articleMetadata[id] == 1) {
$(this).remove();
}
}
});
}
$( "span.visibility-toggler" ).addClass('d-inline-block');
$( "div.visibility-toggler, blockquote.visibility-toggler, li.visibility-toggler" ).addClass('d-block');
var displayToC = false;
var contentCategories = '/w/aethrya-chancellor/load/categories';
var contentMaps = '/w/aethrya-chancellor/load/maps';
var contentTimelines = '/w/aethrya-chancellor/load/timelines';
var input = $('input.typeahead');
var form = $('#search-button');
input.typeahead({
source: function (query, process) {
return $.get('/api/worlds/c2f486f2-8394-4bcc-a53a-49c7c98059aa/articles', { term: query, type: 'advanced' },
function (data) {
data = data;
rawdata = data;
return process(data);
});
},
highlighter: function(data, rawdata) {
html = '' + rawdata.name + '
';
return html;
},
updater: function(item) {
this.$element[0].value = item;
string = JSON.stringify(item);
$('#objectData').val( string );
this.$element[0].form.submit();
return item;
},
limit: 25,
minLength: 3
});
$(".b-o-w").click(function(){
$(".page-article-main").removeClass("bow");
$(".page-article-main").addClass("wob");
});
$(".w-o-b").click(function(){
$(".page-article-main").removeClass("wob");
$(".page-article-main").addClass("bow");
});
$(".fontIncrease").click(function(){
var fontSize = parseInt($(".article-content").css("font-size"));
console.log( fontSize );
fontSize = fontSize + 1 + "px";
console.log( fontSize );
$(".article-content").css({'font-size':fontSize});
});
$(".fontDecrease").click(function(){
var fontSize = parseInt($(".article-content").css("font-size"));
console.log( fontSize );
fontSize = fontSize - 1 + "px";
console.log( fontSize );
$(".article-content").css({'font-size':fontSize});
});
var WorldMenu = {
init() {
console.log('initiating world menu');
if ( displayToC == true ) {
loadSidebarContent( contentCategories, '.world-menu' );
}
loadSidebarContent( contentTimelines, '.world-timelines' );
loadSidebarContent( contentMaps, '.world-maps' );
$('#world-codex').addClass('active');
}
};
function loadSidebarContent( url, position = '#world-menu' ) {
$('.world-nav-button').removeClass('active');
$.ajax({
url: url,
type: "GET",
dataType: "json",
async: true,
success: function (data)
{
$( position ).html(data.contents);
toggleWorldEditLinks( cookieWorldState );
}
});
}
$(document).on('click', '#world-codex', function( event ){
event.preventDefault();
console.log('Loading Codex');
loadSidebarContent( $(this).attr('href') );
$(this).addClass('active');
});
$(document).on('click', '#world-atlas', function( event ){
event.preventDefault();
console.log('Loading Atlas');
loadSidebarContent( $(this).attr('href') );
$(this).addClass('active');
});
$(document).on('click', '#world-chronicles', function( event ){
event.preventDefault();
console.log('Loading Chronicles');
loadSidebarContent( $(this).attr('href') );
$(this).addClass('active');
});
WorldMenu.init();
var _userway_config = {
size: 'small',
mobile: false,
account: '44An6Tb8YG'
};
(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9dd3e746ffea4c91',t:'MTc3MzY2NTYzNA=='};var a=document.createElement('script');a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();

</div>
</details>
