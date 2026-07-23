# Versión estática (para GitHub Pages)

Esta carpeta es una **copia especial** del proyecto, convertida a
HTML/CSS/JS puro (sin PHP), para poder publicarla en GitHub Pages
(que no puede ejecutar PHP).

## Tu proyecto "real" sigue siendo el de PHP

El proyecto que trabajas día a día en VS Code/XAMPP
(`banco-recursos-presentaciones/`, con `index.php`) sigue siendo tu
proyecto principal — ahí es donde debes seguir haciendo cambios.
Esta carpeta es solo un "espejo" para mostrarlo en línea hoy mismo.

## Antes de subir esto a GitHub, copia tus imágenes y videos

Esta carpeta trae las carpetas `img/logos/`, `img/ui/` y `video/`
vacías (solo con un archivo LEEME.txt). Copia ahí los mismos
archivos que ya tienes en tu proyecto de PHP:

```
publicar-github/
├── img/logos/canva.png, geogebra.png, etc.
└── video/canva.mp4, geogebra.mp4, etc.
```

Si un logo o video no existe todavía, no pasa nada: la página
muestra automáticamente el círculo de color o el aviso
"Video próximamente" (esto ahora lo resuelve JavaScript en el
navegador, con el evento "onerror", ya que GitHub Pages no tiene
PHP para revisar los archivos como hacíamos antes).

## Cómo publicarlo en GitHub Pages

1. Sube TODO el contenido de esta carpeta (`index.html`, `css/`,
   `js/`, `img/`, `video/`) a la RAÍZ de tu repositorio de GitHub
   (no dentro de una subcarpeta).
2. Ve a tu repositorio → **Settings** → **Pages** (en el menú
   izquierdo).
3. En "Source", confirma que esté seleccionada la rama `main` y
   la carpeta `/ (root)`.
4. Espera 1-2 minutos y entra a:
   ```
   https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/
   ```

## Si vuelves a cambiar algo en el proyecto PHP

Si le cambias algo al carrusel, al CSS o a los datos de los
recursos en tu proyecto PHP, avísame y vuelvo a generar esta
versión estática actualizada (usando el script
`generar_static.py`), para que ambas versiones queden iguales.
