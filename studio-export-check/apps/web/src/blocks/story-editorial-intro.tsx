import { MarketingBlock } from "../components/marketing-block";

export function StoryEditorialIntroBlock() {
  return (
    <MarketingBlock
      blockId="story.editorial-intro"
      category="story"
      variant="editorial"
      eyebrow="Editorial introduction"
      title="Editorial introduction"
      description="A generous opening for mission and product context."
      items={["Start with clarity","Compose deliberately","Ship confidently"]}
    />
  );
}
