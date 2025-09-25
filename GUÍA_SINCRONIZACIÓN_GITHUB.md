# Guía paso a paso — Sincronizar tu web con GitHub (sin jerga)

> Objetivo: Tener tu carpeta de la web **versionada** en GitHub y con **publicación automática** a GitHub Pages.

## 0) Preparación (una sola vez)
- Creá/ingresá a tu cuenta en GitHub.
- Instalá **GitHub Desktop** (incluye Git).

## 1) Crear el repositorio
1. Abrí *GitHub Desktop* → `File` → `New repository…`.
2. **Name**: `cisne-blanco-web` (o el que prefieras).
3. **Local path**: elegí una carpeta **fuera** de OneDrive. Ej.: `C:\CisneBlanco\web`.
4. Tildá *Initialize with a README* y creá el repo.

## 2) Copiar tu web al repo
1. Abrí la carpeta del repo (`Open in Explorer`).
2. Copiá adentro **tu base** (`cisne_blanco_maqueta_base`) y reordená así:
```
/ (raíz del repo)
├─ index.html
├─ /pages
├─ /assets
├─ /css
└─ /js
```
3. Volvé a *GitHub Desktop*: vas a ver cambios detectados → `Commit to main` con el mensaje: `importar base v2.4`.

## 3) Publicar en GitHub
- En *GitHub Desktop*: `Publish repository…` (Privado o Público, como prefieras).

## 4) Habilitar deploy automático (GitHub Pages)
1. En GitHub (web): **Settings → Pages → Build and deployment**.
2. `Source: GitHub Actions`. Guardá.
3. Cada vez que hagas `Commit` y `Push` a **main**, se publicará tu sitio.

> El workflow ya está en `.github/workflows/pages.yml`. No tenés que tocar nada.

## 5) Trabajar con ramas (seguro y ordenado)
1. En *GitHub Desktop*: `Current branch → New Branch…`.
2. Nombre: `feature/calendario-gcal-button`.
3. Hacé tus cambios → `Commit`.
4. `Push origin` → `Create Pull Request`.
5. Revisá en GitHub y **Merge** a `main`.
6. Se disparará el deploy y tu sitio quedará actualizado.

## 6) Versiones (tags y releases)
- En GitHub (web) → `Releases` → `Draft a new release`.
- Tag: `v2.4.1` (sigue la correlatividad que venís usando).
- Título y notas de cambios (qué tocaste).

## 7) Glosario rápido
- **Repositorio**: “la carpeta” de tu proyecto en GitHub.
- **Commit**: un “guardar con comentario”.
- **Branch (rama)**: una copia para trabajar sin romper `main`.
- **Push**: subir tus commits a GitHub.
- **Pull Request**: pedir fusionar tu rama en `main`.
- **Release/Tag**: marcar una versión estable (ej.: `v2.4.1`).

## 8) Consejos
- Mensajes de commit **claros y cortos**.
- Una funcionalidad = una rama.
- Probá localmente antes de fusionar a `main`.
- Evitá subir **.zip** o archivos enormes (ya agregamos reglas para ignorarlos).

## 9) Problemas comunes
- **No ves cambios en Pages**: verificá que la acción haya corrido (pestaña *Actions*). Hacé un commit nuevo en `main`.
- **Conflicto con OneDrive**: mové el repo fuera de OneDrive o asegurá *Disponibilidad offline*.
- **Imágenes muy pesadas**: se suben con **LFS** automáticamente por patrón.
