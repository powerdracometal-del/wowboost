"use client";
import { useState } from "react";

/**
 * CheckboxList — lista de selección múltiple estilizada
 *
 * Props:
 * - options: [{ id: number, name: string, price: number }]
 * - onChange: (ids: number[]) => void
 */
export default function CheckboxList({ options = [], onChange }) {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    let next;
    if (selected.includes(id)) {
      next = selected.filter((x) => x !== id);
    } else {
      next = [...selected, id];
    }
    setSelected(next);
    onChange?.(next);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map((opt) => {
        const isActive = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`rounded-xl px-3 py-2 border text-sm transition flex flex-col items-center justify-center
              ${
                isActive
                  ? "bg-amber-400/20 border-amber-400 text-amber-200 shadow-md"
                  : "bg-black/30 border-white/15 text-white/80 hover:bg-white/10"
              }`}
          >
            <span className="font-semibold">{opt.name}</span>
            <span className="text-xs text-white/70">${opt.price}</span>
          </button>
        );
      })}
    </div>
  );
}
