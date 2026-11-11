# Algoritmos de Ordenamiento // Visualizador Cyberpunk

Plataforma para visualizar algoritmos de ordenamiento avanzados paso a paso, con estética cyberpunk/underground. Todos los pasos se pre-calculan, así que puedes pausar, retroceder y avanzar sin perder el estado.

## Algoritmos

| Algoritmo | Estado | Promedio | Espacio |
| --- | --- | --- | --- |
| Quick Sort | Listo | O(n log n) | O(log n) |
| Merge Sort | Listo | O(n log n) | O(n) |
| Heap Sort | Listo | O(n log n) | O(1) |

Merge Sort incluye una vista auxiliar con mitades y buffer de fusión. Heap Sort incluye un árbol del max-heap por niveles y muestra el heap activo y la zona ordenada. La guía para implementar nuevos algoritmos está en [`docs/GUIA_COMPANEROS.md`](docs/GUIA_COMPANEROS.md).

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`).

## Comandos

```bash
npm run dev         # Servidor de desarrollo
npm run typecheck   # TypeScript en modo estricto
npm run lint        # ESLint
npm run test        # Vitest (contrato de algoritmos)
npm run build       # Typecheck + build de producción
npm run preview     # Previsualizar el build
```

## Funcionalidades

- Catálogo en `/` con estado, complejidad y acceso a cada visualizador.
- Rutas con `HashRouter`: `/#/visualizador/quick-sort`, `/#/visualizador/merge-sort`, `/#/visualizador/heap-sort`.
- Tablero de cartas coleccionables con color neón fijo por carta.
- Marcadores genéricos por rol: pivote, `i`/`j`, comparación, mínimo, mitades de merge y heap.
- Brackets de rango `[lo, hi]`, corona de pivote, sellos de posición final y atenuación del subconjunto inactivo.
- Reproducción automática, pausa, paso anterior/siguiente y reinicio.
- Slider de velocidad (1× a 10×).
- Entrada de arreglo personalizado (máximo 20 enteros) con validación, arreglo aleatorio y ejemplos por algoritmo.
- Opciones por algoritmo (Quick Sort: pivote primero o aleatorio).
- Vista de fusión para Merge Sort: mitad izquierda, mitad derecha y buffer de salida.
- Vista de montículo para Heap Sort: árbol por niveles, raíz e hijos activos, tamaño del heap y zona ordenada.
- Contadores exactos de comparaciones y movimientos/intercambios, profundidad de recursión y pila de llamadas.
- Panel de código Java con la línea actual resaltada y registro de pasos en español.
- Confetti y mensaje **SISTEMA ORDENADO** solo cuando un algoritmo `ready` termina.
- Atajos de teclado: `Espacio` (play/pausa), `←` / `→` (paso anterior/siguiente).
- Respeta `prefers-reduced-motion`.

## Arquitectura

```
src/
  core/
    types.ts               Contrato Step / AlgorithmDefinition
    stepFactory.ts         createCards, createStep, cloneArray
    pending.ts             Esqueleto init + done
    registry.ts            Catálogo de algoritmos
    useVisualizerStore.ts  Estado global con Zustand
    usePlayer.ts           Reproducción con setInterval
    metrics.ts             Comparaciones, intercambios y profundidad
    __tests__/             Test de contrato con Vitest
  algorithms/
    quick-sort/            Implementación completa (referencia)
    merge-sort/            Implementación completa + vista de fusión
    heap-sort/             Implementación completa + árbol del montículo
    _template/             Plantilla para copiar
  components/              UI genérica sin lógica de algoritmos
  pages/                   Home, Visualizer, NotFound
docs/
  GUIA_COMPANEROS.md       Cómo agregar un algoritmo
```

La UI nunca ejecuta el algoritmo: solo consume `steps[currentIndex]`, por lo que retroceder y pausar son instantáneos.

## Agregar un algoritmo

1. Copia `src/algorithms/_template/` y renómbrala.
2. Implementa `steps.ts` con `createCards` y `createStep`.
3. Ajusta `code.ts`, `index.ts` y el `README.md` de tu carpeta.
4. Cambia `status: 'pending'` a `'ready'`.
5. Regístralo en `src/core/registry.ts`.
6. Corre `npm run test`, `npm run typecheck`, `npm run lint` y `npm run build`.

Detalle completo en [`docs/GUIA_COMPANEROS.md`](docs/GUIA_COMPANEROS.md).

## Stack

Vite · React 18 · TypeScript (strict) · Tailwind CSS · Framer Motion · Zustand · React Router · lucide-react · canvas-confetti · Vitest · ESLint · Google Fonts (Orbitron / Share Tech Mono).
