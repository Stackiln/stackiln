import { MarketingBlock } from "../components/marketing-block";

export function NavigationAnnouncementBarBlock() {
  return (
    <MarketingBlock
      blockId="navigation.announcement-bar"
      category="navigation"
      variant="announcement"
      eyebrow="Announcement bar"
      title="Announcement bar"
      description="A focused message for launches, updates, and time-sensitive news."
      items={["Product","Solutions","Resources","Company"]}
    />
  );
}
