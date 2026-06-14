import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import About from '@/components/About';
import Markets from '@/components/Markets';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <>
      <div className="screen-top">
        <Nav />
        <Hero />
      </div>
      <Ticker />
      <About />
      <Markets />
      <Footer />
      <ScrollReveal />
    </>
  );
}
