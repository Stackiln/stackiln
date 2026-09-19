import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import config from "../../product-config.json";

export default function Home() {
  return <><section className="home-intro"><Image className="home-media" src="/workspace.png" alt="Sunlit architectural workspace" fill priority sizes="100vw" /><div className="home-copy"><p className="eyebrow">Welcome</p><h1>{config.product.name}</h1><p className="lead">{config.product.description}</p><Link className="text-link" href="#about">Learn more <ArrowDownRight size={18} aria-hidden="true" /></Link></div></section><section className="content-band" id="about"><div><p className="eyebrow">About</p><h2>{config.product.name}</h2></div><p>{config.product.description}</p></section></>;
}
