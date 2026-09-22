import { MarketingBlock } from "../components/marketing-block";

export function FaqAccordionBlock() {
  return (
    <MarketingBlock
      blockId="faq.accordion"
      category="faq"
      variant="accordion"
      eyebrow="FAQ accordion"
      title="FAQ accordion"
      description="Expandable answers using native disclosure controls."
      items={["What does the generated product include?","Can we customise every file?","How are upgrades handled?","Does production depend on Stackiln?"]}
    />
  );
}
