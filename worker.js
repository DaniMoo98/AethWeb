export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // If the client asks for the config file, serve our custom payload
    if (url.pathname === '/jav_config.ws') {
      const configText = `title=RuneScape
codebase=http://world1.aethryadnd.online/
initial_class=client.class
initial_jar=gamepack.jar
lobbyaddress=lobby.aethryadnd.online
serverlist=http://config.aethryadnd.online/serverlist.ws
window_preferredwidth=1024
window_preferredheight=768`;

      return new Response(configText, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Default response for anything else
    return new Response("Game Config Server Online", { status: 200 });
  },
};
