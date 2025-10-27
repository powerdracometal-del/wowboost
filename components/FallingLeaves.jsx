"use client";
import { useEffect } from "react";

export default function FallingLeaves() {
  useEffect(() => {
    const numLeaves = 18; // puedes bajar/subir la cantidad si quieres
    const container = document.createElement("div");
    container.className = "leaves-container";
    document.body.appendChild(container);

    for (let i = 0; i < numLeaves; i++) {
      const leaf = document.createElement("img");

      // alterna entre las dos imágenes
      const isOrange = Math.random() > 0.5;
      leaf.src = isOrange ? "/leaf_orange.png" : "/leaf_green.png";

      // tamaño y posición inicial
      const size = Math.random() * 20 + 20; // 20px - 40px
      leaf.style.width = `${size}px`;
      leaf.style.height = "auto";

      // clase y posición horizontal aleatoria
      leaf.className = "leaf-image";
      leaf.style.left = `${Math.random() * 100}vw`;

      // MÁS DESPACIO: duraciones más largas
      const fallDur = 10 + Math.random() * 12; // 10s - 22s
      const swayDur = 4 + Math.random() * 6;  // 4s - 10s
      leaf.style.animationDuration = `${fallDur}s, ${swayDur}s`;

      // retraso aleatorio para desincronizar
      leaf.style.animationDelay = `${Math.random() * 5}s`;

      // ligeras variaciones por hoja (profundidad y giro)
      leaf.style.setProperty("--tiltX", `${Math.random() * 20 - 10}deg`); // -10 a 10
      leaf.style.setProperty("--tiltY", `${Math.random() * 30 - 15}deg`); // -15 a 15

      container.appendChild(leaf);
    }

    return () => container.remove();
  }, []);

  return null;
}
