type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

const Ok = <T,>(value: T): Result<T> => ({ ok: true, value });
const Err = <E,>(error: E): Result<never, E> => ({ ok: false, error });

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

interface Post {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly authorId: string;
  readonly createdAt: Date;
}

interface AppState {
  readonly currentUser: User | null;
  readonly theme: "light" | "dark";
}

// ============= Data Layer (Pure Functions) =============
const fetchPostsByUser = async (userId: string): Promise<Result<Post[]>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 150));
    return Ok([
      {
        id: "1",
        title: "Introduction to Functional Programming",
        content: "FP is a programming paradigm that treats computation as evaluation of mathematical functions...",
        authorId: userId,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        title: "Type-Driven Development with TypeScript",
        content: "Using TypeScript's type system to guide software design and implementation...",
        authorId: userId,
        createdAt: new Date("2024-02-20"),
      },
    ]);
  } catch (error) {
    return Err(error as Error);
  }
};

// ============= Components =============
// Use a specific type for mono-jsx component context
interface MonoJSXContext {
  app: AppState;
  effect: (fn: () => void) => void;
  computed: <T>(fn: () => T) => T;
  // Allow additional properties, but avoid 'any'.
  [key: string]: unknown;
}

function Header() {
  return (
    <header>
      <nav class="container">
        <a href="/" hx-get="/" hx-target="main" hx-push-url="true">Home</a>
        <a href="/posts" hx-get="/posts" hx-target="main" hx-push-url="true">Posts</a>
        <a href="/about" hx-get="/about" hx-target="main" hx-push-url="true">About</a>
        <button 
          class="btn theme-toggle" 
          type="button"
          hx-post="/api/theme"
          hx-include="closest header"
          hx-vals='js:{"theme": document.documentElement.getAttribute("data-theme") || "light"}'
          hx-swap="innerHTML"
          hx-on--htmx-after-request="
            const theme = event.detail.xhr.getResponseHeader('HX-Trigger')?.split(':')[1];
            if (theme) {
              document.documentElement.setAttribute('data-theme', theme);
              localStorage.setItem('theme', theme);
            }
          "
        >
          🌙
        </button>
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <>
      <h1>Welcome to Mono-JSX + HTMX</h1>
      <p>
        This demo showcases server-side rendering with Mono-JSX enhanced with HTMX 
        for modern web interactions without complex JavaScript frameworks.
      </p>
      <div class="card">
        <h2>Features Demonstrated</h2>
        <ul>
          <li>HTMX-enhanced forms with async submission</li>
          <li>Lazy loading content with loading indicators</li>
          <li>SPA-like navigation without page reloads</li>
          <li>Progressive enhancement (works without JS)</li>
          <li>Theme switching with HTMX attributes</li>
          <li>Result type for error handling</li>
          <li>Functional programming patterns</li>
          <li>Type-safe server-side rendering</li>
        </ul>
      </div>
      <div class="card">
        <h2>Try the Demo</h2>
        <p>Navigate to different pages to see HTMX in action:</p>
        <ul>
          <li><strong>Posts</strong> - See lazy loading with HTMX</li>
          <li><strong>About</strong> - Try the enhanced contact form</li>
          <li><strong>Theme Toggle</strong> - Click the moon/sun button</li>
        </ul>
      </div>
    </>
  );
}

// --- PostList: HTMX Lazy Loading ---
function PostList() {
  return (
    <div 
      hx-get="/api/posts"
      hx-trigger="load"
      hx-indicator="#posts-loading"
    >
      <div id="posts-loading" class="htmx-indicator">
        <div class="card">
          <div class="loading" style="display: inline-block; margin-right: 0.5rem;"></div>
          Loading posts...
        </div>
      </div>
    </div>
  );
}

function PostsPage() {
  return (
    <>
      <h1>Recent Posts</h1>
      <PostList />
    </>
  );
}

// --- ContactForm: HTMX Enhanced ---
function ContactForm() {
  return (
    <div>
      <div id="form-status"></div>
      <form 
        action="/api/contact"
        method="POST"
        hx-post="/api/contact"
        hx-target="#form-status"
        hx-indicator="#loading-indicator"
        hx-swap="innerHTML"
        hx-on--before-request="this.querySelector('button').disabled = true"
        hx-on--after-request="this.querySelector('button').disabled = false"
      >
        <div id="loading-indicator" class="htmx-indicator">
          <div class="card">
            <div class="loading" style="display: inline-block; margin-right: 0.5rem;"></div>
            Sending your message...
          </div>
        </div>

        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            placeholder="Your message"
            rows={5}
            required
          />
        </label>

        <button type="submit" class="btn">
          Send Message
        </button>
      </form>
    </div>
  );
}

function AboutPage() {
  return (
    <>
      <h1>About This Demo</h1>
      <div class="card">
        <p>
          This demonstration showcases the power of Mono-JSX for building
          server-side rendered applications with Deno.
        </p>
        <h3>Architecture Highlights</h3>
        <ul>
          <li>Zero dependencies beyond mono-jsx</li>
          <li>Type-safe functional components</li>
          <li>Immutable state management with signals</li>
          <li>Result types for explicit error handling</li>
          <li>Streaming SSR for optimal performance</li>
        </ul>
      </div>

      <h2>Contact Us</h2>
      <ContactForm />
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/">← Back to Home</a>
    </>
  );
}

// ============= Router Component =============
function Router(props: { pathname: string }) {
  switch (props.pathname) {
    case "/":
      return <HomePage />;
    case "/posts":
      return <PostsPage />;
    case "/about":
      return <AboutPage />;
    default:
      return <NotFoundPage />;
  }
}

// ============= HTMX Endpoints =============
function ContactFormStatus(props: { status: string; message?: string }) {
  if (props.status === "sent") {
    return (
      <div class="card" style="background: #4caf50; color: white;">
        ✓ Message sent successfully!
      </div>
    );
  }
  if (props.status === "error") {
    return (
      <div class="error">{props.message || "Please fill in all fields"}</div>
    );
  }
  if (props.status === "sending") {
    return (
      <div class="card">
        <div class="loading" style="display: inline-block; margin-right: 0.5rem;"></div>
        Sending your message...
      </div>
    );
  }
  return null;
}

async function handleContactSubmit(req: Request): Promise<Response> {
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!email || !message) {
    return <html><body><ContactFormStatus status="error" message="Please fill in all fields" /></body></html>;
  }

  console.log("Form submitted:", { email, message });
  return <html><body><ContactFormStatus status="sent" /></body></html>;
}

async function handlePostsLoad(): Promise<Response> {
  const result = await fetchPostsByUser("default");
  
  if (!result.ok) {
    return <html><body><div class="error">Failed to load posts: {result.error.message}</div></body></html>;
  }

  return <html><body>
    <div>
      {result.value.map(post => (
        <article class="card" data-id={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>
            Posted on {post.createdAt.toLocaleDateString()}
          </small>
        </article>
      ))}
    </div>
  </body></html>;
}

function handleThemeToggle(req: Request): Response {
  const url = new URL(req.url);
  const currentTheme = url.searchParams.get("theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  
  return new Response(
    newTheme === "light" ? "🌙" : "☀️",
    { 
      headers: { 
        "Content-Type": "text/html",
        "HX-Trigger": `themeChanged:${newTheme}`
      } 
    }
  );
}

// --- Add error logging to server entry point ---
export default {
  fetch: async (req: Request) => {
    try {
      const url = new URL(req.url);
      
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
            {/* Use a self-closing meta tag with only the name attribute, as mono-jsx does not support 'content' */}
            <meta name="viewport" />
            <title>Mono-JSX + HTMX Demo</title>
            <style>{css`
              :root {
                --bg: #ffffff;
                --fg: #1a1a1a;
                --accent: #0066cc;
                --border: #e0e0e0;
              }
              [data-theme="dark"] {
                --bg: #1a1a1a;
                --fg: #ffffff;
                --accent: #4499ff;
                --border: #333333;
              }
              * { box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: var(--fg);
                background: var(--bg);
                margin: 0;
                padding: 0;
                transition: background 0.3s, color 0.3s;
              }
              .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
              }
              header {
                border-bottom: 1px solid var(--border);
                padding: 1rem 0;
                margin-bottom: 2rem;
              }
              nav {
                display: flex;
                gap: 2rem;
                align-items: center;
              }
              a {
                color: var(--accent);
                text-decoration: none;
                &:hover { text-decoration: underline; }
              }
              .btn {
                padding: 0.5rem 1rem;
                background: var(--accent);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
                &:hover { opacity: 0.9; }
              }
              .theme-toggle {
                margin-left: auto;
                background: transparent;
                color: var(--fg);
                border: 1px solid var(--border);
              }
              .card {
                background: var(--bg);
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 1.5rem;
                margin-bottom: 1rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .loading {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid var(--border);
                border-radius: 50%;
                border-top-color: var(--accent);
                animation: spin 1s ease-in-out infinite;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
              form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                max-width: 500px;
              }
              input, textarea {
                padding: 0.5rem;
                border: 1px solid var(--border);
                border-radius: 4px;
                font-size: 1rem;
                background: var(--bg);
                color: var(--fg);
              }
              .error {
                color: #ff4444;
                padding: 1rem;
                border: 1px solid #ff4444;
                border-radius: 4px;
                background: rgba(255, 68, 68, 0.1);
              }
              .htmx-indicator {
                opacity: 0;
                transition: opacity 0.3s ease;
              }
              .htmx-request .htmx-indicator {
                opacity: 1;
              }
              .htmx-request.htmx-indicator {
                opacity: 1;
              }
              [hx-disabled] {
                opacity: 0.6;
                pointer-events: none;
              }
            `}</style>
            <script src="https://unpkg.com/htmx.org@1.9.10"></script>
            <script>{js`
              document.documentElement.setAttribute('data-theme', 
                localStorage.getItem('theme') || 'light'
              );
            `}</script>
          </head>
          <body>
            <Header />
            <main class="container">
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