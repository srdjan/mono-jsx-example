export function Header() {
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