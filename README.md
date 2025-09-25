# Cisne Blanco — Web (GitHub Ready)
Prueba de ruleset y PR.

Este repositorio contiene la base para versionar y publicar el sitio **Cisne Blanco**.

## Estructura sugerida
```
/ (raíz del repo)
├─ index.html              # Página de inicio (o portal de navegación)
├─ /pages                  # Subpáginas: calendario, hábitos, salud, familia, social, finanzas
├─ /assets                 # Imágenes, fuentes, íconos
├─ /js                     # Scripts
├─ /css                    # Estilos
└─ .github/workflows/pages.yml  # Deploy automático a GitHub Pages
```

> Podés empezar importando tu carpeta actual `cisne_blanco_maqueta_base` aquí dentro (respetando esta estructura).

## Flujo de trabajo simple (recomendado)
1. **Main** guarda la versión estable que funciona.
2. Creamos **ramas por feature** (ej.: `feature/calendario-gcal-button`) y ahí trabajamos.
3. Al terminar, hacemos **Pull Request** a `main` y lo fusionamos.
4. Taggeamos un **release**: `v2.4.0`, `v2.4.1`, etc.

## Convención de commits
```
[calendario] Añadir botón “Añadir a Google Calendar”
[finanzas] Arreglo: persistencia en localStorage al editar
[ui] Tipografías unificadas en todas las pestañas
```

## Publicación (GitHub Pages)
Este repo trae un workflow (`.github/workflows/pages.yml`) que **publica automáticamente** el sitio cuando haces `push` a `main`.
1. En GitHub: **Settings → Pages → Build and deployment**: Source = *GitHub Actions*.
2. Hacé un commit en `main` y el sitio quedará en línea en `<usuario>.github.io/<repo>`.

## Requisitos opcionales
- **GitHub Desktop** (recomendado si no querés usar línea de comandos).
- **Git** (se instala junto con GitHub Desktop).

## Notas
- Evitá trabajar dentro de **OneDrive** para este repo (puede generar conflictos al sincronizar `.git`). Si necesitás usar OneDrive, asegurate de que la carpeta esté **disponible offline**.
- Los archivos grandes (imágenes/videos) usan **Git LFS** con patrones ya configurados en `.gitattributes`.
