/** @jsxImportSource mono-jsx */
import { FC } from "mono-jsx";

function Input(this: FC<{ name: string, value: string, type?: "text" | "email" | "password", label?: string }, {}>, props: { name: string, value: string, type?: "text" | "email" | "password", label?: string }) {
  this.value = props.value
  this.name = props.name
  this.type = props.type || "text"
  this.label = props.label || ""

  return (
    <p>
      <label for={this.name}>
        {this.label}
        <input type={this.type} value={this.value} name={this.name} />
      </label>
    </p>
  )
}

function Button(this: FC<{ type?: "submit" | "link" | "button", label: string, href?: string }>, props: { type?: "submit" | "link" | "button", label: string, href?: string }) {
  if (props.type === "submit") {
    return (
      <button type="submit">
        {props.label}
      </button>
    )
  }

  if (props.type === "link") {
    return (
      <a href={props.href}>
        {props.label}
      </a>
    )
  }

  return (
    <button type="button">
      {props.label}
    </button>
  )
}

function LoginForm(this: FC) {
  return (
    <form action="/login" method="POST">
      <div>
        <Input name="email" value="" type="email" label="Email" />
        <Input name="password" value="" type="password" label="Password" />
      </div>
      <Button label="Login" type="submit" />
    </form>
  )
}

function HomePage() {
  return (
    <>
      <Button label="Go to login" type="link" href="/login" />
    </>
  )
}

export default {
  routes: {
    "/api/users": req => Response.json([
      {
        "email": "user1@example.com",
        "password": "P@ssw0rd1"
      },
      {
        "email": "user2@example.com",
        "password": "P@ssw0rd2"
      },
      {
        "email": "user3@example.com",
        "password": "P@ssw0rd3"
      }
    ]),

    "/login": async (req) => {
      // Handle POST request
      if (req.method === 'POST') {
        const formData = await req.formData();
        const email = formData.get("email");
        const password = formData.get("password");

        const usersUrl = new URL("/api/users", req.url).toString();
        const usersResponse = await fetch(usersUrl);
        const users = await usersResponse.json();

        const user = users.find((u: { email: string, password: string }) =>
          u.email === email && u.password === password
        );

        const authorized = !!user;

        return (
          <html
            request={req}
            status={authorized ? 200 : 401}
          >
            <body>
              {authorized ? (
                <>
                  <h1>Hi, {email}!</h1>
                  <p>You have logged in successfully.</p>
                </>
              ) : (
                <>
                  <h1>Access denied</h1>
                  <p>Invalid credentials.</p>
                  <Button label="Try again" type="link" href="/login" />
                </>
              )}
            </body>
          </html>
        );
      }

      // Handle GET request - show login form
      return (
        <html>
          <body>
            <h1>Login page</h1>
            <LoginForm />
          </body>
        </html>
      );
    }
  },

  fetch: (req) => {
    const auth = { email: "" }
    return (
      <html
        request={req}
        status={200}
        context={{ auth }}
      >
        <body>
          <HomePage />
        </body>
      </html>
    )
  }
}