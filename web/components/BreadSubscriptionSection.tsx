import {PortableText} from 'next-sanity';
import type {BreadSubscriptionData} from '@/lib/serviceTypes';

export default function BreadSubscriptionSection({data}: {data: BreadSubscriptionData}) {
  const breadProducts = data.products?.filter((product) => product.category === 'bread') ?? [];
  const muffinProducts =
    data.products?.filter((product) => product.category === 'englishMuffins') ?? [];

  return (
    <section className="service-section service-section-pink" id="bread-subscription">
      <div className="section-inner reveal">
        <h2>bread &amp; english muffin subscription</h2>

        {data.description?.length > 0 && (
          <div className="service-description">
            <PortableText value={data.description} />
          </div>
        )}

        <div className="service-detail-block">
          {data.frequencyOptions?.length > 0 && (
            <p className="service-note">Frequencies: {data.frequencyOptions.join(', ')}.</p>
          )}
          <p className="service-note">
            {typeof data.deliveryFee === 'number' && `Delivery available for a $${data.deliveryFee} fee, `}
            {data.pickupLocation && `or pick up at ${data.pickupLocation}`}
            {data.pickupWindow && ` (${data.pickupWindow})`}.
          </p>
        </div>

        {breadProducts.length > 0 && (
          <>
            <h4>bread</h4>
            <div className="service-grid">
              {breadProducts.map((product) => (
                <div className="service-card" key={product._key}>
                  <h3>{product.name}</h3>
                  <p className="service-card-price">${product.price}</p>
                  {product.description && <p>{product.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}

        {muffinProducts.length > 0 && (
          <>
            <h4>english muffins</h4>
            <div className="service-grid">
              {muffinProducts.map((product) => (
                <div className="service-card" key={product._key}>
                  <h3>{product.name}</h3>
                  <p className="service-card-price">${product.price}</p>
                  {product.description && <p>{product.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
