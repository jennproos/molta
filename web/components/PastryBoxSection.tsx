import {PortableText} from 'next-sanity';
import type {PastryBoxData, Testimonial} from '@/lib/serviceTypes';
import Testimonials from './Testimonials';

export default function PastryBoxSection({
  data,
  testimonials,
}: {
  data: PastryBoxData;
  testimonials: Testimonial[];
}) {
  return (
    <section className="service-section service-section-pink" id="pastry-box">
      <div className="section-inner reveal">
        <h2>pastry box</h2>

        {data.description?.length > 0 && (
          <div className="service-description">
            <PortableText value={data.description} />
          </div>
        )}

        {data.sizes?.length > 0 && (
          <div className="service-grid">
            {data.sizes.map((size) => (
              <div className="service-card" key={size._key}>
                <h3>{size.name}</h3>
                <p className="service-card-price">${size.price}</p>
                {size.description && <p>{size.description}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="service-details">
          <div className="service-detail-block">
            <h4>how it works</h4>
            <p>
              {data.oneTimePurchaseAvailable
                ? 'Order a one-time box, or set up a recurring subscription. '
                : 'Set up a recurring subscription. '}
              Mix and match up to {data.maxPastryTypesPerBox} pastry types per box.
            </p>
            {data.frequencyOptions?.length > 0 && (
              <p className="service-note">
                Subscription frequencies: {data.frequencyOptions.join(', ')}.
              </p>
            )}
            {typeof data.deliveryFee === 'number' && (
              <p className="service-note">
                Pickup available, or delivery for a ${data.deliveryFee} fee.
              </p>
            )}
          </div>

          {data.pastryOptions?.length > 0 && (
            <div className="service-detail-block">
              <h4>pastry options</h4>
              <ul className="service-list">
                {data.pastryOptions.map((option) => (
                  <li key={option._key}>
                    {option.name}
                    {option.flavorOptions?.length ? ` (${option.flavorOptions.join(', ')})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {data.dietaryNote && <p className="service-dietary-note">{data.dietaryNote}</p>}

        <Testimonials testimonials={testimonials} />
      </div>
    </section>
  );
}
