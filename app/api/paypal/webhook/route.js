// app/api/paypal/webhook/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.text();                     // importante: texto crudo
  const headers = Object.fromEntries(req.headers);   // id, cert-url, transmission-sig, etc.

  // TODO: llamar a /v1/notifications/verify-webhook-signature con:
  // transmission_id, transmission_time, cert_url, auth_algo, transmission_sig, webhook_id, webhook_event (body JSON)
  // Si 'verification_status' !== 'SUCCESS' => 400

  const evt = JSON.parse(body);
  // Manejar tipos:
  // if (evt.event_type === "PAYMENT.CAPTURE.COMPLETED") { ... marcar pagado ... }

  return NextResponse.json({ ok: true });
}
