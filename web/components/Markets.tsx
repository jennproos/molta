import { markets } from '@/data/markets';

export default function Markets() {
  return (
    <section className="markets" id="markets">
      <div className="section-inner reveal">
        <h2>find me at the market</h2>
        <p className="section-sub">come say hi and grab some bread while it&apos;s fresh.</p>
        <div className="market-grid">
          {markets.map((market, i) => (
            <div className="market-card" key={i}>
              <div className="market-date">
                <span className="market-month">{market.month}</span>
                <span className="market-day">{market.day}</span>
              </div>
              <div className="market-info">
                <h3>{market.name}</h3>
                <p>{market.location}</p>
                <p className="market-time">{market.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
