import Link from 'next/link';

export default function ServicesHero() {
  return (
    <section className="services-hero">
      <div className="section-inner reveal">
        <Link href="/" className="services-back-link">&larr; back to home</Link>
        <p className="hero-eyebrow">Grand Rapids, MI</p>
        <h1>services</h1>
        <p className="services-hero-sub">
          pastry box subscriptions, group lunch sandwich orders, and bread &amp; english muffin
          subscriptions — baked fresh, on your schedule.
        </p>
      </div>
    </section>
  );
}
