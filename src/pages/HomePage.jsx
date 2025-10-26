import { Link } from 'react-router-dom';
import { services, testimonials, faqs } from '../data/siteContent.js';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'center' }}>
          <div>
            <span className="badge">Family owned • Serving Riverview since 1998</span>
            <h1>Hello, we're ClearFlow Plumbing — your 24/7 local plumbing heroes.</h1>
            <p>
              From emergency leak repairs to full-scale remodels, our licensed team handles every job with hospitality,
              craftsmanship, and transparent pricing. Call now and we will be on-site within the hour.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link className="btn btn-primary" to="/contact">Request Service</Link>
              <Link className="btn btn-outline" to="/services">Explore Services</Link>
            </div>
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>5,000+</div>
                <div style={{ color: '#475569' }}>Jobs completed with 5-star reviews</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>60 min</div>
                <div style={{ color: '#475569' }}>Average emergency response time</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>25 yrs</div>
                <div style={{ color: '#475569' }}>Serving homes and businesses</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ background: '#fff', position: 'relative' }}>
            <h3 style={{ marginTop: 0 }}>Same-Day Appointments</h3>
            <p style={{ color: '#475569' }}>Schedule in minutes and track your technician in real time.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', color: '#0f172a', display: 'grid', gap: '0.75rem' }}>
              <li>✔ Live appointment confirmations</li>
              <li>✔ Text updates as we dispatch</li>
              <li>✔ Technicians with full background checks</li>
            </ul>
            <a className="btn btn-primary" href="tel:15552177562">Call our dispatch</a>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <h2>Popular Plumbing Services</h2>
          <p className="lead">
            Every job starts with a thorough diagnostic report and ends with a spotless workspace. Explore our most-requested services.
          </p>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {services.map((service) => (
              <article key={service.title} className="card">
                <div style={{ fontSize: '2rem' }}>{service.icon}</div>
                <h3>{service.title}</h3>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>{service.description}</p>
                <ul style={{ paddingLeft: '1.25rem', color: '#1e293b', lineHeight: 1.7 }}>
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
          <div>
            <h2>Why homeowners choose ClearFlow</h2>
            <p className="lead">
              Licensed, insured, and background-checked plumbers backed by a satisfaction guarantee on every job we complete.
            </p>
            <div className="card" style={{ background: '#0f172a', color: '#e2e8f0' }}>
              <h3>Triple-Checked Quality</h3>
              <p>Each project passes a technician checklist, supervisor sign-off, and customer walkthrough before completion.</p>
              <Link to="/about" className="btn btn-outline" style={{ background: '#1e293b', color: '#e2e8f0', borderColor: '#1e293b' }}>
                Meet the team
              </Link>
            </div>
          </div>
          <div className="card testimonial">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.name}>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#1e293b' }}>
                  “{testimonial.quote}”
                </p>
                <footer style={{ fontWeight: 600, color: '#334155' }}>
                  {testimonial.name} · {testimonial.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div>
            <h2>Frequently asked questions</h2>
            <p className="lead">Answers to the questions we hear most from new customers.</p>
          </div>
          <div>
            {faqs.map((faq) => (
              <div key={faq.question} className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginTop: 0 }}>{faq.question}</h3>
                <p style={{ color: '#475569', lineHeight: 1.6 }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
