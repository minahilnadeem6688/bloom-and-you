// Emails each contact message to the shop owner through Resend (https://resend.com).
// Needs RESEND_API_KEY and CONTACT_TO. Without them it does nothing, and messages are still saved.

const TIMEOUT_MS = 8000;

module.exports = async function notifyContact({ name, email, message }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) return false;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'Bloom & You <onboarding@resend.dev>',
      to: to.split(',').map((a) => a.trim()).filter(Boolean),
      reply_to: email, // hitting Reply answers the customer directly
      subject: `New message from ${name} · Bloom & You`,
      text: `${message}\n\nFrom: ${name} <${email}>\nSent through the Bloom & You contact page.`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return true;
};
