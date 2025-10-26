import { NavLink } from 'react-router-dom';
import { company } from '../data/siteContent';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/emergency', label: 'Emergency' },
  { to: '/financing', label: 'Financing' },
  { to: '/contact', label: 'Contact' }
];

function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__branding">
          <div className="header__badge">{company.tagline}</div>
          <h1 className="header__title">{company.name}</h1>
        </div>
        <nav className="header__nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `header__link${isActive ? ' header__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="header__cta">
          <a className="button button--primary" href={`tel:${company.phone}`}>Call {company.phoneDisplay}</a>
        </div>
      </div>
    </header>
  );
}

export default Header;
