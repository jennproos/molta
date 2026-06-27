import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import About from '@/components/About';
import Markets from '@/components/Markets';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import {client, MARKETS_QUERY, ABOUT_QUERY} from '@/lib/sanity';

export default async function Home() {
  const [markets, about] = await Promise.all([
    client.fetch(MARKETS_QUERY),
    client.fetch(ABOUT_QUERY),
  ]);

  return (
    <>
      <div className="screen-top">
        <Nav />
        <Hero />
      </div>
      <Ticker />
      <About content={about?.body ?? []} />
      <Markets markets={markets} />
      <Footer />
      <ScrollReveal />
    </>
  );
}
