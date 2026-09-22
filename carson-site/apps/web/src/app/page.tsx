const stats = [
  { value: "288", label: "maximum output tokens per AI reply" },
  { value: "6", label: "requests per minute, per user" },
  { value: "60", label: "requests per hour, per user" },
  { value: "10 min", label: "maximum abuse cooldown" },
  { value: "10", label: "pre-written Hugh icebreakers" },
  { value: "500", label: "input character limit" },
] as const;

const protocols = [
  {
    number: "01",
    title: "On the server",
    copy: "Mention Carson directly. He answers with a public Discord reply, so a busy channel can still see who he is talking to.",
  },
  {
    number: "02",
    title: "After hours",
    copy: "DM him and you will get one of his off-the-clock notices. Those are pre-written and use no AI tokens.",
  },
  {
    number: "03",
    title: "Queue discipline",
    copy: "Per-user limits, duplicate detection and a single in-flight request keep spam from taking over the desk.",
  },
] as const;

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="carson-title">
        <div className="hero-copy">
          <p className="kicker">Oakridge Nuclear Power Plant · Security</p>
          <h1 id="carson-title">
            Carson is
            <span>on the door.</span>
          </h1>
          <p className="lead">
            A stern, slightly laughable, definitely text-only Discord security
            guard. He has a radio, a clipboard and a very particular view on who
            should be standing where.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#briefing">
              Read the shift brief
            </a>
            <a className="button button-quiet" href="#protocol">
              Operating protocol
            </a>
          </div>
        </div>
        <aside
          className="id-card"
          aria-label="Carson's security identification"
        >
          <div className="id-card-topline">
            <span>Security identification</span>
            <span>OR-80</span>
          </div>
          <div className="portrait" aria-hidden="true">
            <span className="cap" />
            <span className="head" />
            <span className="body" />
          </div>
          <div className="id-details">
            <p className="id-name">CARSON</p>
            <dl>
              <div>
                <dt>Post</dt>
                <dd>Discord desk</dd>
              </div>
              <div>
                <dt>Clearance</dt>
                <dd>Enough</dd>
              </div>
              <div>
                <dt>Disposition</dt>
                <dd>Stern-ish</dd>
              </div>
            </dl>
          </div>
          <p className="stamp">TEXT ONLY</p>
        </aside>
      </section>

      <section
        className="briefing"
        id="briefing"
        aria-labelledby="briefing-title"
      >
        <header className="section-heading">
          <div>
            <p className="kicker">Form 8-B · Configuration snapshot</p>
            <h2 id="briefing-title">The numbers on the clipboard</h2>
          </div>
          <p>
            These are Carson&apos;s configured operating limits, not live usage
            telemetry. Even security guards are entitled to a little privacy.
          </p>
        </header>
        <div className="stat-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="protocol"
        id="protocol"
        aria-labelledby="protocol-title"
      >
        <header className="section-heading section-heading-light">
          <div>
            <p className="kicker">Standing orders</p>
            <h2 id="protocol-title">How to approach the desk</h2>
          </div>
          <p>
            Keep it written, keep it civil and do not make Carson repeat
            himself. He will, but the sigh is implied.
          </p>
        </header>
        <div className="protocol-grid">
          {protocols.map((item) => (
            <article className="protocol-card" key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="supervisor" aria-labelledby="supervisor-title">
        <div>
          <p className="kicker">Supervisor panel · Restricted</p>
          <h2 id="supervisor-title">Chris has the keys.</h2>
          <p>
            The owner-only controls can start a colleague chat with Hugh, lock
            the desk immediately, or release Carson back onto shift.
          </p>
        </div>
        <dl className="command-list">
          <div>
            <dt>/talk [length]</dt>
            <dd>Start a short exchange with Hugh</dd>
          </div>
          <div>
            <dt>/lock</dt>
            <dd>Mark the security desk as busy</dd>
          </div>
          <div>
            <dt>/release</dt>
            <dd>Return Carson to public duty</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
