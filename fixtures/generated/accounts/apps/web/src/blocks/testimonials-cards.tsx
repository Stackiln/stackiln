import { MarketingBlock } from "../components/marketing-block";

export function TestimonialsCardsBlock() {
  return (
    <MarketingBlock
      blockId="testimonials.cards"
      category="testimonials"
      variant="cards"
      eyebrow="Testimonial cards"
      title="Testimonial cards"
      description="A balanced grid of customer perspectives."
      items={["The code feels like ours from day one.","We moved from idea to a credible product unusually quickly.","The structure stayed understandable as the product grew."]}
    />
  );
}
