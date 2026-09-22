import {
  blockNames,
  type BlockName,
  type ModuleName,
  type PageRecipeName,
} from "../../config/src/index.js";
import {
  defineBlock,
  type BlockCategory,
  type BlockRecipe,
} from "../../block-kit/src/index.js";

type Entry = readonly [
  id: BlockName,
  label: string,
  description: string,
  variant: string,
];

const categoryItems: Record<BlockCategory, readonly string[]> = {
  navigation: ["Product", "Solutions", "Resources", "Company"],
  hero: ["Fast to launch", "Easy to own", "Ready to evolve"],
  proof: ["Northstar", "Waypoint", "Foundry", "Commonwealth", "Fieldwork"],
  features: [
    "Composable foundations",
    "Product-owned code",
    "Safe generation",
    "Production verification",
  ],
  story: ["Start with clarity", "Compose deliberately", "Ship confidently"],
  media: ["Product overview", "Workflow", "Team view", "Results"],
  cta: ["Start building", "Explore the product"],
  pricing: ["Starter", "Growth", "Scale"],
  testimonials: [
    "The code feels like ours from day one.",
    "We moved from idea to a credible product unusually quickly.",
    "The structure stayed understandable as the product grew.",
  ],
  faq: [
    "What does the generated product include?",
    "Can we customise every file?",
    "How are upgrades handled?",
    "Does production depend on Stackiln?",
  ],
  forms: ["Name", "Work email", "How can we help?"],
  footer: ["Product", "Resources", "Company", "Legal"],
};

const entries: readonly Entry[] = [
  [
    "navigation.announcement-bar",
    "Announcement bar",
    "A focused message for launches, updates, and time-sensitive news.",
    "announcement",
  ],
  [
    "navigation.utility-bar",
    "Utility bar",
    "Compact access to support, status, locale, and account destinations.",
    "utility",
  ],
  [
    "navigation.centered-navbar",
    "Centred navbar",
    "A balanced navigation treatment for concise product sites.",
    "centered",
  ],
  [
    "navigation.split-navbar",
    "Split navbar",
    "Primary and secondary actions separated around the product identity.",
    "split",
  ],
  [
    "navigation.mega-menu",
    "Mega menu",
    "A spacious navigation surface for products with several audiences.",
    "mega",
  ],
  [
    "hero.centered",
    "Centred hero",
    "A direct proposition with a restrained action group.",
    "centered",
  ],
  [
    "hero.split-image",
    "Split image hero",
    "Editorial copy paired with a strong visual surface.",
    "split",
  ],
  [
    "hero.product-mockup",
    "Product mockup hero",
    "A product-first introduction with an interface preview.",
    "mockup",
  ],
  [
    "hero.video",
    "Video hero",
    "A cinematic introduction with an accessible media prompt.",
    "video",
  ],
  [
    "hero.search-led",
    "Search-led hero",
    "A discovery-first opening for directories, docs, and marketplaces.",
    "search",
  ],
  [
    "proof.logo-cloud",
    "Logo cloud",
    "A calm grid of customer and partner names.",
    "grid",
  ],
  [
    "proof.logo-marquee",
    "Logo marquee",
    "A wide continuous row with reduced-motion behaviour.",
    "marquee",
  ],
  [
    "proof.press-mentions",
    "Press mentions",
    "Editorial recognition presented with publication context.",
    "press",
  ],
  [
    "proof.star-ratings",
    "Star ratings",
    "Review signals with an explicit score and source.",
    "ratings",
  ],
  [
    "proof.customer-count",
    "Customer count",
    "A concise adoption metric backed by customer categories.",
    "count",
  ],
  [
    "features.icon-grid",
    "Icon feature grid",
    "Scannable capabilities in a responsive card grid.",
    "icons",
  ],
  [
    "features.bento-grid",
    "Bento feature grid",
    "Mixed-size feature cards for a richer product narrative.",
    "bento",
  ],
  [
    "features.alternating",
    "Alternating features",
    "A paced sequence of copy and visual descriptions.",
    "alternating",
  ],
  [
    "features.tabbed",
    "Tabbed features",
    "A compact feature explorer with progressive enhancement.",
    "tabs",
  ],
  [
    "features.comparison",
    "Feature comparison",
    "Side-by-side capability framing for clear differentiation.",
    "comparison",
  ],
  [
    "story.editorial-intro",
    "Editorial introduction",
    "A generous opening for mission and product context.",
    "editorial",
  ],
  [
    "story.rich-text",
    "Rich text story",
    "Long-form copy with readable measure and hierarchy.",
    "rich-text",
  ],
  [
    "story.image-copy",
    "Image and copy",
    "A visual story with a supporting narrative panel.",
    "image-copy",
  ],
  [
    "story.timeline",
    "Story timeline",
    "Milestones arranged as a clear chronological journey.",
    "timeline",
  ],
  [
    "story.values",
    "Values",
    "Principles expressed as practical, memorable commitments.",
    "values",
  ],
  [
    "media.masonry-gallery",
    "Masonry gallery",
    "A varied editorial gallery for product and brand imagery.",
    "masonry",
  ],
  [
    "media.carousel",
    "Media carousel",
    "A keyboard-accessible sequence of visual highlights.",
    "carousel",
  ],
  [
    "media.lightbox",
    "Lightbox gallery",
    "Expandable imagery with an accessible fallback presentation.",
    "lightbox",
  ],
  [
    "media.browser-frame",
    "Browser frame",
    "A polished browser treatment for product screenshots.",
    "browser",
  ],
  [
    "media.video-player",
    "Video player",
    "A poster-led video presentation with supporting context.",
    "video",
  ],
  [
    "cta.banner",
    "CTA banner",
    "A full-width prompt for the page's primary next step.",
    "banner",
  ],
  [
    "cta.split",
    "Split CTA",
    "Action copy and supporting proof arranged side by side.",
    "split",
  ],
  [
    "cta.card",
    "CTA card",
    "A contained conversion surface that fits between content sections.",
    "card",
  ],
  [
    "cta.floating",
    "Floating CTA",
    "An elevated action panel with strong visual separation.",
    "floating",
  ],
  [
    "cta.sticky",
    "Sticky CTA",
    "A persistent prompt designed to remain unobtrusive.",
    "sticky",
  ],
  [
    "pricing.cards",
    "Pricing cards",
    "Three clear packages with consistent feature summaries.",
    "cards",
  ],
  [
    "pricing.billing-toggle",
    "Billing toggle",
    "Monthly and annual pricing with an explicit saving.",
    "toggle",
  ],
  [
    "pricing.comparison",
    "Pricing comparison",
    "A detailed plan matrix for considered purchases.",
    "comparison",
  ],
  [
    "pricing.usage-calculator",
    "Usage calculator",
    "An estimation surface for usage-based products.",
    "calculator",
  ],
  [
    "pricing.request-quote",
    "Request a quote",
    "Enterprise pricing paired with a direct sales route.",
    "quote",
  ],
  [
    "testimonials.cards",
    "Testimonial cards",
    "A balanced grid of customer perspectives.",
    "cards",
  ],
  [
    "testimonials.carousel",
    "Testimonial carousel",
    "A focused sequence of customer evidence.",
    "carousel",
  ],
  [
    "testimonials.pull-quote",
    "Pull quote",
    "One high-impact quote with generous editorial space.",
    "quote",
  ],
  [
    "testimonials.video",
    "Video testimonial",
    "Customer proof led by an accessible media story.",
    "video",
  ],
  [
    "testimonials.customer-story",
    "Customer story",
    "A compact case study connecting challenge, action, and outcome.",
    "story",
  ],
  [
    "faq.accordion",
    "FAQ accordion",
    "Expandable answers using native disclosure controls.",
    "accordion",
  ],
  [
    "faq.grouped",
    "Grouped FAQ",
    "Questions organised around product, billing, and support themes.",
    "grouped",
  ],
  [
    "faq.searchable",
    "Searchable FAQ",
    "A discovery-led help surface for a larger question set.",
    "search",
  ],
  [
    "faq.escalation",
    "FAQ escalation",
    "Common answers followed by a clear human support route.",
    "escalation",
  ],
  [
    "faq.glossary",
    "Glossary",
    "Product language explained in a compact reference list.",
    "glossary",
  ],
  [
    "forms.contact",
    "Contact form",
    "A direct route for product and support enquiries.",
    "contact",
  ],
  [
    "forms.newsletter",
    "Newsletter form",
    "A concise email signup with expectation-setting copy.",
    "newsletter",
  ],
  [
    "forms.waitlist",
    "Waitlist form",
    "An early-access signup with a low-friction prompt.",
    "waitlist",
  ],
  [
    "forms.demo-request",
    "Demo request",
    "A qualified route into a product conversation.",
    "demo",
  ],
  [
    "forms.quote-request",
    "Quote request",
    "A purchase-intent form for higher-touch offerings.",
    "quote",
  ],
  [
    "footer.simple",
    "Simple footer",
    "A minimal closing surface with essential destinations.",
    "simple",
  ],
  [
    "footer.mega",
    "Mega footer",
    "A structured directory for larger product sites.",
    "mega",
  ],
  [
    "footer.cta",
    "CTA footer",
    "A final action prompt followed by essential navigation.",
    "cta",
  ],
  [
    "footer.newsletter",
    "Newsletter footer",
    "Updates signup and navigation in one closing section.",
    "newsletter",
  ],
  [
    "footer.sitemap",
    "Sitemap footer",
    "A comprehensive, grouped map of the public site.",
    "sitemap",
  ],
];

function exportName(id: BlockName): string {
  return `${id
    .split(/[.-]/)
    .map((part) => `${part[0]?.toUpperCase()}${part.slice(1)}`)
    .join("")}Block`;
}

function moduleRequirements(category: BlockCategory): readonly ModuleName[] {
  return category === "forms" ? ["email"] : [];
}

export const blocks = Object.fromEntries(
  entries.map(([id, label, description, variant]) => {
    const category = id.split(".")[0] as BlockCategory;
    return [
      id,
      defineBlock({
        id,
        version: 1,
        category,
        label,
        description,
        items: categoryItems[category],
        variant,
        exportName: exportName(id),
        requiresModules: moduleRequirements(category),
        rendering: "server",
        accessibility: [
          "Maintains visible focus styles",
          "Uses labelled structural regions",
          "Supports reduced motion",
        ],
      }),
    ];
  }),
) as unknown as Record<BlockName, BlockRecipe>;

if (Object.keys(blocks).length !== blockNames.length)
  throw new Error(
    "Block registry does not match the configured block catalogue.",
  );

export const pageRecipes: Record<PageRecipeName, readonly BlockName[]> = {
  "marketing-classic": [
    "navigation.announcement-bar",
    "hero.split-image",
    "proof.logo-cloud",
    "features.icon-grid",
    "story.editorial-intro",
    "pricing.cards",
    "testimonials.cards",
    "faq.accordion",
    "forms.contact",
    "footer.mega",
  ],
  "saas-launch": [
    "navigation.split-navbar",
    "hero.product-mockup",
    "proof.customer-count",
    "features.bento-grid",
    "features.comparison",
    "pricing.billing-toggle",
    "testimonials.customer-story",
    "faq.grouped",
    "forms.demo-request",
    "footer.cta",
  ],
  editorial: [
    "navigation.centered-navbar",
    "hero.centered",
    "proof.press-mentions",
    "story.rich-text",
    "story.image-copy",
    "media.masonry-gallery",
    "testimonials.pull-quote",
    "forms.newsletter",
    "footer.simple",
  ],
  waitlist: [
    "navigation.utility-bar",
    "hero.video",
    "proof.logo-marquee",
    "features.alternating",
    "story.timeline",
    "forms.waitlist",
    "faq.escalation",
    "footer.newsletter",
  ],
};

export function blockFileName(id: BlockName): string {
  return id.replaceAll(".", "-");
}

export function renderBlockSource(block: BlockRecipe): string {
  return `import { MarketingBlock } from "../components/marketing-block";\n\nexport function ${block.exportName}() {\n  return (\n    <MarketingBlock\n      blockId=${JSON.stringify(block.id)}\n      category=${JSON.stringify(block.category)}\n      variant=${JSON.stringify(block.variant)}\n      eyebrow=${JSON.stringify(block.label)}\n      title=${JSON.stringify(block.label)}\n      description=${JSON.stringify(block.description)}\n      items={${JSON.stringify(block.items)}}\n    />\n  );\n}\n`;
}
