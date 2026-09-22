import { MarketingBlock } from "../components/marketing-block";

export function PricingCardsBlock() {
  return (
    <MarketingBlock
      blockId="pricing.cards"
      category="pricing"
      variant="cards"
      eyebrow="Pricing cards"
      title="Pricing cards"
      description="Three clear packages with consistent feature summaries."
      items={["Starter","Growth","Scale"]}
    />
  );
}
