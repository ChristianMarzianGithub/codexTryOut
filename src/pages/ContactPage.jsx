import { contactDetails } from '../data/siteContent.js';

export default function ContactPage() {
  return (
    <main>
      <section className="section section--muted">
        <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div>
            <span className="badge">Contact Us</span>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Schedule service or request an estimate</h1>
            <p className="lead">
              Our dispatch desk is available 24/7. Complete the form or call us and we will confirm your appointment within minutes.
            </p>
            <div className="card">
              <h3>Contact details</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
                <li><strong>Office:</strong> <a href={`tel:${contactDetails.phone}`}>{contactDetails.phone}</a></li>
                <li><strong>Emergency:</strong> <a href={`tel:${contactDetails.emergencyPhone}`}>{contactDetails.emergencyPhone}</a></li>
                <li><strong>Email:</strong> <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></li>
                <li><strong>Address:</strong> {contactDetails.address}</li>
                <li><strong>Hours:</strong> {contactDetails.hours}</li>
              </ul>
            </div>
          </div>
          <form className="card" style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Name</label>
              <input id="name" name="name" type="text" placeholder="Jane Doe" required style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
              <div>
                <label htmlFor="phone" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Phone</label>
                <input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" required style={inputStyle} />
              </div>
              <div>
                <label htmlFor="email" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Email</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" style={inputStyle} />
              </div>
            </div>
            <div>
              <label htmlFor="service" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Service needed</label>
              <select id="service" name="service" defaultValue="" required style={inputStyle}>
                <option value="" disabled>Select a service</option>
                <option value="emergency">Emergency Repair</option>
                <option value="install">Installation / Upgrade</option>
                <option value="maintenance">Maintenance Plan</option>
                <option value="remodel">Remodel / Construction</option>
              </select>
            </div>
            <div>
              <label htmlFor="details" style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Project details</label>
              <textarea id="details" name="details" rows="5" placeholder="Tell us what’s going on..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button className="btn btn-primary" type="submit">Send request</button>
            <small style={{ color: '#64748b' }}>We respond within 10 minutes during business hours.</small>
          </form>
        </div>
      </section>
    </main>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '0.75rem',
  border: '1px solid #cbd5f5',
  fontSize: '1rem',
  fontFamily: 'inherit',
  background: '#fff',
  boxShadow: '0 2px 4px rgba(15, 23, 42, 0.05) inset'
};
