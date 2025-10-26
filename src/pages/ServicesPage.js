import { services } from '../data/siteContent';

function ServicesPage() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section__title">Professional plumbing services</h2>
        <p className="section__lead">
          From preventative maintenance to complex installs, ClearFlow Plumbing covers every pipe, fixture, and drain in your
          home or business.
        </p>
        <div className="grid grid--services">
          {services.map((service) => (
            <article key={service.title} className="card card--highlight">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="card__price">Starting at ${service.startingPrice}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesPage;
