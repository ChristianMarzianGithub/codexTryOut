import { services } from '../data/siteContent.js';

export default function ServicesPage() {
  return (
    <main>
      <section className="section section--light">
        <div className="container">
          <span className="badge">Services</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Full-service plumbing solutions</h1>
          <p className="lead">
            Whether it is a pinhole leak or a full commercial build-out, ClearFlow Plumbing provides licensed specialists
            equipped with cutting-edge tools and a customer-first mindset.
          </p>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {services.map((service) => (
              <article key={service.title} className="card">
                <div style={{ fontSize: '2rem' }}>{service.icon}</div>
                <h3>{service.title}</h3>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>{service.description}</p>
                <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
                  {service.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div className="card" style={{ background: '#0f172a', color: '#e2e8f0' }}>
            <h3>Commercial Services</h3>
            <p>
              From restaurants to multi-family complexes, our commercial team provides preventative maintenance and rapid response plans tailored to your operations.
            </p>
            <ul style={{ lineHeight: 1.7 }}>
              <li>Grease trap maintenance</li>
              <li>Backflow testing & certification</li>
              <li>Annual inspection packages</li>
            </ul>
          </div>
          <div className="card">
            <h3>Residential Comfort Plans</h3>
            <p>
              Subscribe to quarterly inspections and priority scheduling with our Comfort Club membership.
            </p>
            <ul style={{ lineHeight: 1.7 }}>
              <li>Annual whole-home plumbing inspection</li>
              <li>10% savings on repairs</li>
              <li>Front-of-line scheduling</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
