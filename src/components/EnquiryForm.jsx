import { CheckCircle, LoaderCircle, Send } from "lucide-react";
import { useState } from "react";

const initial = { name: "", email: "", phone: "", organization: "", purpose: "Product Demo", message: "", website: "" };
export default function EnquiryForm() {
  const [form, setForm] = useState(initial); const [status, setStatus] = useState("idle"); const [error, setError] = useState("");
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setError("");
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.message.trim()) return setError("Please enter your name, a valid email address and a message.");
    if (form.phone && !/^[+\d\s()-]{7,20}$/.test(form.phone)) return setError("Please enter a valid phone number.");
    setStatus("loading");
    try { const response = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to deliver your enquiry."); setStatus("success"); setForm(initial); } catch (err) { setStatus("idle"); setError(err.message); }
  };
  if (status === "success") return <div className="success-card"><CheckCircle size={48} /><h3>Enquiry received</h3><p>Thank you for your interest in MedGenesis. Our team will reach out to you shortly.</p><button className="button outline" onClick={() => setStatus("idle")}>Send another enquiry</button></div>;
  return <form className="enquiry-form" onSubmit={submit} noValidate><div className="form-grid"><label>Full Name *<input name="name" value={form.name} onChange={change} /></label><label>Email *<input name="email" type="email" value={form.email} onChange={change} /></label><label>Phone Number<input name="phone" value={form.phone} onChange={change} /></label><label>Hospital / Organization<input name="organization" value={form.organization} onChange={change} /></label></div><label>Purpose<select name="purpose" value={form.purpose} onChange={change}><option>Product Demo</option><option>Hospital Partnership</option><option>Clinical Collaboration</option><option>Investment Enquiry</option><option>General Enquiry</option></select></label><label>Message *<textarea name="message" rows="5" value={form.message} onChange={change} /></label><input className="honeypot" name="website" value={form.website} onChange={change} tabIndex="-1" autoComplete="off" />{error && <p className="form-error">{error}</p>}<button className="button" disabled={status === "loading"}>{status === "loading" ? <><LoaderCircle className="spin" size={18} /> Sending...</> : <><Send size={17} /> Submit Enquiry</>}</button></form>;
}
