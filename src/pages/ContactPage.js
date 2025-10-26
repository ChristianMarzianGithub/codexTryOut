import { company } from '../data/siteContent';

function ContactPage() {
  return (
    <section className="section">
      <div className="container contact">
        <div>
          <h2 className="section__title">Schedule service or request an estimate</h2>
          <p className="section__lead">
            Reach out via phone, email, or the message form and we’ll respond within one business hour.
          </p>
          <div className="contact__details">
            <a className="contact__detail" href={`tel:${company.phone}`}>
              Phone: {company.phoneDisplay}
            </a>
            <a className="contact__detail" href={`mailto:${company.email}`}>
              Email: {company.email}
            </a>
            <address className="contact__detail">Office: {company.address}</address>
          </div>
          <div className="card contact__promise">
            <h3>Our commitment</h3>
            <p>
              We respect your time. Expect punctual arrivals, clear communication, and technicians who treat your home with care.
            </p>
          </div>
        </div>
        <form className="contact__form">
          <label>
            Name
            <input type="text" name="name" placeholder="Alex Smith" required />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="alex@example.com" required />
          </label>
          <label>
            Service needed
            <select name="service" defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              <option value="leak">Leak repair</option>
              <option value="drain">Drain cleaning</option>
              <option value="heater">Water heater</option>
              <option value="remodel">Remodel project</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Message
            <textarea name="message" rows="4" placeholder="Tell us how we can help." />
          </label>
          <button type="submit" className="button button--primary">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactPage;
