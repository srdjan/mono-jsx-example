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
      <nav>
        <ul>
          <li><a href="/" hx-get="/" hx-target="main" hx-push-url="true">Home</a></li>
          <li><a href="/posts" hx-get="/posts" hx-target="main" hx-push-url="true">Posts</a></li>
          <li><a href="/about" hx-get="/about" hx-target="main" hx-push-url="true">About</a></li>
        </ul>
        <ul>
          <li>
            <button 
              type="button"
              class="outline"
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
          </li>
        </ul>
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
      <article>
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
      </article>
      <article>
        <h2>Try the Demo</h2>
        <p>Navigate to different pages to see HTMX in action:</p>
        <ul>
          <li><strong>Posts</strong> - See lazy loading with HTMX</li>
          <li><strong>About</strong> - Try the enhanced contact form</li>
          <li><strong>Theme Toggle</strong> - Click the moon/sun button</li>
        </ul>
      </article>
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
        <article>
          <div class="loading" style="display: inline-block; margin-right: 0.5rem;"></div>
          Loading posts...
        </article>
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
          <article>
            <div class="loading" style="display: inline-block; margin-right: 0.5rem;"></div>
            Sending your message...
          </article>
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

        <button type="submit">
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
      <article>
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
      </article>

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
      <article class="success-message">
        ✓ Message sent successfully!
      </article>
    );
  }
  if (props.status === "error") {
    return (
      <article class="error-message">{props.message || "Please fill in all fields"}</article>
    );
  }
  if (props.status === "sending") {
    return (
      <article>
        <div class="loading" style="display: inline-block; margin-right: 0.5rem;"></div>
        Sending your message...
      </article>
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
    return <html><body><article class="error-message">Failed to load posts: {result.error.message}</article></body></html>;
  }

  return <html><body>
    <div>
      {result.value.map(post => (
        <article data-id={post.id}>
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
              {await Deno.readTextFile("./styles.css")}
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