import { MarketingBlock } from "../components/marketing-block";

export function ProofLogoCloudBlock() {
  return (
    <MarketingBlock
      blockId="proof.logo-cloud"
      category="proof"
      variant="grid"
      eyebrow="Logo cloud"
      title="Logo cloud"
      description="A calm grid of customer and partner names."
      items={["Northstar","Waypoint","Foundry","Commonwealth","Fieldwork"]}
    />
  );
}
