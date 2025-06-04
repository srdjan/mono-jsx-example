export function ContactForm() {
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