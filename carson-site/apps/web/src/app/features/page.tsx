import { features } from "../../content/pages";
export default function Features() {
  return (
    <section className="content-page">
      <p className="kicker">Duty manual</p>
      <h1>Operating notes</h1>
      <p>A short record of what Carson does and how the queue stays orderly.</p>
      {features.map((feature) => (
        <section key={feature.title}>
          <h2>{feature.title}</h2>
          <p>{feature.description}</p>
        </section>
      ))}
    </section>
  );
}
