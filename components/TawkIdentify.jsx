// components/TawkIdentify.jsx
"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export default function TawkIdentify() {
  const { data: session, status } = useSession();
  const triedRef = useRef(false);

  useEffect(() => {
    // intenta identificar cuando:
    // 1) hay sesión lista
    // 2) existe la API de Tawk
    if (status !== "authenticated") return;

    function identify() {
      if (!window.Tawk_API?.setAttributes) return false;

      const name =
        session?.user?.name || "Discord user";
      const email =
        session?.user?.email || ""; // puede venir vacío si Discord no lo comparte
      const discordId =
        session?.user?.discordId || ""; // si no lo tienes aún en session, no pasa nada

      // Establece datos visibles + un atributo personalizado
      window.Tawk_API.setAttributes?.(
        { name, email, discordId },
        (err) => {
          if (err) {
            console.warn("[tawk] setAttributes error:", err);
          }
        }
      );
      return true;
    }

    // Varias oportunidades para que el widget ya esté cargado
    let attempts = 0;
    const maxAttempts = 40; // ~20s
    const interval = setInterval(() => {
      attempts++;
      const ok = identify();
      if (ok || attempts >= maxAttempts) clearInterval(interval);
    }, 500);

    // También por si tawk expone onLoad
    if (!triedRef.current) {
      triedRef.current = true;
      window.Tawk_API = window.Tawk_API || {};
      const prev = window.Tawk_API.onLoad;
      window.Tawk_API.onLoad = function () {
        prev?.();
        identify();
      };
    }

    return () => clearInterval(interval);
  }, [status, session]);

  return null;
}
