import type { Metadata } from 'next';
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

// Build-time feature flag: the Services page isn't publicly launched yet.
// The page itself always builds and is reachable at this URL (an unlisted
// preview link to share directly), but while the flag is off it's kept out
// of the nav (see Nav.tsx) and marked noindex so it doesn't show up in
// search results or get linked from anywhere on the site. Flip
// NEXT_PUBLIC_SERVICES_ENABLED to 'true' in the deploy workflow (and
// redeploy) to launch it for real.
const SERVICES_ENABLED = process.env.NEXT_PUBLIC_SERVICES_ENABLED === 'true';

export function generateMetadata(): Metadata {
  const title = 'Services — Molta Bakery';
  const description = 'Pastry box subscriptions, group lunch sandwich orders, and bread & English muffin subscriptions from Molta Bakery.';

  return {
    title,
    description,
    ...(SERVICES_ENABLED
      ? {
          openGraph: {
            title,
            description,
            url: 'https://moltabakery.com/services',
            images: [{ url: 'https://moltabakery.com/images/molta-popup.jpeg' }],
            type: 'website',
          },
        }
      : { robots: { index: false, follow: false } }),
  };
}

export default async function ServicesPage() {
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
