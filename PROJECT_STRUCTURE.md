# Estructura del Proyecto Frontend

Esta estructura está pensada para un frontend React + TypeScript que consume el backend de AgroDirecto. La organización principal es por dominio funcional dentro de `features/`, para que auth, productores, productos, pedidos y transporte puedan crecer sin mezclar responsabilidades.

## Raíz del Proyecto

`package.json` define scripts, dependencias y metadatos del proyecto.

`vite.config.ts` contiene la configuración de Vite.

`tsconfig*.json` contiene la configuración de TypeScript.

`eslint.config.js` contiene las reglas de linting.

`index.html` es el HTML base donde Vite monta la aplicación.

`PROJECT_STRUCTURE.txt` muestra el árbol completo recomendado.

`PROJECT_STRUCTURE.md` explica el propósito de cada directorio.

## `src/`

Contiene todo el código fuente de la aplicación.

`main.tsx` es el punto de entrada de React.

`App.tsx`, `App.css` e `index.css` vienen de la plantilla inicial. Más adelante pueden migrarse hacia `src/app/` y `src/styles/` cuando se reemplace la pantalla por defecto.

## `src/app/`

Contiene la configuración central de la aplicación.

`app/App.tsx` será el componente raíz real cuando se ordene la plantilla inicial.

`app/router.tsx` definirá las rutas con `react-router-dom`.

`app/providers/` agrupa proveedores globales como autenticación, React Query, tema, notificaciones o contexto de usuario.

## `src/assets/`

Guarda archivos estáticos importados desde React.

`assets/images/` se usará para imágenes propias de la interfaz.

`assets/icons/` se usará para íconos locales si no vienen de una librería.

Los archivos actuales `hero.png`, `react.svg` y `vite.svg` pertenecen a la plantilla inicial o recursos existentes.

## `src/components/`

Contiene componentes compartidos que no pertenecen a un dominio específico.

`components/ui/` tendrá componentes base reutilizables: botones, inputs, modales, selects y spinners.

`components/layout/` tendrá estructuras de pantalla: layout autenticado, layout público, navbar y sidebar.

`components/feedback/` tendrá estados visuales comunes: carga, error y contenido vacío.

## `src/config/`

Centraliza configuración de frontend.

`env.ts` leerá variables de entorno como `VITE_API_BASE_URL`.

`routes.ts` declarará rutas internas reutilizables para evitar strings duplicados.

## `src/features/`

Contiene módulos por dominio. Cada feature tiene su propia API, componentes, páginas, schemas y types.

### `features/auth/`

Maneja login, registro, sesión actual, refresh token y logout.

`auth/api/` consumirá endpoints como `/api/auth/login`, `/api/auth/register` y `/api/auth/me`.

`auth/components/` contendrá formularios de login y registro.

`auth/pages/` contendrá pantallas completas de autenticación.

`auth/schemas/` tendrá validaciones de formularios.

`auth/types/` tendrá tipos TypeScript de requests, responses y usuario autenticado.

### `features/producer/`

Maneja el perfil del productor y su ubicación GPS.

`producer/api/producerApi.ts` consumirá endpoints como `GET /api/producers/me/profile` y `PATCH /api/producers/me/location`.

`producer/components/ProducerLocationMap.tsx` será el mapa interactivo para marcar la finca, inicialmente centrado en Santa Cruz.

`producer/components/ProducerProfileForm.tsx` manejará edición de datos del perfil cuando el backend lo permita.

`producer/pages/ProducerProfilePage.tsx` será la pantalla del perfil del productor.

### `features/products/`

Maneja publicación y visualización de productos.

`products/api/productsApi.ts` consumirá endpoints como `POST /api/products`.

`products/components/ProductForm.tsx` será el formulario de publicación.

`products/components/ProductCard.tsx` y `ProductList.tsx` servirán para listados y catálogos.

`products/pages/ProductCreatePage.tsx` será la pantalla para crear publicaciones.

Si el backend responde `403` porque falta geolocalización, esta feature debe redirigir al perfil del productor.

### `features/buyer/`

Reservado para funcionalidades del comprador: perfil, filtros de productos, cercanía, carrito o preferencias.

### `features/orders/`

Reservado para pedidos, confirmaciones, estados de compra y detalle de órdenes.

### `features/shipments/`

Reservado para transporte, postulaciones, asignaciones, recolección y entregas.

## `src/hooks/`

Contiene hooks reutilizables entre features.

`useAuth.ts` expondrá usuario actual, roles y helpers de sesión.

`useDebounce.ts` servirá para búsquedas, filtros y entradas con retraso controlado.

## `src/lib/`

Contiene utilidades técnicas de integración.

`lib/api/httpClient.ts` configurará el cliente HTTP, base URL, token JWT y manejo común de errores.

`lib/api/apiError.ts` normalizará errores del backend.

`lib/storage/tokenStorage.ts` encapsulará lectura y escritura de tokens.

`lib/maps/mapDefaults.ts` guardará valores de mapa como coordenadas iniciales de Santa Cruz, zoom por defecto y límites si se requieren.

## `src/pages/`

Contiene páginas globales que no pertenecen a una feature concreta.

`HomePage.tsx` será la pantalla inicial.

`NotFoundPage.tsx` será la pantalla 404.

`UnauthorizedPage.tsx` será la pantalla para accesos no permitidos.

## `src/styles/`

Contiene estilos globales.

`globals.css` tendrá reglas base de la aplicación.

`variables.css` tendrá tokens visuales como colores, espaciado y tamaños.

## `src/types/`

Contiene tipos compartidos por todo el frontend.

`api.ts` tendrá tipos genéricos de respuestas, errores y paginación.

`common.ts` tendrá tipos utilitarios comunes.

## `src/utils/`

Contiene funciones puras y helpers sin dependencia de React.

`formatters.ts` servirá para formatear precios, fechas, unidades y textos.

`validators.ts` tendrá validaciones compartidas que no dependan de formularios específicos.

## `public/`

Contiene archivos públicos servidos directamente por Vite, como favicon, manifest o recursos que no se importan desde componentes.

## `node_modules/`

Directorio generado por npm. No debe editarse manualmente ni versionarse.
