// app/api/paypal/create-order/route.js
import { NextResponse } from "next/server";
import { getAccessToken, sanitizeAmount } from "../lib/paypal";

export async function POST(req) {
  try {
    // Esperamos algo así desde el front:
    // { amount: "36.00", description: "KSM (Season 3) | Selfplay | Traders:2", meta: { slug, ... } }
    const body = await req.json().catch(() => ({}));
    const amount = sanitizeAmount(body?.amount);
    const description = String(body?.description || "Order");

    // (Opcional) Punto para validar server-side tu lógica de precios:
    // - Puedes revisar body.meta.slug / opciones y recalcular total aquí
    // - Si no coincide, rechazar o corregir amount
    // Por simplicidad ahora confiamos en el front y solo saneamos:
    // TODO: Validación server-side completa de productos/opciones.

    const { token, base } = await getAccessToken();

    const createRes = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: amount },
            description: description.slice(0, 127), // PayPal limita a 127 chars
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "Wowboost Services",
        },
      }),
    });

    const data = await createRes.json();

    if (!createRes.ok) {
      return NextResponse.json(
        { error: "No se pudo crear la orden PayPal", details: data },
        { status: 400 }
      );
    }

    // Puedes guardar en tu BD aquí un "pedido PRE-CAPTURE" con data.id
    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("CREATE-ORDER ERROR", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
