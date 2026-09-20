import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import ServicesHero from '@/components/ServicesHero';
import PastryBoxSection from '@/components/PastryBoxSection';
import SandwichSection from '@/components/SandwichSection';
import BreadSubscriptionSection from '@/components/BreadSubscriptionSection';
import ServiceInquiryForm from '@/components/ServiceInquiryForm';
import {
  client,
  PASTRY_BOX_QUERY,
  SANDWICH_SERVICE_QUERY,
  BREAD_SUBSCRIPTION_QUERY,
  TESTIMONIALS_QUERY,
} from '@/lib/sanity';

// Build-time feature flag: the Services page isn't public yet. Flip
// NEXT_PUBLIC_SERVICES_ENABLED to 'true' in the deploy workflow (and
// redeploy) to launch it. While off, this route builds to a plain
// "not found" page with no Services content or metadata in its source,
// and the nav link is hidden (see Nav.tsx).
const SERVICES_ENABLED = process.env.NEXT_PUBLIC_SERVICES_ENABLED === 'true';

export function generateMetadata(): Metadata {
  if (!SERVICES_ENABLED) return {};

  return {
    title: 'Services — Molta Bakery',
    description: 'Pastry box subscriptions, group lunch sandwich orders, and bread & English muffin subscriptions from Molta Bakery.',
    openGraph: {
      title: 'Services — Molta Bakery',
      description: 'Pastry box subscriptions, group lunch sandwich orders, and bread & English muffin subscriptions from Molta Bakery.',
      url: 'https://moltabakery.com/services',
      images: [{ url: 'https://moltabakery.com/images/molta-popup.jpeg' }],
      type: 'website',
    },
  };
}

export default async function ServicesPage() {
  if (!SERVICES_ENABLED) notFound();

  const [pastryBox, sandwiches, bread, pastryBoxTestimonials] = await Promise.all([
    client.fetch(PASTRY_BOX_QUERY),
    client.fetch(SANDWICH_SERVICE_QUERY),
    client.fetch(BREAD_SUBSCRIPTION_QUERY),
    client.fetch(TESTIMONIALS_QUERY, { service: 'pastryBox' }),
  ]);

  return (
    <>
      <Nav />
      <ServicesHero />
      {pastryBox && <PastryBoxSection data={pastryBox} testimonials={pastryBoxTestimonials} />}
      {sandwiches && <SandwichSection data={sandwiches} />}
      {bread && <BreadSubscriptionSection data={bread} />}
      <ServiceInquiryForm pastryBox={pastryBox} sandwiches={sandwiches} bread={bread} />
      <Footer />
      <ScrollReveal />
    </>
  );
}
