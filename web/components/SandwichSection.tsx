import {PortableText} from 'next-sanity';
import type {SandwichServiceData} from '@/lib/serviceTypes';

export default function SandwichSection({data}: {data: SandwichServiceData}) {
  return (
    <section className="service-section service-section-green" id="lunch-sandwiches">
      <div className="section-inner reveal">
        <h2>lunch sandwiches</h2>

        {data.description?.length > 0 && (
          <div className="service-description">
            <PortableText value={data.description} />
          </div>
        )}

        {data.groupOrderNote && (
          <p className="service-note service-note-spaced">{data.groupOrderNote}</p>
        )}

        {data.sandwiches?.length > 0 && (
          <div className="service-grid">
            {data.sandwiches.map((sandwich) => (
              <div className="service-card" key={sandwich._key}>
                <h3>{sandwich.name}</h3>
                {sandwich.classicName && (
                  <p className="service-card-subtitle">{sandwich.classicName}</p>
                )}
                {sandwich.ingredients?.length ? (
                  <p className="service-card-ingredients">{sandwich.ingredients.join(', ')}</p>
                ) : null}
                <p className="service-card-price">${sandwich.price}</p>
              </div>
            ))}
          </div>
        )}

        {data.sides?.length > 0 && (
          <>
            <h4 className="service-product-heading">sides</h4>
            <ul className="service-list service-list-spaced">
              {data.sides.map((side) => (
                <li key={side._key}>{side.name} — ${side.pricePerPerson} / person</li>
              ))}
            </ul>
          </>
        )}

        <div className="service-detail-block">
          {data.modificationNote && <p className="service-note">{data.modificationNote}</p>}
          {data.dietaryNote && <p className="service-note">{data.dietaryNote}</p>}
          {typeof data.deliveryFee === 'number' && (
            <p className="service-note">
              Pickup available, or delivery for a ${data.deliveryFee} fee.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
