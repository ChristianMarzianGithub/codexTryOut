import { company, hours } from '../data/siteContent';

function AboutPage() {
  return (
    <section className="section">
      <div className="container about">
        <div>
          <h2 className="section__title">About {company.name}</h2>
          <p>
            ClearFlow Plumbing was founded to bring neighborly service back to the trades. Our lead technicians have decades of
            experience resolving complex plumbing challenges in historic homes, high-rise buildings, and busy commercial
            kitchens.
          </p>
          <p>
            We believe in clear communication, respectful service, and craftsmanship that stands the test of time. When you call
            ClearFlow, you connect with a dedicated coordinator who manages your project end-to-end.
          </p>
          <ul className="about__list">
            <li>Licensed, bonded, and insured professionals</li>
            <li>Background-checked team members</li>
            <li>EPA WaterSense® certified partner</li>
            <li>Community give-back program supporting local shelters</li>
          </ul>
        </div>
        <aside className="about__aside">
          <div className="card">
            <h3>Visit our office</h3>
            <p>{company.address}</p>
            <p>{company.email}</p>
          </div>
          <div className="card">
            <h3>Hours</h3>
            <ul className="about__hours">
              <li>{hours.weekdays}</li>
              <li>{hours.saturday}</li>
              <li>{hours.emergency}</li>
            </ul>
          </div>
          <div className="card">
            <h3>Licenses</h3>
            <p>{company.license}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default AboutPage;
