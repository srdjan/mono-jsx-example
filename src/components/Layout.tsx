import { Header } from "./Header.tsx";

interface LayoutProps {
  children: any;
  title?: string;
  theme?: string;
  isLoading?: boolean;
}

export async function DefaultLayout({ children, title = "Mono-JSX + HTMX Demo", theme = "light", isLoading = false }: LayoutProps) {
  const customStyles = await Deno.readTextFile("./public/styles.css");
  
  return (
    <html app={{ theme, isLoading }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" />
        <title>{title}</title>
        <style>
          {`@import url('https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css');`}
        </style>
        <style>
          {customStyles}
        </style>
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
        <script>
          {`document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');`}
        </script>
      </head>
      <body>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

export function MinimalLayout({ children, title = "Mono-JSX + HTMX Demo" }: LayoutProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" />
        <title>{title}</title>
        <style>
          {`@import url('https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css');`}
        </style>
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}