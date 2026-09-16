import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './Dock.css';

/* ── Single magnified dock item ─────────────────────────────── */
function DockItem({ mouseX, item, baseItemSize, magnification }) {
  const ref = useRef(null);

  /* distance from cursor to item centre */
  const distance = useTransform(mouseX, (x) => {
    if (!ref.current) return 999;
    const { left, width } = ref.current.getBoundingClientRect();
    return Math.abs(x - (left + width / 2));
  });

  /* interpolate: 0 px away → magnification, ≥140 px → base */
  const rawSize = useTransform(distance, [0, 140], [magnification, baseItemSize]);
  const size = useSpring(rawSize, { stiffness: 400, damping: 30 });

  return (
    <motion.div
      ref={ref}
      className="dock-item"
      style={{ width: size, height: size }}
      onClick={item.onClick}
      whileTap={{ scale: 0.88 }}
      title={item.label}
    >
      <div className="dock-item-icon">{item.icon}</div>
      <span className="dock-label">{item.label}</span>
    </motion.div>
  );
}

/* ── Dock panel ─────────────────────────────────────────────── */
export default function Dock({
  items = [],
  panelHeight = 68,
  baseItemSize = 50,
  magnification = 70,
  className = '',
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      className={`dock-panel ${className}`}
      style={{ height: panelHeight }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {items.map((item, i) => (
        <DockItem
          key={i}
          mouseX={mouseX}
          item={item}
          baseItemSize={baseItemSize}
          magnification={magnification}
        />
      ))}
    </motion.div>
  );
}
