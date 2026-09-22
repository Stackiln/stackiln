import { MarketingBlock } from "../components/marketing-block";

export function FooterMegaBlock() {
  return (
    <MarketingBlock
      blockId="footer.mega"
      category="footer"
      variant="mega"
      eyebrow="Mega footer"
      title="Mega footer"
      description="A structured directory for larger product sites."
      items={["Product","Resources","Company","Legal"]}
    />
  );
}
