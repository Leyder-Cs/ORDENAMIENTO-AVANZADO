# Merge Sort

Algoritmo **completo** y listo para usar. Implementa el esquema clásico de divide y vencerás:

1. Dividir el arreglo en dos mitades.
2. Ordenar recursivamente cada mitad.
3. Fusionar ambas mitades en orden ascendente.

## Esquema

```text
mergeSort(lo, hi)
  si lo >= hi: terminar
  mid = (lo + hi) / 2
  mergeSort(lo, mid)
  mergeSort(mid + 1, hi)
  merge(lo, mid, hi)
```

La fusión es **estable**: ante valores iguales se toma primero el de la mitad izquierda.

## Visualización

- Durante las comparaciones, el arreglo principal se mantiene estable.
- `extra` guarda las mitades, el buffer de salida y los punteros.
- `extra.tsx` dibuja la vista de fusión: izquierda, derecha y salida.
- Al cerrar cada fusión, las cartas se reubican con swaps reales para conservar `id` y color.
- `sortedIndices` recién se completa en el paso `done`; así no se muestran candados verdes prematuros.

## Marcadores

- `merge-left` (`L`): próximo elemento de la mitad izquierda.
- `merge-right` (`R`): próximo elemento de la mitad derecha.
- `compare` (`TOMA`): elemento elegido para la salida.

## Tipos de paso

`init`, `recurse`, `split`, `base`, `merge-start`, `merge-compare`, `merge-drain`, `merge-write`, `merge-complete`, `done`.

## Métricas

- `comparisons`: comparaciones entre las dos mitades.
- `swaps`: reubicaciones reales al escribir la fusión en el arreglo.
- La UI muestra esta métrica como **Movimientos** gracias a `swapsLabel`.

## Archivos

- `steps.ts`: generador puro de pasos.
- `extra.tsx`: panel de mitades y buffer.
- `code.ts`: código Java de referencia.
- `index.ts`: definición registrada en `src/core/registry.ts`.

## Opciones

Ninguna. Merge Sort siempre usa el mismo esquema recursivo.
