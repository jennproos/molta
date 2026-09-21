'use client';

import { useState, FormEvent } from 'react';
import type { PastryBoxData, SandwichServiceData, BreadSubscriptionData } from '@/lib/serviceTypes';

type ServiceKey = '' | 'pastryBox' | 'sandwiches' | 'breadSubscription';
type Fulfillment = '' | 'Pickup' | 'Delivery';
type PurchaseType = '' | 'One-time' | 'Subscription';
type Status = 'idle' | 'submitting' | 'success' | 'error';

interface Props {
  pastryBox: PastryBoxData | null;
  sandwiches: SandwichServiceData | null;
  bread: BreadSubscriptionData | null;
}

export default function ServiceInquiryForm({ pastryBox, sandwiches, bread }: Props) {
  const [service, setService] = useState<ServiceKey>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fulfillment, setFulfillment] = useState<Fulfillment>('');
  const [notes, setNotes] = useState('');
  const [company, setCompany] = useState(''); // honeypot, humans leave this blank
  const [status, setStatus] = useState<Status>('idle');

  // Pastry box fields
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('');
  const [frequency, setFrequency] = useState('');
  const [size, setSize] = useState('');
  const [selectedPastries, setSelectedPastries] = useState<string[]>([]);

  // Sandwich fields
  const [preferredDate, setPreferredDate] = useState('');
  const [sandwichQuantities, setSandwichQuantities] = useState<Record<string, number>>({});
  const [sideQuantities, setSideQuantities] = useState<Record<string, number>>({});

  // Bread fields
  const [breadFrequency, setBreadFrequency] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const maxPastryTypes = pastryBox?.maxPastryTypesPerBox ?? 4;

  const togglePastry = (pastryName: string) => {
    setSelectedPastries((current) => {
      if (current.includes(pastryName)) return current.filter((p) => p !== pastryName);
      if (current.length >= maxPastryTypes) return current;
      return [...current, pastryName];
    });
  };

  const toggleProduct = (productName: string) => {
    setSelectedProducts((current) =>
      current.includes(productName)
        ? current.filter((p) => p !== productName)
        : [...current, productName],
    );
  };

  const setSandwichQuantity = (sandwichName: string, quantity: number) => {
    setSandwichQuantities((current) => ({ ...current, [sandwichName]: Math.max(0, quantity) }));
  };

  const setSideQuantity = (sideName: string, quantity: number) => {
    setSideQuantities((current) => ({ ...current, [sideName]: Math.max(0, quantity) }));
  };

  const resetServiceFields = (next: ServiceKey) => {
    setService(next);
    setFulfillment('');
    setPurchaseType('');
    setFrequency('');
    setSize('');
    setSelectedPastries([]);
    setPreferredDate('');
    setSandwichQuantities({});
    setSideQuantities({});
    setBreadFrequency('');
    setSelectedProducts([]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !service || !fulfillment) {
      setStatus('error');
      return;
    }

    let details: Record<string, unknown> = {};
    if (service === 'pastryBox') {
      const resolvedPurchaseType =
        purchaseType || (pastryBox && !pastryBox.oneTimePurchaseAvailable ? 'Subscription' : '');
      details = { purchaseType: resolvedPurchaseType, frequency, size, pastries: selectedPastries };
    } else if (service === 'sandwiches') {
      const sandwichSelections = Object.entries(sandwichQuantities).filter(([, qty]) => qty > 0);
      const sideSelections = Object.entries(sideQuantities).filter(([, qty]) => qty > 0);
      details = {
        preferredDate,
        sandwiches: sandwichSelections.map(([n, qty]) => ({ name: n, quantity: qty })),
        sides: sideSelections.map(([n, qty]) => ({ name: n, quantity: qty })),
      };
    } else if (service === 'breadSubscription') {
      details = { frequency: breadFrequency, products: selectedProducts };
    }

    setStatus('submitting');

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_CONTACT_API_URL ?? '').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/service-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, name, email, phone, fulfillment, details, notes, company }),
      });

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      resetServiceFields('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="service-inquiry" id="request">
      <div className="section-inner reveal">
        <h2>request an order</h2>
        <p className="section-sub">
          tell us what you&apos;re after — I&apos;ll confirm availability and follow up with an
          invoice to complete your order.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="contact-honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="contact-field">
            <label htmlFor="inquiry-service">which service?</label>
            <select
              id="inquiry-service"
              value={service}
              onChange={(e) => resetServiceFields(e.target.value as ServiceKey)}
              required
            >
              <option value="" disabled>select one</option>
              {pastryBox && <option value="pastryBox">pastry box</option>}
              {sandwiches && <option value="sandwiches">lunch sandwiches (group order)</option>}
              {bread && <option value="breadSubscription">bread &amp; english muffin subscription</option>}
            </select>
          </div>

          {service === 'pastryBox' && pastryBox && (
            <>
              {pastryBox.oneTimePurchaseAvailable && (
                <div className="contact-field">
                  <label htmlFor="pb-purchase-type">one-time or subscription?</label>
                  <select
                    id="pb-purchase-type"
                    value={purchaseType}
                    onChange={(e) => setPurchaseType(e.target.value as PurchaseType)}
                    required
                  >
                    <option value="" disabled>select one</option>
                    <option value="One-time">one-time box</option>
                    <option value="Subscription">subscription</option>
                  </select>
                </div>
              )}

              {(purchaseType === 'Subscription' || !pastryBox.oneTimePurchaseAvailable) && (
                <div className="contact-field">
                  <label htmlFor="pb-frequency">frequency</label>
                  <select
                    id="pb-frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                  >
                    <option value="" disabled>select one</option>
                    {pastryBox.frequencyOptions?.map((f) => (
                      <option key={f} value={f}>{f.toLowerCase()}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="contact-field">
                <label htmlFor="pb-size">box size</label>
                <select id="pb-size" value={size} onChange={(e) => setSize(e.target.value)} required>
                  <option value="" disabled>select one</option>
                  {pastryBox.sizes?.map((s) => (
                    <option key={s._key} value={s.name}>{s.name} — ${s.price}</option>
                  ))}
                </select>
              </div>

              <fieldset className="contact-field contact-fieldset">
                <legend>
                  pastry types (pick up to {maxPastryTypes} — {selectedPastries.length}/{maxPastryTypes} selected)
                </legend>
                <div className="checkbox-grid">
                  {pastryBox.pastryOptions?.map((option) => {
                    const checked = selectedPastries.includes(option.name);
                    const disabled = !checked && selectedPastries.length >= maxPastryTypes;
                    return (
                      <label key={option._key} className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => togglePastry(option.name)}
                        />
                        {option.name}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </>
          )}

          {service === 'sandwiches' && sandwiches && (
            <>
              <div className="contact-field">
                <label htmlFor="sw-date">preferred date</label>
                <input
                  id="sw-date"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                />
              </div>

              <fieldset className="contact-field contact-fieldset">
                <legend>sandwiches &amp; quantities</legend>
                <div className="quantity-grid">
                  {sandwiches.sandwiches?.map((sandwich) => (
                    <div className="quantity-row" key={sandwich._key}>
                      <span>{sandwich.name} <span className="quantity-row-price">${sandwich.price}</span></span>
                      <input
                        type="number"
                        min={0}
                        value={sandwichQuantities[sandwich.name] ?? 0}
                        onChange={(e) => setSandwichQuantity(sandwich.name, Number(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>

              {sandwiches.sides?.length > 0 && (
                <fieldset className="contact-field contact-fieldset">
                  <legend>sides &amp; quantities (per person)</legend>
                  <div className="quantity-grid">
                    {sandwiches.sides.map((side) => (
                      <div className="quantity-row" key={side._key}>
                        <span>{side.name} <span className="quantity-row-price">${side.pricePerPerson}/person</span></span>
                        <input
                          type="number"
                          min={0}
                          value={sideQuantities[side.name] ?? 0}
                          onChange={(e) => setSideQuantity(side.name, Number(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </fieldset>
              )}
            </>
          )}

          {service === 'breadSubscription' && bread && (
            <>
              <div className="contact-field">
                <label htmlFor="br-frequency">frequency</label>
                <select
                  id="br-frequency"
                  value={breadFrequency}
                  onChange={(e) => setBreadFrequency(e.target.value)}
                  required
                >
                  <option value="" disabled>select one</option>
                  {bread.frequencyOptions?.map((f) => (
                    <option key={f} value={f}>{f.toLowerCase()}</option>
                  ))}
                </select>
              </div>

              <fieldset className="contact-field contact-fieldset">
                <legend>bread &amp; english muffins</legend>
                <div className="checkbox-grid">
                  {bread.products?.map((product) => (
                    <label key={product._key} className="checkbox-option">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.name)}
                        onChange={() => toggleProduct(product.name)}
                      />
                      {product.name} — ${product.price}
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {service && (
            <div className="contact-field">
              <label htmlFor="inquiry-fulfillment">pickup or delivery?</label>
              <select
                id="inquiry-fulfillment"
                value={fulfillment}
                onChange={(e) => setFulfillment(e.target.value as Fulfillment)}
                required
              >
                <option value="" disabled>select one</option>
                <option value="Pickup">pickup</option>
                <option value="Delivery">delivery</option>
              </select>
            </div>
          )}

          <div className="contact-field">
            <label htmlFor="inquiry-name">name</label>
            <input
              id="inquiry-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="inquiry-email">email</label>
            <input
              id="inquiry-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={254}
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="inquiry-phone">phone (optional)</label>
            <input
              id="inquiry-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={30}
            />
          </div>

          <div className="contact-field">
            <label htmlFor="inquiry-notes">dietary needs or other notes</label>
            <textarea
              id="inquiry-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
              rows={4}
            />
          </div>

          <button type="submit" className="contact-submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'sending…' : 'send request'}
          </button>

          {status === 'success' && (
            <p className="contact-status contact-status-success">
              thanks! I&apos;ll confirm availability and follow up with next steps.
            </p>
          )}
          {status === 'error' && (
            <p className="contact-status contact-status-error">
              something went wrong — please try again, or email us directly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
