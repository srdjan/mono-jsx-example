# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- Start development server: `deno task dev`
- Run the application directly: `deno serve app.tsx`
- Check TypeScript types: `deno check app.tsx`

## Architecture Overview

This is a Mono-JSX + HTMX demo application built with Deno. The entire application is contained in a single `app.tsx` file that demonstrates functional programming patterns with server-side rendering enhanced by HTMX for modern web interactions.

### Key Architecture Patterns

- **Mono-JSX Framework**: Uses `mono-jsx` for JSX rendering with a functional component approach
- **HTMX Integration**: Progressive enhancement with HTMX for dynamic interactions without complex JavaScript
- **Result Type Pattern**: All async operations use `Result<T, E>` type for explicit error handling instead of throwing exceptions
- **Progressive Enhancement**: All features work without JavaScript and are enhanced with HTMX
- **API Endpoints**: Dedicated routes return HTML fragments for HTMX requests

### HTMX Features Implemented

- **Form Enhancement**: Contact form with async submission and status updates
- **Lazy Loading**: Posts load dynamically with loading indicators
- **SPA Navigation**: Page transitions without full reloads using `hx-target` and `hx-push-url`
- **Theme Toggle**: Dynamic theme switching with server-side state management
- **Progressive Enhancement**: All features degrade gracefully without JavaScript

### API Endpoints

- `POST /api/contact`: Handles form submissions, returns status HTML
- `GET /api/posts`: Returns post list HTML for lazy loading
- `POST /api/theme`: Toggles theme, returns new icon and triggers theme change

### Styling

- CSS-in-JS using template literals with `css` tag
- CSS custom properties for theming (light/dark mode)
- HTMX indicator styles for loading states
- No external CSS framework dependencies

### HTMX Request Detection

- Uses `HX-Request` header to determine if request comes from HTMX
- Returns HTML fragments for HTMX requests vs full pages for regular requests

### Development Notes

- Single-file architecture: All components, routes, and server logic in `app.tsx`
- No build step required - Deno serves TypeScript directly
- CSS and JavaScript are inlined using template literals with `css` and `js` tags
- HTMX CDN loaded from unpkg for client-side enhancements