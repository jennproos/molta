'use client';

import { useState, FormEvent } from 'react';

type InquiryType = '' | 'Special Order' | 'Question' | 'Feedback';
type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState<InquiryType>('');
  const [message, setMessage] = useState('');
  const [company, setCompany] = useState(''); // honeypot, humans leave this blank
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !inquiryType || !message.trim()) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_CONTACT_API_URL ?? '').replace(/\/$/, '');
      const res = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, inquiryType, message, company }),
      });

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setName('');
      setEmail('');
      setInquiryType('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="section-inner reveal">
        <h2>get in touch</h2>
        <p className="section-sub">special orders, questions, or just say hi.</p>

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
            <label htmlFor="contact-name">name</label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-email">email</label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={254}
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-type">what&apos;s this about?</label>
            <select
              id="contact-type"
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value as InquiryType)}
              required
            >
              <option value="" disabled>select one</option>
              <option value="Special Order">special order</option>
              <option value="Question">question</option>
              <option value="Feedback">feedback</option>
            </select>
          </div>

          <div className="contact-field">
            <label htmlFor="contact-message">message</label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={5000}
              rows={6}
              required
            />
          </div>

          <button type="submit" className="contact-submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'sending…' : 'send message'}
          </button>

          {status === 'success' && (
            <p className="contact-status contact-status-success">
              thanks for reaching out! we&apos;ll be in touch soon.
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
