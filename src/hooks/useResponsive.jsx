import { useState, useEffect } from 'react';

/**
 * useResponsive — Central hook for all screen-size-aware logic.
 *
 * Breakpoints (matching Tailwind defaults):
 *   xs  : < 480px   (small phones)
 *   sm  : 480–767px (large phones)
 *   md  : 768–1023px (tablets)
 *   lg  : 1024–1279px (small laptops)
 *   xl  : ≥ 1280px  (desktops)
 */

const BREAKPOINTS = {
  xs: 480,
  sm: 768,
  md: 1024,
  lg: 1280,
};

function getBreakpoint(width) {
  if (width < BREAKPOINTS.xs) return 'xs';
  if (width < BREAKPOINTS.sm) return 'sm';
  if (width < BREAKPOINTS.md) return 'md';
  if (width < BREAKPOINTS.lg) return 'lg';
  return 'xl';
}

/**
 * Returns dynamic rocket coordinates for the intro animation.
 * Each breakpoint targets the rocket icon in the flyer-banner.png
 * which is positioned differently as the image scales under object-cover.
 */
function getRocketCoords(vw, vh, breakpoint) {
  switch (breakpoint) {
    case 'xs': // Portrait phones
      return {
        startX: vw * 0.58,
        startY: vh * 0.42,
        endX: vw * 0.15,
        endY: vh * 0.10,
      };
    case 'sm': // Large phones
      return {
        startX: vw * 0.60,
        startY: vh * 0.42,
        endX: vw * 0.18,
        endY: vh * 0.11,
      };
    case 'md': // Tablets
      return {
        startX: vw * 0.61,
        startY: vh * 0.41,
        endX: vw * 0.20,
        endY: vh * 0.12,
      };
    case 'lg': // Small laptops
      return {
        startX: vw * 0.61,
        startY: vh * 0.41,
        endX: vw * 0.24,
        endY: vh * 0.12,
      };
    default: // xl desktops
      return {
        startX: vw * 0.61,
        startY: vh * 0.41,
        endX: vw * 0.26,
        endY: vh * 0.13,
      };
  }
}

/**
 * Returns fog cloud scale factor per breakpoint so clouds
 * don't overflow on small screens.
 */
function getFogScale(breakpoint) {
  switch (breakpoint) {
    case 'xs': return 0.35;
    case 'sm': return 0.50;
    case 'md': return 0.70;
    case 'lg': return 0.85;
    default: return 1.00;
  }
}

export function useResponsive() {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1280,
        height: 720,
        breakpoint: 'xl',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        coords: { startX: 0, startY: 0, endX: 0, endY: 0 },
        fogScale: 1,
      };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bp = getBreakpoint(vw);
    return {
      width: vw,
      height: vh,
      breakpoint: bp,
      isMobile: bp === 'xs' || bp === 'sm',
      isTablet: bp === 'md',
      isDesktop: bp === 'lg' || bp === 'xl',
      coords: getRocketCoords(vw, vh, bp),
      fogScale: getFogScale(bp),
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const bp = getBreakpoint(vw);
      setState({
        width: vw,
        height: vh,
        breakpoint: bp,
        isMobile: bp === 'xs' || bp === 'sm',
        isTablet: bp === 'md',
        isDesktop: bp === 'lg' || bp === 'xl',
        coords: getRocketCoords(vw, vh, bp),
        fogScale: getFogScale(bp),
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}

export default useResponsive;
