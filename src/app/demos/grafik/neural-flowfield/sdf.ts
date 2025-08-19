// src/app/demos/grafik/neural-flowfield/sdf.ts
// Canvas-based "Pseudo-SDF" for Logo/Text formation
// Generates distance field textures for particle attraction

export type SDF = { 
  tex: HTMLCanvasElement; 
  width: number; 
  height: number; 
};

export function makeTextSDF({
  text = "KLAUS WEIGELE",
  font = "700 160px Inter, system-ui, sans-serif",
  padding = 40,
  blur = 6,               // pseudo-SDF via Gaussian blur
  width = 1024, 
  height = 256,
} = {}): SDF {
  const cvs = document.createElement("canvas"); 
  cvs.width = width; 
  cvs.height = height;
  
  const ctx = cvs.getContext("2d", { willReadFrequently: true })!;
  
  // Clear to black background
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  // Draw white text
  ctx.fillStyle = "#fff";
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.filter = "none";
  ctx.fillText(text, width / 2, height / 2);

  // Apply blur to create pseudo-SDF (bright = inside, dark = outside)
  if ("filter" in ctx) {
    ctx.globalCompositeOperation = "source-over";
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(cvs, 0, 0);
    ctx.filter = "none";
  }
  
  return { tex: cvs, width, height };
}

// Enhanced SDF with multiple logo states for morphing
export function makeMultiTextSDF({
  texts = ["KLAUS", "WEIGELE", "KI-BERATUNG"],
  font = "700 140px Inter, system-ui, sans-serif",
  padding = 40,
  blur = 8,
  width = 1024,
  height = 256,
} = {}): SDF[] {
  return texts.map(text => makeTextSDF({
    text,
    font,
    padding,
    blur,
    width,
    height
  }));
}

// Klaus Weigele Brand Colors
export const BRAND_COLORS = {
  primary: "#4F46E5",   // Indigo
  secondary: "#06B6D4", // Cyan  
  accent: "#8B5CF6",    // Purple
  highlight: "#F59E0B", // Amber
} as const;

// Color utilities for particle systems
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  if (h < 1/6) { r = c; g = x; b = 0; }
  else if (h < 2/6) { r = x; g = c; b = 0; }
  else if (h < 3/6) { r = 0; g = c; b = x; }
  else if (h < 4/6) { r = 0; g = x; b = c; }
  else if (h < 5/6) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  
  return [r + m, g + m, b + m];
}