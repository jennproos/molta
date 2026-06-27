const MONTH_LABELS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];

function parseMarketDate(dateStr: string) {
  const [, month, day] = dateStr.split('-').map(Number);
  return {month: MONTH_LABELS[month - 1], day};
}

interface MarketEvent {
  _id: string;
  name: string;
  date: string;
  location: string;
  time: string;
}

export default function Markets({markets}: {markets: MarketEvent[]}) {
  return (
    <section className="markets" id="markets">
      <div className="section-inner reveal">
        <h2>find me at the market</h2>
        <p className="section-sub">come say hi and grab some bread while it&apos;s fresh.</p>
        <div className="market-grid">
          {markets.map((market) => {
            const {month, day} = parseMarketDate(market.date);
            return (
              <div className="market-card" key={market._id}>
                <div className="market-date">
                  <span className="market-month">{month}</span>
                  <span className="market-day">{day}</span>
                </div>
                <div className="market-info">
                  <h3>{market.name}</h3>
                  <p>{market.location}</p>
                  <p className="market-time">{market.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
