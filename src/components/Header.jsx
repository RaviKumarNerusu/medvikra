import { Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const links = [["Overview", "overview"], ["Solutions", "solutions"], ["Specifications", "specifications"], ["Demo", "demo"], ["About Us", "about"], ["Contact", "contact"]];
export default function Header() {
  const [open, setOpen] = useState(false);
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };
  return <header>
    <div className="topbar"><div><a href="tel:+919059061424"><Phone size={14} /> +91 90590 61424</a><a href="mailto:medgenesispvtltd@gmail.com"><Mail size={14} /> medgenesispvtltd@gmail.com</a></div><span>Portable diagnostics for better eye care</span></div>
    <nav className="nav container"><button className="brand" onClick={() => go("overview")}><span className="brand-mark">M</span><span><strong>MedGenesis</strong><small>MEDVIKRA PVT. LTD.</small></span></button><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button><div className={`nav-links ${open ? "open" : ""}`}>{links.map(([label, id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}<button className="button small" onClick={() => go("contact")}>Request a Demo</button></div></nav>
  </header>;
}
