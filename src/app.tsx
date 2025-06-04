import { Header } from "./components/Header.tsx";
import { Router } from "./components/Router.tsx";
import { 
  handleContactSubmit,
  handlePostsLoad,
  handleThemeToggle
} from "./handlers.tsx";

// --- Add error logging to server entry point ---
export default {
  fetch: async (req: Request) => {
    try {
      const url = new URL(req.url);
      
      // Serve static CSS file
      if (req.method === "GET" && url.pathname === "/styles.css") {
        const css = await Deno.readTextFile("./styles.css");
        return new Response(css, {
          headers: { "Content-Type": "text/css" }
        });
      }
      
      // Handle HTMX endpoints
      if (req.method === "POST" && url.pathname === "/api/contact") {
        return await handleContactSubmit(req);
      }
      if (req.method === "GET" && url.pathname === "/api/posts") {
        return await handlePostsLoad();
      }
      if (req.method === "POST" && url.pathname === "/api/theme") {
        return handleThemeToggle(req);
      }
      
      // Handle HTMX navigation requests (check for HX-Request header)
      const isHTMXRequest = req.headers.get("HX-Request");
      if (isHTMXRequest) {
        return <html><body><div><Router pathname={url.pathname} /></div></body></html>;
      }
      
      return (
        <html app={{ theme: "light", isLoading: false }}>
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" />
            <title>Mono-JSX + HTMX Demo</title>
            <style>
              {`@import url('https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css');`}
            </style>
            <style>
              {await Deno.readTextFile("./public/styles.css")}
            </style>
            <script src="https://unpkg.com/htmx.org@2.0.4"></script>
            <script>
              {`document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');`}
            </script>
          </head>
          <body>
            <Header />
            <main>
              <Router pathname={url.pathname} />
            </main>
          </body>
        </html>
      );
    } catch (err) {
      console.error("SSR error:", err);
      return <html><body><h1>Internal Server Error</h1></body></html>;
    }
  }
};