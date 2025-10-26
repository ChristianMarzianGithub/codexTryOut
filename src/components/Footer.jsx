import { Link } from 'react-router-dom';
import { contactDetails, serviceAreas } from '../data/siteContent.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div>
          <h3 style={{ marginTop: 0 }}>ClearFlow Plumbing</h3>
          <p style={{ color: '#cbd5f5', lineHeight: 1.6 }}>
            Trusted by 5,000+ homeowners and businesses for reliable plumbing craftsmanship, transparent pricing, and white-glove service.
          </p>
        </div>
        <div>
          <h4>Contact</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', lineHeight: 1.8 }}>
            <li>Office: <a href={`tel:${contactDetails.phone}`}>{contactDetails.phone}</a></li>
            <li>Emergency: <a href={`tel:${contactDetails.emergencyPhone}`}>{contactDetails.emergencyPhone}</a></li>
            <li>Email: <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></li>
            <li>{contactDetails.address}</li>
            <li>License: {contactDetails.license}</li>
          </ul>
        </div>
        <div>
          <h4>Service Areas</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', lineHeight: 1.8 }}>
            {serviceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#e2e8f0', lineHeight: 1.8 }}>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/emergency">Emergency</Link></li>
            <li><Link to="/financing">Financing</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8' }}>
        © {new Date().getFullYear()} ClearFlow Plumbing. All rights reserved.
      </div>
    </footer>
  );
}
