import Link from "next/link";
import config from "../../product-config.json";

type Category =
  | "navigation"
  | "hero"
  | "proof"
  | "features"
  | "story"
  | "media"
  | "cta"
  | "pricing"
  | "testimonials"
  | "faq"
  | "forms"
  | "footer";

type Props = {
  blockId: string;
  category: Category;
  variant: string;
  eyebrow: string;
  title: string;
  description: string;
  items: readonly string[];
};

function Header({
  id,
  eyebrow,
  title,
  description,
}: Pick<Props, "eyebrow" | "title" | "description"> & { id: string }) {
  return (
    <div className="block-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      <p className="block-description">{description}</p>
    </div>
  );
}

export function MarketingBlock({
  blockId,
  category,
  variant,
  eyebrow,
  title,
  description,
  items,
}: Props) {
  const headingId = `block-${blockId.replaceAll(".", "-")}`;
  const className = `marketing-block block-${category} block-${category}-${variant}`;

  if (category === "navigation")
    return (
      <section className={className} aria-label={title} data-block={blockId}>
        <strong>{config.product.name}</strong>
        <span className="announcement-copy">{description}</span>
        <nav aria-label={`${title} links`}>
          {items.map((item) => (
            <Link key={item} href="/features">
              {item}
            </Link>
          ))}
        </nav>
        <Link className="button button-default" href="/contact">
          Get started
        </Link>
      </section>
    );

  if (category === "hero")
    return (
      <section
        className={className}
        aria-labelledby={headingId}
        data-block={blockId}
      >
        <div className="hero-block-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id={headingId}>
            {config.product.name}: {description}
          </h1>
          <p className="lead">{config.product.description}</p>
          <div className="block-actions">
            <Link className="button button-default" href="/contact">
              Start building
            </Link>
            <Link className="button button-outline" href="/features">
              Explore features
            </Link>
          </div>
        </div>
        <div className="block-visual" aria-label="Product preview">
          <span className="visual-toolbar" />
          {items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
    );

  if (category === "proof")
    return (
      <section
        className={className}
        aria-labelledby={headingId}
        data-block={blockId}
      >
        <Header
          id={headingId}
          eyebrow={eyebrow}
          title="Trusted by teams building with intent"
          description={description}
        />
        <ul className="logo-list" aria-label="Customers and partners">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    );

  if (category === "features" || category === "story")
    return (
      <section
        className={className}
        aria-labelledby={headingId}
        data-block={blockId}
      >
        <Header
          id={headingId}
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="block-grid">
          {items.map((item, index) => (
            <article key={item} className="block-card">
              <span className="card-index">0{index + 1}</span>
              <h3>{item}</h3>
              <p>
                Clear defaults, explicit ownership, and room for the product to
                become its own.
              </p>
            </article>
          ))}
        </div>
      </section>
    );

  if (category === "media")
    return (
      <section
        className={className}
        aria-labelledby={headingId}
        data-block={blockId}
      >
        <Header
          id={headingId}
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="media-grid">
          {items.map((item, index) => (
            <figure key={item} className="media-tile">
              <div
                className={`media-placeholder media-placeholder-${index + 1}`}
                aria-hidden="true"
              />
              <figcaption>{item}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    );

  if (category === "cta")
    return (
      <section
        className={className}
        aria-labelledby={headingId}
        data-block={blockId}
      >
        <Header
          id={headingId}
          eyebrow={eyebrow}
          title="Turn the next idea into a product"
          description={description}
        />
        <div className="block-actions">
          <Link className="button button-default" href="/contact">
            {items[0]}
          </Link>
          <Link className="button button-outline" href="/features">
            {items[1]}
          </Link>
        </div>
      </section>
    );

  if (category === "pricing")
    return (
      <section
        className={className}
        aria-labelledby={headingId}
        data-block={blockId}
      >
        <Header
          id={headingId}
          eyebrow={eyebrow}
          title="Choose a path that fits"
          description={description}
        />
        <div className="pricing-grid">
          {items.map((item, index) => (
            <article className="price-card" key={item}>
              <h3>{item}</h3>
              <p className="price">
                <span>£</span>
                {[0, 29, 99][index]}
                <small>/month</small>
              </p>
              <p>
                {index === 0
                  ? "For exploring a new direction."
                  : "For products ready to build momentum."}
              </p>
              <Link className="button button-outline" href="/contact">
                Choose {item}
              </Link>
            </article>
          ))}
        </div>
      </section>
    );

  if (category === "testimonials")
    return (
      <section
        className={className}
        aria-labelledby={headingId}
        data-block={blockId}
      >
        <Header
          id={headingId}
          eyebrow={eyebrow}
          title="Built for teams who care about the code"
          description={description}
        />
        <div className="quote-grid">
          {items.map((item, index) => (
            <figure key={item}>
              <blockquote>“{item}”</blockquote>
              <figcaption>Product lead, customer {index + 1}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    );

  if (category === "faq")
    return (
      <section
        className={className}
        aria-labelledby={headingId}
        data-block={blockId}
      >
        <Header
          id={headingId}
          eyebrow={eyebrow}
          title="Questions, answered"
          description={description}
        />
        <div className="faq-list">
          {items.map((item) => (
            <details key={item}>
              <summary>{item}</summary>
              <p>
                Stackiln generates conventional product-owned source with
                explicit recipes and managed-file checks.
              </p>
            </details>
          ))}
        </div>
      </section>
    );

  if (category === "forms")
    return (
      <section
        className={className}
        aria-labelledby={headingId}
        data-block={blockId}
      >
        <Header
          id={headingId}
          eyebrow={eyebrow}
          title="Start a conversation"
          description={description}
        />
        <form className="lead-form" action="/contact" method="get">
          <label>
            Name
            <input name="name" autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="form-wide">
            What are you building?
            <textarea name="message" rows={4} />
          </label>
          <button className="button button-default" type="submit">
            Continue
          </button>
        </form>
      </section>
    );

  return (
    <section
      className={className}
      aria-labelledby={headingId}
      data-block={blockId}
    >
      <Header
        id={headingId}
        eyebrow={eyebrow}
        title={config.product.name}
        description={description}
      />
      <nav className="footer-directory" aria-label={`${title} directory`}>
        {items.map((item) => (
          <div key={item}>
            <strong>{item}</strong>
            <Link href="/features">Overview</Link>
            <Link href="/contact">Talk to us</Link>
          </div>
        ))}
      </nav>
    </section>
  );
}
