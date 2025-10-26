export default function FinancingPage() {
  return (
    <main>
      <section className="section section--light">
        <div className="container" style={{ maxWidth: '820px' }}>
          <span className="badge">Financing Options</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Flexible financing for plumbing upgrades</h1>
          <p className="lead">
            Invest in long-term comfort without delaying critical projects. ClearFlow partners with neighborhood credit unions to offer low-interest payment plans tailored to your budget.
          </p>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3>Highlights</h3>
            <ul style={{ lineHeight: 1.8 }}>
              <li>0% APR introductory plans up to 18 months for qualified homeowners.</li>
              <li>No prepayment penalties or hidden fees.</li>
              <li>Instant approvals in less than 3 minutes via secure digital forms.</li>
            </ul>
          </div>
          <div className="card" style={{ background: '#0f172a', color: '#e2e8f0' }}>
            <h3>How to apply</h3>
            <ol style={{ lineHeight: 1.8 }}>
              <li>Schedule a consultation call with our financing concierge.</li>
              <li>Receive a tailored project estimate and financing recommendations.</li>
              <li>Complete the secure application from any device.</li>
              <li>Approve the project plan and choose installation dates that work for you.</li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
