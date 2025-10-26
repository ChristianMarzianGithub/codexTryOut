import { emergencyTips, company } from '../data/siteContent';

function EmergencyPage() {
  return (
    <section className="section section--emergency">
      <div className="container">
        <h2 className="section__title">24/7 Emergency Plumbing</h2>
        <p className="section__lead">
          Call our hotline anytime day or night for leaks, backups, or burst pipes. Average arrival time is under 60 minutes
          within our service area.
        </p>
        <div className="emergency__grid">
          <div className="card">
            <h3>Immediate Steps</h3>
            <ul className="emergency__tips">
              {emergencyTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="card emergency__cta">
            <h3>Call Now</h3>
            <p>
              Speak directly with a dispatcher who can walk you through safety steps while a technician is on the way.
            </p>
            <a className="button button--primary" href={`tel:${company.phone}`}>
              Emergency Hotline: {company.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmergencyPage;
