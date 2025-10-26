import { financingOptions, company } from '../data/siteContent';

function FinancingPage() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section__title">Flexible financing</h2>
        <p className="section__lead">
          Major repairs and renovations shouldn’t wait. Explore financing programs tailored to homeowners, businesses, and
          property managers.
        </p>
        <div className="grid grid--three">
          {financingOptions.map((option) => (
            <article key={option.name} className="card card--highlight">
              <h3>{option.name}</h3>
              <p>{option.details}</p>
            </article>
          ))}
        </div>
        <div className="financing__cta">
          <p>
            Need help choosing a plan? Our coordinators can pre-qualify you over the phone with no impact to your credit score.
          </p>
          <a className="button button--primary" href={`tel:${company.phone}`}>
            Speak with financing specialist
          </a>
        </div>
      </div>
    </section>
  );
}

export default FinancingPage;
