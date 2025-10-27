// app/api/paypal/capture-order/route.js
import { NextResponse } from "next/server";
import { getAccessToken } from "../lib/paypal";

export async function POST(req) {
  try {
    // Esperamos: { orderID: "XXX" }
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: "orderID requerido" }, { status: 400 });
    }

    const { token, base } = await getAccessToken();

    const capRes = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    const capture = await capRes.json();

    if (!capRes.ok) {
      return NextResponse.json(
        { error: "No se pudo capturar la orden", details: capture },
        { status: 400 }
      );
    }

    // Verificación de estado
    // status suele ser "COMPLETED" cuando está OK
    const status = capture?.status || capture?.purchase_units?.[0]?.payments?.captures?.[0]?.status;

    // TODO: guarda en tu BD: orderID, status, payer, purchase_units, amount, etc.
    // Ejemplo de datos útiles:
    // const payer = capture?.payer;
    // const pu = capture?.purchase_units?.[0];
    // const payment = pu?.payments?.captures?.[0];

    return NextResponse.json({ ok: true, status, capture });
  } catch (err) {
    console.error("CAPTURE-ORDER ERROR", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
