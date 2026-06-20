# HabitFlow

HabitFlow es una aplicación móvil minimalista para gestionar hábitos y productividad.

[![Expo](https://img.shields.io/badge/Expo-^48.0.0-4caf50)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-6f42c1)](https://turborepo.org)

Tabla de contenidos
-------------------

- [Descripción](#descripci%C3%B3n)
- [Arquitectura](#arquitectura)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalaci%C3%B3n)
- [Comandos](#comandos)
- [Correr en dispositivo físico](#correr-en-dispositivo-f%C3%ADsico)
- [Stack tecnológico](#stack-tecnol%C3%B3gico)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Licencia](#licencia)

Descripción
-----------

HabitFlow es una aplicación móvil construida con Expo, TypeScript y organizada como un monorepo con Turborepo. Está diseñada para ayudar a los usuarios a construir y mantener hábitos diariamente con una interfaz moderna y modo oscuro por defecto.

Arquitectura
------------

El proyecto usa un monorepo con la siguiente estructura inicial:

```
habitflow/
├── apps/
│   └── mobile/          ← Expo app (React Native + TypeScript)
├── packages/            ← Vacío por ahora, reservado para futuro
├── turbo.json
├── package.json         ← raíz del monorepo (workspaces)
└── README.md
```

Requisitos previos
-------------------

- Node.js 18+ (recomendado)
- npm 9+ (workspaces)
- Expo Go instalado en el dispositivo móvil

Instalación
-----------

Desde la raíz del proyecto:

```bash
npm install
```

Comandos
--------

- `npm run dev` — Ejecuta `turbo run start --parallel` para iniciar apps.
- `npm run build` — Ejecuta `turbo run build`.
- `npm run lint` — Ejecuta `turbo run lint`.
- `npm run type-check` — Ejecuta `turbo run type-check`.

Correr en dispositivo físico
---------------------------

1. Conecta tu dispositivo con Expo Go instalado.
2. Desde la raíz ejecuta `npm run dev` y luego en la carpeta `apps/mobile` ejecuta `npm start` si es necesario.
3. Escanea el QR con Expo Go para abrir la app en tu dispositivo.

Stack tecnológico
-----------------

- **Expo** — Plataforma para construir apps React Native rápidamente.
- **React Native** — UI nativa multiplataforma.
- **TypeScript (estricto)** — Tipado estático y seguridad en tiempo de compilación.
- **Turborepo** — Orquestación y cache para monorepos.

Estructura de carpetas
----------------------

La estructura inicial está listada arriba y se irá completando en bloques posteriores.

Licencia
--------

Este proyecto se publica bajo la licencia MIT.

