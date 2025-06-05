import { DefaultLayout } from "./components/Layout.tsx";
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
      
      return await DefaultLayout({ 
        theme: "light", 
        isLoading: false,
        children: <Router pathname={url.pathname} />
      });
    } catch (err) {
      console.error("SSR error:", err);
      return <html><body><h1>Internal Server Error</h1></body></html>;
    }
  }
};