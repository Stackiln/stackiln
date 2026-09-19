import { features } from "../../content/pages";
export default function Features() { return <section className="content-page"><h1>Features</h1><p>Describe the parts of your product that matter most to customers.</p>{features.map(feature => <section key={feature.title}><h2>{feature.title}</h2><p>{feature.description}</p></section>)}</section>; }
