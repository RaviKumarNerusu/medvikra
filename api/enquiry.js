const requests = globalThis.__medgenesisEnquiryRequests || (globalThis.__medgenesisEnquiryRequests = new Map());

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const ip = req.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const now = Date.now();
  const recent = (requests.get(ip) || []).filter((timestamp) => now - timestamp < 60_000);
  if (recent.length >= 5) return res.status(429).json({ error: "Too many enquiries from this address. Please try again later." });
  recent.push(now);
  requests.set(ip, recent);
  const { name, email, phone, organization, purpose, message, website } = req.body || {};
  if (website) return res.status(400).json({ error: "Unable to process this request." });
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "") || !message) return res.status(400).json({ error: "Name, valid email and message are required." });
  if (phone && !/^[+\d\s()-]{7,20}$/.test(phone)) return res.status(400).json({ error: "Invalid phone number." });
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) return res.status(503).json({ error: "Enquiry delivery is not configured yet. Please email medgenesispvtltd@gmail.com directly." });
  const safe = (value) => String(value || "").replace(/[<>]/g, "").slice(0, 2000);
  let response;
  try {
    response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: "MedGenesis Website <onboarding@resend.dev>", to: [process.env.CONTACT_EMAIL], reply_to: safe(email), subject: `MedGenesis enquiry: ${safe(purpose)}`, text: `Name: ${safe(name)}\nEmail: ${safe(email)}\nPhone: ${safe(phone)}\nOrganization: ${safe(organization)}\nPurpose: ${safe(purpose)}\n\n${safe(message)}` }) });
  } catch {
    return res.status(502).json({ error: "The enquiry service is temporarily unavailable. Please try again or email us directly." });
  }
  if (!response.ok) return res.status(502).json({ error: "The enquiry could not be delivered. Please try again or email us directly." });
  return res.status(200).json({ ok: true });
}
