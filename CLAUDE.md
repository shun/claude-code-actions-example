# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compilation + Vite build)
- `npm run preview` - Preview production build locally

## Architecture

This is a Vue 3 + TypeScript + Vite application using the modern `<script setup>` SFC syntax.

**Key Structure:**
- `src/main.ts` - Application entry point that mounts the Vue app
- `src/App.vue` - Root component using `<script setup lang="ts">`
- `src/components/` - Vue components directory
- TypeScript configuration uses project references with separate app and node configs

**Build System:**
- Vite for fast development and optimized builds
- vue-tsc for TypeScript compilation in build process
- ES modules throughout (type: "module" in package.json)