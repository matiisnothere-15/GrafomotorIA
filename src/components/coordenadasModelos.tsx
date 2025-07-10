// coordenadasModelos.ts

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

function generarEspiral(
  centro: [number, number],
  radioInicial: number,
  vueltas: number,
  pasos = 160,
): [number, number][] {
  return Array.from({ length: pasos }, (_, i) => {
    const t = i / (pasos - 1);
    const ang = t * 2 * Math.PI * vueltas;  // dirección normal
    const r = radioInicial * (1 - t);       // se va cerrando
    return [
      Math.round(centro[0] - r * Math.cos(ang)),  // reflejar horizontalmente
      Math.round(centro[1] + r * Math.sin(ang)),
    ];
  });
}



export const modeloCirculo: [number, number][] = (() => {
  const totalPuntos = 120;
  const radio = 140;
  const centroX = 490;
  const centroY = 400;

  return Array.from({ length: totalPuntos }, (_, i) => {
    const angulo = (i * 2 * Math.PI) / totalPuntos;
    const x = centroX + radio * Math.cos(angulo);
    const y = centroY + radio * Math.sin(angulo);
    return [parseFloat(x.toFixed(0)), parseFloat(y.toFixed(0))];
  });
})();

export const modeloCuadrado: [number, number][] = [
  ...interpolarLinea([350, 260], [630, 260], 30),
  ...interpolarLinea([630, 260], [630, 540], 30),
  ...interpolarLinea([630, 540], [350, 540], 30),
  ...interpolarLinea([350, 540], [350, 260], 30),
];

export const modeloTriangulo: [number, number][] = [
  ...interpolarLinea([490, 240], [630, 580], 40),
  ...interpolarLinea([630, 580], [350, 580], 40),
  ...interpolarLinea([350, 580], [490, 240], 40),
];

export const modeloEstrella: [number, number][] = [
  ...interpolarLinea([490, 220], [520, 340], 10),
  ...interpolarLinea([520, 340], [640, 340], 10),
  ...interpolarLinea([640, 340], [540, 410], 10),
  ...interpolarLinea([540, 410], [580, 530], 10),
  ...interpolarLinea([580, 530], [490, 460], 10),
  ...interpolarLinea([490, 460], [400, 530], 10),
  ...interpolarLinea([400, 530], [440, 410], 10),
  ...interpolarLinea([440, 410], [340, 340], 10),
  ...interpolarLinea([340, 340], [460, 340], 10),
  ...interpolarLinea([460, 340], [490, 220], 10),
];

export const modeloFlecha: [number, number][] = [
  ...interpolarLinea([490, 200], [630, 400], 30),
  ...interpolarLinea([630, 400], [560, 400], 10),
  ...interpolarLinea([560, 400], [560, 580], 30),
  ...interpolarLinea([420, 580], [420, 400], 30),
  ...interpolarLinea([420, 400], [350, 400], 10),
  ...interpolarLinea([350, 400], [490, 200], 30),
];

export const modeloPacman: [number, number][] = [
  [295, 8], [284, 12], [271, 13], [259, 14], [247, 17], [236, 21], [225, 24],
  [214, 28], [203, 32], [192, 37], [183, 42], [173, 48], [162, 54], [153, 61],
  [142, 69], [132, 76], [125, 83], [117, 92], [108, 100], [102, 109], [94, 118],
  [86, 129], [80, 139], [75, 148], [69, 158], [64, 170], [59, 181], [55, 193],
  [51, 204], [48, 216], [45, 227], [43, 240], [42, 252], [41, 265], [40, 279],
  [39, 292], [41, 304], [41, 318], [43, 331], [45, 342], [48, 355], [51, 367],
  [54, 379], [58, 391], [63, 402], [68, 413], [72, 424], [78, 433], [84, 443],
  [91, 452], [99, 462], [107, 472], [115, 480], [123, 489], [132, 497], [142, 505],
  [151, 513], [161, 519], [172, 526], [182, 532], [193, 538], [204, 543], [215, 547],
  [227, 551], [239, 556], [251, 559], [262, 562], [274, 564], [287, 565], [300, 566],
  [313, 566], [327, 566], [340, 566], [353, 564], [365, 562], [378, 560], [390, 557],
  [401, 553], [413, 549], [425, 545], [435, 539], [445, 534], [456, 528], [466, 522],
  [477, 515], [486, 508], [496, 501], [504, 493], [513, 484], [522, 475], [531, 465],
  [538, 456], [545, 446], [550, 436], [546, 424], [536, 418], [526, 412], [516, 406],
  [506, 399], [496, 392], [487, 386], [477, 380], [467, 372], [458, 366], [447, 361],
  [438, 354], [427, 347], [417, 342], [407, 335], [396, 327], [388, 321], [377, 315],
  [367, 309], [357, 302], [349, 295], [349, 282], [360, 276], [370, 269], [380, 262],
  [390, 257], [399, 250], [409, 243], [419, 237], [430, 230], [441, 223], [451, 215],
  [461, 208], [471, 202], [481, 197], [491, 190], [501, 183], [512, 176], [521, 169],
  [531, 163], [541, 156], [550, 148], [548, 135], [542, 125], [536, 116], [526, 106],
  [516, 96], [508, 88], [499, 79], [489, 71], [479, 64], [470, 56], [459, 50],
  [449, 44], [439, 38], [428, 34], [417, 29], [405, 25], [395, 21], [382, 17],
  [370, 15], [358, 14], [346, 11], [333, 10], [321, 10], [308, 9], [295, 8]
];


export const modeloInfinito: [number, number][] = [
  [490, 400], [495, 403], [501, 407], [507, 411], [513, 414], [519, 418], [525, 421],
  [530, 425], [536, 428], [541, 430], [547, 433], [552, 436], [557, 438], [562, 440],
  [567, 441], [572, 442], [577, 443], [581, 444], [586, 444], [590, 444], [594, 444],
  [598, 444], [602, 443], [605, 441], [608, 440], [611, 438], [614, 436], [617, 434],
  [619, 431], [621, 428], [623, 425], [625, 422], [626, 419], [627, 415], [628, 412],
  [629, 408], [629, 404], [629, 400], [629, 397], [629, 393], [629, 389], [628, 386],
  [627, 382], [625, 379], [624, 375], [622, 372], [620, 369], [618, 367], [615, 364],
  [613, 362], [610, 360], [607, 358], [603, 357], [600, 356], [596, 355], [592, 355],
  [588, 355], [584, 355], [579, 355], [575, 356], [570, 357], [565, 359], [560, 360],
  [555, 362], [549, 365], [544, 367], [539, 370], [533, 373], [527, 376], [522, 379],
  [516, 383], [510, 386], [504, 390], [498, 394], [492, 398], [487, 401], [481, 405],
  [475, 409], [469, 413], [463, 416], [457, 420], [452, 423], [446, 426], [440, 429],
  [435, 432], [430, 434], [424, 437], [419, 439], [414, 440], [409, 442], [404, 443],
  [400, 444], [395, 444], [391, 444], [387, 444], [383, 444], [379, 443], [376, 442],
  [372, 441], [369, 439], [366, 437], [364, 435], [361, 432], [359, 430], [357, 427],
  [355, 424], [354, 420], [352, 417], [351, 413], [350, 410], [350, 406], [350, 402],
  [350, 399], [350, 395], [350, 391], [351, 387], [352, 384], [353, 380], [354, 377],
  [356, 374], [358, 371], [360, 368], [362, 365], [365, 363], [368, 361], [371, 359],
  [374, 358], [377, 356], [381, 355], [385, 355], [389, 355], [393, 355], [398, 355],
  [402, 356], [407, 357], [412, 358], [417, 359], [422, 361], [427, 363], [432, 366],
  [438, 369], [443, 371], [449, 374], [454, 378], [460, 381], [466, 385], [472, 388],
  [478, 392], [484, 396], [489, 400]
];

export const modeloArbol: [number, number][] = [
  [446, 599], [457, 599], [469, 599], [481, 599], [493, 599], [505, 599], [517, 599],
  [529, 599], [535, 593], [534, 582], [532, 570], [531, 558], [530, 546], [529, 534],
  [527, 523], [526, 511], [525, 499], [535, 498], [547, 498], [559, 498], [571, 498],
  [582, 498], [594, 498], [606, 498], [618, 494], [629, 491], [641, 488], [652, 485],
  [661, 477], [668, 468], [676, 459], [683, 450], [691, 440], [698, 431], [701, 420],
  [701, 408], [702, 396], [702, 384], [698, 373], [694, 362], [689, 352], [680, 343],
  [672, 335], [663, 327], [653, 322], [642, 317], [631, 312], [620, 307], [611, 300],
  [607, 289], [604, 278], [600, 266], [597, 255], [593, 244], [587, 234], [579, 225],
  [571, 216], [564, 207], [553, 202], [542, 197], [532, 192], [521, 187], [510, 183],
  [498, 183], [486, 183], [474, 183], [462, 183], [452, 188], [441, 193], [430, 198],
  [419, 204], [411, 212], [402, 220], [395, 229], [391, 240], [387, 251], [383, 262],
  [379, 274], [375, 285], [371, 296], [365, 306], [354, 311], [343, 316], [333, 321],
  [322, 326], [311, 331], [303, 339], [295, 348], [288, 357], [283, 368], [279, 380],
  [277, 391], [279, 403], [280, 414], [282, 426], [284, 438], [290, 447], [299, 456],
  [307, 464], [315, 473], [324, 481], [333, 488], [344, 492], [356, 495], [367, 497],
  [379, 497], [391, 496], [403, 495], [415, 494], [426, 493], [438, 493], [449, 497],
  [456, 504], [455, 516], [453, 528], [452, 539], [451, 551], [449, 563], [448, 575],
  [447, 587]
];



export const modeloNube: [number, number][] = [
  [231, 395], [235, 385], [240, 375], [245, 364], [252, 356], [260, 348], [268, 340],
  [278, 334], [289, 331], [300, 328], [310, 325], [321, 323], [333, 325], [344, 327],
  [355, 328], [364, 326], [369, 316], [374, 305], [378, 295], [385, 286], [392, 277],
  [400, 269], [407, 260], [416, 253], [426, 248], [437, 243], [447, 238], [457, 233],
  [468, 233], [480, 232], [491, 231], [502, 230], [514, 230], [524, 235], [534, 240],
  [545, 245], [555, 249], [565, 254], [576, 259], [584, 267], [591, 275], [599, 284],
  [606, 292], [611, 303], [616, 313], [620, 323], [625, 334], [635, 335], [646, 335],
  [658, 334], [669, 334], [680, 335], [690, 340], [701, 344], [711, 349], [720, 355],
  [727, 364], [734, 374], [740, 383], [747, 392], [749, 403], [750, 414], [751, 426],
  [752, 437], [749, 448], [745, 458], [740, 468], [735, 479], [729, 488], [720, 495],
  [712, 503], [702, 508], [691, 512], [680, 516], [669, 517], [658, 517], [647, 517],
  [635, 517], [624, 518], [613, 517], [601, 517], [590, 518], [578, 518], [567, 517],
  [556, 517], [544, 517], [533, 517], [522, 517], [510, 517], [499, 517], [487, 517],
  [476, 517], [465, 517], [453, 517], [442, 517], [431, 517], [419, 517], [408, 517],
  [396, 517], [385, 517], [374, 517], [362, 517], [351, 517], [340, 517], [328, 517],
  [317, 517], [306, 517], [295, 513], [284, 509], [274, 504], [265, 497], [257, 489],
  [249, 481], [242, 473], [238, 462], [234, 451], [230, 441], [229, 430], [229, 418],
  [230, 407]
];



export const modelos: Record<string, [number, number][]> = {
  circulo: modeloCirculo,
  cuadrado: modeloCuadrado,
  triangulo: modeloTriangulo,
  estrella: modeloEstrella,
  flecha: modeloFlecha,
  pacman: modeloPacman,
  infinito: modeloInfinito,
  arbol: modeloArbol,
  nube: modeloNube,
};

export const modeloMontana: [number, number][] = [
  [33, 386],  [55, 364],  [79, 339],  [101, 316], [123, 293],
  [146, 270], [168, 293], [190, 316], [212, 339], [234, 362],
  [257, 385], [279, 362], [301, 339], [323, 316], [345, 293],
  [368, 270], [390, 293], [412, 316], [434, 339], [457, 362],
  [479, 385], [501, 362], [523, 339], [545, 316], [567, 293],
  [590, 270], [612, 293], [634, 316], [656, 339], [679, 362],
  [701, 385], [723, 362], [745, 339], [767, 316], [789, 293],
  [812, 270], [834, 293], [856, 316], [878, 339], [901, 362],
  [923, 385]
];


export const modeloOndas: [number, number][] = Array.from({ length: 100 }, (_, i) => {
  const x = 100 + i * 6;
  const y = 400 + Math.sin(i * 0.3) * 40;
  return [x, Math.round(y)];
});
export const modeloOla: [number, number][] = [
  // 1. Comienza en la parte inferior izquierda y sube hasta la cresta
  [37, 847],
  [194, 691],
  [373, 333],
  [511, 242],
  [648, 215],

  // 2. Conecta con el rizo y baja por su borde exterior
  [844, 291],
  [1024, 564],

  // 3. Dibuja la curva completa del rizo hasta la punta final
  [1007, 595],
  [852, 496],
  [716, 514],
  [651, 633],
  [695, 741],
  [869, 830],
  [1079, 786] // Punto final del trazo
];

export const modeloPunteagudo: [number, number][] = [
  ...interpolarLinea([100, 500], [200, 300], 10),
  ...interpolarLinea([200, 300], [300, 500], 10),
  ...interpolarLinea([300, 500], [400, 300], 10),
  ...interpolarLinea([400, 300], [500, 500], 10),
  ...interpolarLinea([500, 500], [600, 300], 10),
  ...interpolarLinea([600, 300], [700, 500], 10),
  ...interpolarLinea([700, 500], [800, 300], 10),
  ...interpolarLinea([800, 300], [900, 500], 10),
  ...interpolarLinea([900, 500], [1000, 300], 10),
  ...interpolarLinea([1000, 300], [1100, 500], 10),
];

export const modeloCaminoCurv: [number, number][] = Array.from({ length: 120 }, (_, i) => {
  const x = 100 + i * 5;
  const yOndulado = Math.sin(i * 0.25) * 60 * Math.sin(i * 0.1);
  const yInclinado = i * 0.7; // inclinación leve hacia arriba
  const y = 400 + yOndulado - yInclinado;
  return [x, Math.round(y)];
});

export const modeloEspiral: [number, number][] = (() => {
  const puntos: [number, number][] = [];
  const centroX = 400;
  const centroY = 350;
  const vueltas = 4;
  const puntosTotales = 200;
  const separacion = 3;

  for (let i = 0; i < puntosTotales; i++) {
    const angulo = i * (Math.PI * 2 * vueltas) / puntosTotales;
    const radio = i * separacion / puntosTotales * 100;
    const x = centroX + radio * Math.cos(angulo);
    const y = centroY + radio * Math.sin(angulo);
    puntos.push([Math.round(x), Math.round(y)]);
  }

  return puntos;
})();

export const modeloCurvasE: [number, number][] = [
[216, 147], [103, 175], [21, 256], [5, 371], [28, 483], [54, 596], [31, 708], [94, 675], [88, 558],
[62, 446], [46, 328], [101, 226], [213, 191], [330, 214], [293, 277], [183, 319], [211, 411], [328, 417],
[252, 458], [196, 543], [281, 599], [347, 633], [244, 675], [224, 773], [334, 799], [454, 793], [575, 786],
[641, 695], [630, 574], [624, 453], [643, 332], [719, 226], [838, 191], [956, 231], [929, 335], [808, 359],
[723, 451], [815, 524], [906, 585], [791, 617], [812, 718], [930, 719], [1024, 776], [1002, 872], [881, 878],
[760, 875], [639, 872], [518, 869], [397, 872], [276, 878], [159, 891], [214, 926], [334, 919], [454, 916],
[575, 916], [696, 919], [817, 921], [938, 922], [1050, 890], [1070, 780], [995, 696], [879, 672], [838, 644],
[942, 608], [902, 510], [792, 477], [815, 401], [928, 379], [1012, 308], [982, 199], [879, 151], [762, 159],
[663, 219], [603, 315], [584, 431], [587, 551], [600, 667], [545, 746], [424, 762], [303, 768], [182, 774],
];


export const modeloDobleEspiral: [number, number][] = (() => {
  const puntos: [number, number][] = [];

  const vueltas = 3;
  const puntosPorEspiral = 180;
  const separacion = 3;

  const centroIzqX = 250;
  const centroDerX = 850;
  const centroY = 350;

  const espiralDerecha: [number, number][] = [];

  // Espiral izquierda (centro hacia afuera)
  for (let i = 0; i < puntosPorEspiral; i++) {
    const angulo = i * (Math.PI * 2 * vueltas) / puntosPorEspiral;
    const radio = (i * separacion / puntosPorEspiral) * 100;
    const x = centroIzqX + radio * Math.cos(angulo);
    const y = centroY + radio * Math.sin(angulo);
    puntos.push([Math.round(x), Math.round(y)]);
  }

  // Generar espiral derecha por separado para conocer el primer punto
  for (let i = puntosPorEspiral - 1; i >= 0; i--) {
    const angulo = i * (Math.PI * 2 * vueltas) / puntosPorEspiral + Math.PI;
    const radio = (i * separacion / puntosPorEspiral) * 100;
    const x = centroDerX + radio * Math.cos(angulo);
    const y = centroY + radio * Math.sin(angulo);
    espiralDerecha.push([Math.round(x), Math.round(y)]);
  }

  // Línea de conexión directa entre el final del espiral izquierdo y el inicio del derecho
  const puntoFinalIzq = puntos[puntos.length - 1];
  const puntoInicioDer = espiralDerecha[0];
  const pasosConexion = 20;
  for (let i = 1; i <= pasosConexion; i++) {
    const t = i / pasosConexion;
    const x = Math.round(puntoFinalIzq[0] + (puntoInicioDer[0] - puntoFinalIzq[0]) * t);
    const y = Math.round(puntoFinalIzq[1] + (puntoInicioDer[1] - puntoFinalIzq[1]) * t);
    puntos.push([x, y]);
  }

  // Añadir espiral derecha
  puntos.push(...espiralDerecha);

  return puntos;
})();



// Escala multiplicada (1.5x por ejemplo)
export const modeloZigzagEspiral: [number, number][] = [
  // 1) Zig-zag (3 picos) más grandes
  ...interpolarLinea([150, 825], [300, 645], 10),  // ➚
  ...interpolarLinea([300, 645], [450, 825], 10),  // ➘
  ...interpolarLinea([450, 825], [600, 645], 10),  // ➚
  ...interpolarLinea([600, 645], [750, 825], 10),  // ➘

  // 2) Subida más larga hasta la “meseta”
  ...interpolarLinea([750, 825], [750, 480], 12),

  // 3) Tramo oblicuo más largo hacia la base del espiral
  ...interpolarLinea([750, 480], [975, 630], 14),

  // 4) Espiral exterior → interior (giro horizontal a la izquierda, más grande)
  ...generarEspiral([1200, 630], 210, 2.75),
];



// Mapa de modelos exportado
export const modelosTrazado: Record<string, [number, number][]> = {
  montaña: modeloMontana,
  ondas: modeloOndas,
  ola: modeloOla,
  punteagudo: modeloPunteagudo,
  caminocurva: modeloCaminoCurv,
  espiral: modeloEspiral,
  curvasE: modeloCurvasE,
  doble_espiral: modeloDobleEspiral,
  zigzag_espiral: modeloZigzagEspiral,
};