import { MarketingBlock } from "../components/marketing-block";

export function HeroSplitImageBlock() {
  return (
    <MarketingBlock
      blockId="hero.split-image"
      category="hero"
      variant="split"
      eyebrow="Split image hero"
      title="Split image hero"
      description="Editorial copy paired with a strong visual surface."
      items={["Fast to launch","Easy to own","Ready to evolve"]}
    />
  );
}
