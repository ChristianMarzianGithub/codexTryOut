export default function AboutPage() {
  return (
    <main>
      <section className="section section--light">
        <div className="container" style={{ maxWidth: '840px' }}>
          <span className="badge">About ClearFlow</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Craftsmanship rooted in family values</h1>
          <p className="lead">
            ClearFlow Plumbing began in 1998 when founder Maria Alvarez set out to combine old-world craftsmanship with modern transparency.
            Today, our family-run team of 32 technicians serves residential and commercial clients across Riverview and the surrounding counties.
          </p>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3>Our promise</h3>
            <ul style={{ lineHeight: 1.8 }}>
              <li>Technicians who treat your home as their own—shoe covers, floor protection, and spotless clean-up are mandatory.</li>
              <li>Clear, upfront pricing with detailed estimates before any work begins.</li>
              <li>Lifetime workmanship warranty on all installations.</li>
            </ul>
          </div>
          <div className="card">
            <h3>Leadership team</h3>
            <ul style={{ lineHeight: 1.8 }}>
              <li><strong>Maria Alvarez</strong>, Founder & Master Plumber — 25 years experience, board member of the Plumbing Trade Association.</li>
              <li><strong>Jacob Miles</strong>, Operations Director — Former military logistics officer ensuring precise scheduling and dispatch.</li>
              <li><strong>Aaliyah Chen</strong>, Customer Experience Lead — Oversees our 5-star support and satisfaction surveys.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
