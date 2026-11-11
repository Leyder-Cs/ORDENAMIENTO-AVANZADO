# Heap Sort — max-heap in-place

Heap Sort trata el arreglo como un árbol binario completo: el hijo izquierdo de `i` está en `2i + 1` y el derecho en `2i + 2`.

## Fases

1. **Construir max-heap**: se aplica `siftDown` desde el último nodo interno (`n / 2 - 1`) hasta la raíz.
2. **Extraer el máximo**: se intercambia la raíz con el último elemento del heap y se reduce el tamaño activo.
3. **Restaurar el heap**: `siftDown` baja la nueva raíz hasta que el subárbol vuelva a cumplir la propiedad de max-heap.

## Visualización

- `range` marca el heap activo: `[0, heapSize - 1]`.
- `sortedIndices` bloquea cada máximo cuando queda en su posición final.
- Marcadores `heap-root` y `heap-child` señalan la raíz y los hijos comparados.
- `compare` resalta al mayor candidato.
- `swappedIndices` anima los intercambios entre la raíz, sus hijos y el final del heap.
- El panel auxiliar dibuja el árbol por niveles, con conectores padre→hijo, tamaño del heap y zona ordenada.

Todos los movimientos son intercambios reales sobre las cartas, así que los `id` y colores permanecen estables.

## Tipos de paso

`init`, `build-start`, `sift-start`, `heap-compare`, `heap-swap`, `heap-stop`, `heap-built`, `extract-start`, `extract-swap`, `extract-place`, `done`.

## Archivos

- `steps.ts`: generador puro de pasos y datos del panel auxiliar.
- `extra.tsx`: árbol del max-heap por niveles.
- `code.ts`: código Java de `heapSort`, `siftDown` y `swap`.
- `index.ts`: definición registrada en `src/core/registry.ts`.

## Código

- `heapSort`: construye el max-heap y extrae el máximo repetidamente.
- `siftDown`: compara la raíz con sus hijos y baja el nodo desubicado hasta restaurar el heap.
- `swap`: intercambia dos posiciones del arreglo.

## Métricas

- **Comparaciones**: una por cada hijo evaluado.
- **Intercambios**: cada swap de `siftDown` y cada extracción raíz↔final.
- **Complejidad temporal**: O(n log n) en mejor, promedio y peor caso.
- **Espacio auxiliar**: O(1).

Con `[4, 10, 3, 5, 1, 8, 2, 7]` el ejemplo base produce 84 pasos, 27 comparaciones y 19 intercambios.

## Verificación

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
