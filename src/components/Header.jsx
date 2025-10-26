import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/emergency', label: 'Emergency' },
  { to: '/financing', label: 'Financing' },
  { to: '/contact', label: 'Contact' }
];

export default function Header() {
  return (
    <header className="header">
      <div className="container navbar">
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.35rem' }}>
          ClearFlow Plumbing
        </Link>
        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                color: isActive ? '#0284c7' : '#0f172a'
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <a className="btn btn-primary" href="tel:15552177562">
          Call (555) 217-7562
        </a>
      </div>
    </header>
  );
}
