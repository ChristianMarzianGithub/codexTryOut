import { company, quickLinks, serviceAreas } from '../data/siteContent';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <h3 className="footer__heading">About {company.name}</h3>
          <p>{company.mission}</p>
          <a className="footer__phone" href={`tel:${company.phone}`}>
            {company.phoneDisplay}
          </a>
        </div>
        <div>
          <h3 className="footer__heading">Quick Links</h3>
          <ul className="footer__list">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="footer__heading">Service Areas</h3>
          <ul className="footer__list footer__list--columns">
            {serviceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
