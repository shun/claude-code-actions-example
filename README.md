# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for unit testing with Vue Test Utils.

```bash
npm run test   # Run unit tests
```

### Test Structure

- Test files are located in `tests/unit/`
- Test files should follow the naming convention `*.spec.ts` or `*.test.ts`
- The testing environment is configured with jsdom for DOM simulation
