# Mono-JSX + HTMX + Deno Demo

A modern web application demonstrating the power of combining **Mono-JSX**, **HTMX**, and **Deno** for building fast, type-safe, no-build and interactive web applications without complex JavaScript frameworks.

### Claude knows mono-jsx and HTMX 🚀

## Quick Start

```bash
# Start development server
deno task dev

# Or run directly
deno serve --allow-read app.tsx
```

Visit `http://localhost:8000` to see the demo in action.

## 🏗️ Architecture Overview

This project showcases a **single-file architecture** where the entire application lives in `app.tsx`, demonstrating:

### Mono-JSX Integration
- **Type-safe JSX**: Full TypeScript support with JSX components
- **Server-side rendering**: Components render to HTML on the server
- **Functional programming**: Pure function components with immutable state
- **Zero build step**: Deno serves TypeScript directly

### HTMX Enhancement
- **Progressive enhancement**: All features work without JavaScript
- **SPA-like navigation**: Page transitions without full reloads using `hx-target` and `hx-push-url`
- **Lazy loading**: Posts load dynamically with loading indicators
- **Form enhancement**: Async form submission with real-time status updates
- **Theme switching**: Dynamic theme toggle with server-side state management

### Deno Runtime
- **Native TypeScript**: No transpilation required
- **Web standard APIs**: Uses modern `fetch`, `Request`, and `Response`
- **Import maps**: Clean dependency management in `deno.json`
- **Secure by default**: Explicit permissions with `--allow-read`

## 🎯 Features Demonstrated

### 1. Result Type Pattern
```typescript
type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };
```
Explicit error handling without exceptions.

### 2. HTMX API Endpoints
- `POST /api/contact` - Form submission with validation
- `GET /api/posts` - Lazy-loaded content with loading states
- `POST /api/theme` - Theme toggle with client-side persistence

### 3. Progressive Enhancement
All HTMX features degrade gracefully:
- Navigation works with regular links
- Forms submit normally without JavaScript
- Content loads on page refresh if HTMX fails

### 4. Single-File Architecture
Everything in one file:
- Components and routing
- API endpoints and business logic
- CSS-in-JS with template literals
- TypeScript interfaces and types

## 🛠️ Technical Highlights

### HTMX Request Detection
```typescript
const isHTMXRequest = req.headers.get("HX-Request");
if (isHTMXRequest) {
  return <html><body><Router pathname={url.pathname} /></body></html>;
}
```

### Theme Persistence
```javascript
hx-on--htmx-after-request="
  const theme = event.detail.xhr.getResponseHeader('HX-Trigger')?.split(':')[1];
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
"
```

### Type-Safe Components
```typescript
function ContactForm() {
  return (
    <form 
      hx-post="/api/contact"
      hx-target="#form-status"
      hx-indicator="#loading-indicator"
    >
      {/* Form content */}
    </form>
  );
}
```

## 📁 Project Structure

```
mono-jsx-example/
├── app.tsx          # Complete application (components, routes, API)
├── styles.css       # CSS custom properties and HTMX styles
├── deno.json        # Deno configuration and import maps
├── deno.lock        # Dependency lock file
└── README.md        # This file
```

## 🔧 Development Commands

```bash
# Development server with hot reload
deno task dev

# Type checking
deno check app.tsx

# Run specific file
deno serve app.tsx
```

## 🌟 Why This Stack?

### Mono-JSX
- **Lightweight**: Minimal runtime overhead
- **Type-safe**: Full TypeScript integration
- **Server-first**: Optimized for SSR

### HTMX
- **Simplicity**: HTML attributes instead of complex JavaScript
- **Performance**: Minimal client-side JavaScript
- **Accessibility**: Works without JavaScript

### Deno
- **Modern**: Built on web standards
- **Secure**: Explicit permissions
- **Simple**: No package.json or node_modules

## 📚 Learn More

- [Mono-JSX Documentation](https://github.com/sebringrose/mono-jsx)
- [HTMX Documentation](https://htmx.org/)
- [Deno Documentation](https://deno.com/)

This demo proves that modern web development can be simple, fast, and enjoyable without sacrificing functionality or developer experience.