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

interface AppSignals {
  theme: "light" | "dark";
  isLoading: boolean;
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
function Header(this: any) {
  const toggleTheme = () => {
    this.app.theme = this.app.theme === "light" ? "dark" : "light";
    this.effect(() => {
      document.documentElement.setAttribute('data-theme', this.app.theme);
      localStorage.setItem('theme', this.app.theme);
    });
  };

  return (
    <header>
      <nav class="container">
        <a href="/">Home</a>
        <a href="/posts">Posts</a>
        <a href="/about">About</a>
        <button class="btn theme-toggle" onClick={toggleTheme}>
          {this.computed(() => this.app.theme === "light" ? "🌙" : "☀️")}
        </button>
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <>
      <h1>Welcome to Mono-JSX SSR</h1>
      <p>
        This demo showcases server-side rendering with Mono-JSX using functional
        programming patterns, type safety, and reactive state management.
      </p>
      <div class="card">
        <h2>Features Demonstrated</h2>
        <ul>
          <li>Pure functional components with type safety</li>
          <li>Reactive signals for state management</li>
          <li>Streaming SSR with async components</li>
          <li>Result type for error handling</li>
          <li>Immutable data structures</li>
          <li>Theme switching with localStorage</li>
        </ul>
      </div>
    </>
  );
}

// Async component with streaming
async function PostList(
  this: any,
  props: { userId?: string }
) {
  const userId = props.userId || "default";
  const result = await fetchPostsByUser(userId);

  if (!result.ok) {
    return <div class="error">Failed to load posts: {result.error.message}</div>;
  }

  return (
    <div>
      {result.value.map(post => (
        <article class="card">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>
            Posted on {post.createdAt.toLocaleDateString()}
          </small>
        </article>
      ))}
    </div>
  );
}

function PostsPage() {
  return (
    <>
      <h1>Recent Posts</h1>
      <PostList placeholder={<div class="loading" />} />
    </>
  );
}

// Form handling with signals
function ContactForm(this: any) {
  this.status = "idle";

  const handleSubmit = async (data: FormData) => {
    this.status = "sending";

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const email = data.get("email") as string;
    const message = data.get("message") as string;

    if (!email || !message) {
      this.status = "error";
      return;
    }

    console.log("Form submitted:", { email, message });
    this.status = "sent";
  };

  return (
    <form action={handleSubmit}>
      <toggle show={this.computed(() => this.status === "sent")}>
        <div class="card" style="background: #4caf50; color: white;">
          ✓ Message sent successfully!
        </div>
      </toggle>

      <toggle show={this.computed(() => this.status === "error")}>
        <div class="error">Please fill in all fields</div>
      </toggle>

      <input
        type="email"
        name="email"
        placeholder="Your email"
        required
        disabled={this.computed(() => this.status === "sending")}
      />

      <textarea
        name="message"
        placeholder="Your message"
        rows={5}
        required
        disabled={this.computed(() => this.status === "sending")}
      />

      <button
        type="submit"
        class="btn"
        disabled={this.computed(() => this.status === "sending")}
      >
        {this.computed(() =>
          this.status === "sending" ? "Sending..." : "Send Message"
        )}
      </button>
    </form>
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

// ============= Server Entry Point =============
export default {
  fetch: (req: Request) => {
    const url = new URL(req.url);

    return (
      <html app={{ theme: "light", isLoading: false }}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>Mono-JSX SSR Demo</title>
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
          `}</style>
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
  }
};