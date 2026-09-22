import { MarketingBlock } from "../components/marketing-block";

export function FormsContactBlock() {
  return (
    <MarketingBlock
      blockId="forms.contact"
      category="forms"
      variant="contact"
      eyebrow="Contact form"
      title="Contact form"
      description="A direct route for product and support enquiries."
      items={["Name","Work email","How can we help?"]}
    />
  );
}
