import { Link } from 'react-router-dom';
import { company, services, testimonials } from '../data/siteContent';

function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="hero__greeting">Hello!</p>
            <h2 className="hero__headline">Reliable plumbing solutions for busy homeowners & businesses.</h2>
            <p className="hero__subhead">
              {company.name} handles leaks, clogs, remodels, and emergencies with seasoned technicians and upfront pricing.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/contact">Request Service</Link>
              <Link className="button" to="/services">Explore Services</Link>
            </div>
          </div>
          <div className="hero__card">
            <h3>Same-Day Availability</h3>
            <ul>
              <li>24/7 emergency dispatch</li>
              <li>Licensed, insured technicians</li>
              <li>Upfront estimates with zero surprises</li>
            </ul>
            <a className="hero__phone" href={`tel:${company.phone}`}>
              Call {company.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <h3 className="section__title">Featured Services</h3>
          <div className="grid grid--services">
            {services.map((service) => (
              <article key={service.title} className="card">
                <h4>{service.title}</h4>
                <p>{service.description}</p>
                <span className="card__price">Starting at ${service.startingPrice}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h3 className="section__title">Why choose ClearFlow?</h3>
          <div className="grid grid--three">
            <div className="card">
              <h4>Certified Experts</h4>
              <p>Master plumbers with 20+ years of experience across residential, commercial, and industrial systems.</p>
            </div>
            <div className="card">
              <h4>Transparent Pricing</h4>
              <p>No surprise add-ons. You approve every project scope and estimate before work begins.</p>
            </div>
            <div className="card">
              <h4>Customer-First Care</h4>
              <p>Clean uniforms, shoe covers, and respect for your space. We leave your property better than we found it.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <h3 className="section__title">Happy customers</h3>
          <div className="grid grid--testimonials">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.author} className="testimonial">
                <p>“{testimonial.quote}”</p>
                <cite>{testimonial.author}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
