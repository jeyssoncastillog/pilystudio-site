Paquete optimizado de Nieves & Jesús

Contenido:
- nieves-y-jesus-web-ready.svg: SVG optimizado sin imágenes base64 incrustadas.
- assets/: imágenes extraídas, convertidas a WebP y reducidas para web.
- optimization-report.json: resumen técnico de la optimización.

Cómo usarlo:
1. Sube la carpeta completa a tu proyecto, manteniendo esta estructura:
   /inv/nieves-y-jesus/nieves-y-jesus-web-ready.svg
   /inv/nieves-y-jesus/assets/*.webp

2. Si lo insertas en HTML, usa algo como:
   <img src="./nieves-y-jesus-web-ready.svg" alt="Invitación Nieves y Jesús" loading="eager" decoding="async">

Importante:
- El SVG depende de la carpeta assets. Si mueves el SVG sin la carpeta assets, no se verán las imágenes.
- Esto es una optimización técnica del SVG exportado de Canva, pero la mejor práctica para la web final es reconstruir la invitación en HTML/CSS y usar imágenes WebP por secciones.
