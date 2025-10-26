import { contactDetails } from '../data/siteContent.js';

export default function EmergencyPage() {
  return (
    <main>
      <section className="section section--muted">
        <div className="container" style={{ maxWidth: '820px' }}>
          <span className="badge">Emergency Plumbing</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Fast-response emergency crews on standby</h1>
          <p className="lead">
            Burst pipe? Backed-up sewer line? Our rapid response team is available around the clock with a guaranteed
            on-site arrival within 60 minutes anywhere in Riverview.
          </p>
          <div className="card" style={{ marginBottom: '2rem', background: '#0f172a', color: '#e2e8f0' }}>
            <h3>Call our emergency hotline</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{contactDetails.emergencyPhone}</p>
            <p>Dispatch will confirm details, provide an ETA, and send technician profiles directly to your phone.</p>
            <a className="btn btn-primary" href={`tel:${contactDetails.emergencyPhone.replace(/[^\d]/g, '')}`}>
              Call now
            </a>
          </div>
          <div className="card">
            <h3>What to expect</h3>
            <ol style={{ lineHeight: 1.8 }}>
              <li>Immediate phone triage to help you shut off water or gas if needed.</li>
              <li>Digital service agreement with transparent pricing before dispatch.</li>
              <li>Technician arrival updates and live vehicle tracking.</li>
              <li>Photo report and insurance-ready documentation post-service.</li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
