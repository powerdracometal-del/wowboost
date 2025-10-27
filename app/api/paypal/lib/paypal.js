// app/api/paypal/lib/paypal.js
export async function getAccessToken() {
  const cid = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  const base = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

  if (!cid || !secret) {
    throw new Error("Faltan PAYPAL_CLIENT_ID o PAYPAL_SECRET en .env.local");
  }

  const creds = Buffer.from(`${cid}:${secret}`).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    // Importante para Next 13/14/15 server runtimes:
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Error obteniendo token PayPal: ${res.status} ${txt}`);
  }

  const json = await res.json();
  return { token: json.access_token, base };
}

/**
 * Sanitiza un monto proveniente del cliente.
 * Retorna string con 2 decimales o lanza error si es inválido.
 */
export function sanitizeAmount(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) throw new Error("Monto inválido");
  return n.toFixed(2);
}
