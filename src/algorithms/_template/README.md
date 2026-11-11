# Plantilla de algoritmo

Copia esta carpeta completa y renómbrala, por ejemplo `shell-sort`.

## Checklist

1. Renombra el `id` en `index.ts` (kebab-case, único).
2. Ajusta `name`, `accent`, `description` y `complexity`.
3. Usa un `defaultArray` representativo.
4. Implementa `steps.ts` con `createCards` y `createStep`.
5. Declara `options` y `stepTypeLabels` si tu algoritmo los necesita.
6. Cambia `status: 'pending'` a `'ready'`.
7. Importa la definición y agrégala a `ALGORITHMS` en `src/core/registry.ts`.
8. Ejecuta `npm run test` para validar el contrato.
9. Ejecuta `npm run typecheck`, `npm run lint` y `npm run build`.
10. Actualiza tu README con el esquema del algoritmo.

## Contrato mínimo

- Primer paso `type: 'init'`.
- Último paso `type: 'done'` con el arreglo ordenado.
- Cada `Step` tiene `array`, `markers`, `range`, `sortedIndices`, `callStack`, `codeLine`, `message`, `comparisons`, `swaps`.
- `comparisons` y `swaps` son acumulados y nunca disminuyen.
- No compartas referencias de arreglos entre pasos.
- Los `id` de las cartas y sus colores no cambian.
