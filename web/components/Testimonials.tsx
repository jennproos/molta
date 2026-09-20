import type {Testimonial} from '@/lib/serviceTypes';

export default function Testimonials({testimonials}: {testimonials: Testimonial[]}) {
  if (!testimonials?.length) return null;

  return (
    <div className="testimonials">
      <h4>what people are saying</h4>
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <blockquote className="testimonial-card" key={testimonial._id}>
            <p>&ldquo;{testimonial.quote}&rdquo;</p>
            <cite>— {testimonial.customerName}</cite>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
