// coordenadasModelos.ts

// Función para interpolar puntos entre dos coordenadas
function interpolarLinea(p1: [number, number], p2: [number, number], pasos: number): [number, number][] {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  return Array.from({ length: pasos }, (_, i) => {
    const t = i / (pasos - 1);
    return [
      Math.round(x1 + (x2 - x1) * t),
      Math.round(y1 + (y2 - y1) * t),
    ];
  });
}

// Modelo de círculo perfecto centrado en (490, 400) con radio 140
export const modeloCirculo: [number, number][] = Array.from({ length: 120 }, (_, i) => {
  const angulo = (i * 2 * Math.PI) / 120;
  const radio = 140;
  const centroX = 490;
  const centroY = 400;
  return [
    Math.round(centroX + radio * Math.cos(angulo)),
    Math.round(centroY + radio * Math.sin(angulo)),
  ];
});

// Cuadrado con interpolación en sus 4 lados (30 puntos por lado)
export const modeloCuadrado: [number, number][] = [
  ...interpolarLinea([350, 260], [630, 260], 30),
  ...interpolarLinea([630, 260], [630, 540], 30),
  ...interpolarLinea([630, 540], [350, 540], 30),
  ...interpolarLinea([350, 540], [350, 260], 30),
];

// Triángulo interpolado (3 lados con 40 puntos cada uno)
export const modeloTriangulo: [number, number][] = [
  ...interpolarLinea([490, 240], [630, 580], 40),
  ...interpolarLinea([630, 580], [350, 580], 40),
  ...interpolarLinea([350, 580], [490, 240], 40),
];

// Placeholders (vacíos por ahora)
export const modeloEstrella: [number, number][] = [];
export const modeloFlecha: [number, number][] = [];
export const modeloPacman: [number, number][] = [];
export const modeloInfinito: [number, number][] = [];
export const modeloFlor: [number, number][] = [];
export const modeloNube: [number, number][] = [];

// Mapa centralizado
export const modelos: Record<string, [number, number][]> = {
  circulo: modeloCirculo,
  cuadrado: modeloCuadrado,
  triangulo: modeloTriangulo,
  estrella: modeloEstrella,
  flecha: modeloFlecha,
  pacman: modeloPacman,
  infinito: modeloInfinito,
  flor: modeloFlor,
  nube: modeloNube,
};
