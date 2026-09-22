import { MarketingBlock } from "../components/marketing-block";

export function HeroCenteredBlock() {
  return (
    <MarketingBlock
      blockId="hero.centered"
      category="hero"
      variant="centered"
      eyebrow="Centred hero"
      title="A site that looks unmistakably ours"
      description="A direct proposition with a restrained action group."
      items={["Fast to launch","Easy to own","Ready to evolve"]}
    />
  );
}
