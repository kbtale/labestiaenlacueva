<div align="center">

# La Bestia en la Cueva


https://github.com/user-attachments/assets/ef294b9c-df82-4e36-b709-9b13252ea4f0


**Sitio web y archivo de contenidos de La Bestia en la Cueva.**

[Accede al sitio web aquí](https://www.labestiaenlacueva.com)

Creado con [Svelte 5](https://svelte.dev/) y [Three.js](https://threejs.org/).

![Svelte](https://img.shields.io/badge/Svelte_5-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>

## Detalles relevantes

### 1. Motor WebGL de mosaico instanciado
El retrato del personaje y la galería infinita se procesan en un único renderizador WebGL 2:
*   **InstancedMesh y Shaders GLSL**: Renderizado de cientos de miniaturas de vídeo en una sola llamada de dibujo (`draw call`), manipulando coordenadas, escalas y tinte cromático mediante atributos por instancia.
*   **Decodificación en segundo plano**: Un Web Worker con `OffscreenCanvas` corta y decodifica las texturas del atlas en hilos secundarios para evitar bloqueos en el hilo principal.
*   **Reciclaje dinámico de épocas**: Conforme la cámara avanza en el eje Z, los mosaicos fuera de visión se reciclan y reubican algorítmicamente en la profundidad del túnel.

### 2. Entorno cavernoso procedural y partículas en suspensión
El fondo genera un entorno atmosférico mediante código shader:
*   **Túnel geológico**: Cilindro invertido que rodea la escena con un shader de ruido fractal (FBM) que simula estratos de roca oscura y pizarra, atenuándose en el centro de visión.
*   **Motes de polvo en 3D**: 160 partículas suspendidas con oscilación browniana y deriva sinusoidal que se reubican automáticamente por delante de la cámara.
*   **Viñeta periférica**: Degradado radial que enmarca el umbral visual de la cueva.

### 3. Física de navegación y cinemática de cámara
El desplazamiento a través del archivo responde a controles táctiles y de rueda:
*   **Amortiguación exponencial**: Suavizado inercial de velocidad y desaceleración progresiva que proporciona una sensación de arrastre físico.
*   **Deriva por paralaje**: Desplazamiento reactivo de la posición y punto de mira de la cámara en función de la posición del ratón.
*   **Desplazamiento lateral en modales**: Al abrir un panel lateral o modal, la cámara compensa su encuadre hacia el lateral opuesto para mantener el equilibrio visual.

### 4. Detección bilingüe automática y persistencia
La interfaz se adapta automáticamente a la procedencia del visitante:
*   **Detección en tiempo real**: Inspección de `navigator.language` para servir contenido en español si el navegador está configurado en español, o en inglés para el resto de regiones.
*   **Persistencia y conmutación**: Selector de idioma en cabecera con almacenamiento local en `localStorage` y reactividad global mediante Runes de Svelte 5.

### 5. Integración de mensajería (Web3Forms)
El modal de contacto prescinde de backend propio:
*   **Envío asíncrono**: Peticiones directas a la API de Web3Forms con gestión de estados (enviando, éxito, error).
*   **Fallback transparente**: En ausencia de claves o fallos de conexión, conmuta al protocolo `mailto:` conservando los datos introducidos por el usuario.

## Licencia

GNU General Public License v3.0 (GPL-3.0). Consulta el archivo `LICENSE` para más información.
