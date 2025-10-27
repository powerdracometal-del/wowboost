"use client";
import { useEffect, useRef } from "react";

export default function PayPalButton({ amount, description, containerId }) {
  const rendered = useRef(false);
  const latest = useRef({ amount, description });

  // Mantén siempre las props actuales en un ref (sin re-renderizar botones)
  useEffect(() => {
    latest.current = { amount, description };
  }, [amount, description]);

  useEffect(() => {
    let cancelled = false;

    function loadSdk() {
      return new Promise((resolve) => {
        if (window.paypal) return resolve();
        const existing = document.getElementById("paypal-sdk");
        if (existing) {
          existing.addEventListener("load", resolve, { once: true });
          return;
        }
        const script = document.createElement("script");
        script.id = "paypal-sdk";
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    }

    async function renderButtons() {
      await loadSdk();
      if (cancelled || !window.paypal) return;

      const container = document.getElementById(containerId);
      if (!container) return;

      // Limpia el contenedor por si el efecto se dispara otra vez
      container.innerHTML = "";

      // Evita render doble (StrictMode / re-renders)
      if (rendered.current) return;
      rendered.current = true;

      window.paypal
        .Buttons({
          style: { color: "gold", shape: "rect", label: "paypal", layout: "vertical" },

          createOrder: async () => {
            const { amount, description } = latest.current;
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount, description }),
            });
            const data = await res.json();
            if (!res.ok || !data.id) {
              alert("Error creando la orden en el servidor");
              throw new Error(data.error || "No se creó la orden");
            }
            return data.id;
          },

          onApprove: async (data) => {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const result = await res.json();
            if (result?.ok) {
              alert("✅ Pago completado correctamente");
              console.log("CAPTURE:", result.capture);
            } else {
              alert("⚠️ Problema al capturar el pago");
              console.error(result);
            }
          },

          onError: (err) => {
            console.error("PayPal error:", err);
            alert("❌ Error en PayPal. Intenta de nuevo.");
          },
        })
        .render(`#${containerId}`);
    }

    renderButtons();

    // Limpieza al desmontar
    return () => {
      cancelled = true;
      rendered.current = false;
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = "";
    };
  }, [containerId]); // ¡OJO! NO dependas de amount/description aquí

  return <div id={containerId} />;
}
