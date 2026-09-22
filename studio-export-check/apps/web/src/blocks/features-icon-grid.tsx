import { MarketingBlock } from "../components/marketing-block";

export function FeaturesIconGridBlock() {
  return (
    <MarketingBlock
      blockId="features.icon-grid"
      category="features"
      variant="icons"
      eyebrow="Icon feature grid"
      title="Icon feature grid"
      description="Scannable capabilities in a responsive card grid."
      items={["Composable foundations","Product-owned code","Safe generation","Production verification"]}
    />
  );
}
