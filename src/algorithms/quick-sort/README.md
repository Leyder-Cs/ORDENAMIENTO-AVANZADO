# Quick Sort

Algoritmo **completo** y listo para usar. Pivote = primer elemento del subarreglo (o aleatorio, configurable desde el panel de control).

## Esquema

1. Si `lo >= hi`, el subarreglo ya está ordenado.
2. `pivote = arr[lo]`, `i = lo + 1`, `j = hi`.
3. `i` avanza mientras `arr[i] <= pivote`; `j` retrocede mientras `arr[j] > pivote`.
4. Si `i < j`, se intercambian y se repite.
5. El pivote se intercambia con `arr[j]` y queda en su posición final.
6. Se ordenan recursivamente `[lo, j - 1]` y `[j + 1, hi]`.

## Archivos

- `steps.ts`: generador puro de pasos. Usa `createStep` y `createCards` de `src/core`.
- `code.ts`: líneas Java que muestra el panel de código.
- `index.ts`: definición del algoritmo registrada en `src/core/registry.ts`.

## Contrato

- `markers`: `pivot` en el pivote, `left` en `i`, `right` en `j`.
- `swappedIndices`: se usa para el arco y el glitch de las cartas.
- `sortedIndices`: posiciones definitivas (pivotes y casos base).
- `options.pivotMode`: `'first'` o `'random'`.

No modificar este directorio para otros algoritmos: cada uno vive en su propia carpeta.
