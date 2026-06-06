# Blog Frontend

Aplicación web para un blog sencillo que consume la API REST del backend. Permite a los usuarios registrarse, iniciar sesión, ver su perfil, cambiar su contraseña y publicar comentarios en el feed.

## Tecnologías

- **React 18** con **TypeScript**
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **React Router DOM** para navegación
- **Axios** para llamadas a la API

## Requisitos previos

- Node.js 20+
- npm 9+
- El backend corriendo en `http://localhost:3000`

## Construcción (Instalación)

```bash
npm install
```

## Variables de entorno

```bash
cp .env.example .env
```

| Variable       | Descripción              | Ejemplo                    |
|----------------|--------------------------|----------------------------|
| `VITE_API_URL` | URL base del backend     | `http://localhost:3000`    |

## Ejecución (Desarrollo)

```bash
npm run dev
```

La app estará en `http://localhost:5173`.

## Compilación (Producción)

```bash
npm run build
npm run preview
```

## Pantallas disponibles

| Ruta               | Descripción                     | Acceso      |
|--------------------|---------------------------------|-------------|
| `/login`           | Inicio de sesión                | Público     |
| `/register`        | Registro de usuario             | Público     |
| `/feed`            | Feed de comentarios             | Privado     |
| `/me`              | Perfil del usuario              | Privado     |
| `/change-password` | Cambio de contraseña            | Privado     |

Las rutas privadas redirigen a `/login` si no hay sesión. Las rutas públicas redirigen a `/feed` si ya hay sesión activa.

## Arquitectura

```
src/
  api/          Funciones para llamadas a la API (auth, feed)
  auth/         Contexto de autenticación y gestión del token JWT
  components/   Componentes reutilizables (Navbar, Layout, Alert, CommentCard)
  pages/        Pantallas de la aplicación
  routes/       Guards de rutas (PrivateRoute, PublicRoute)
  types/        Tipos e interfaces TypeScript
```

El token JWT se almacena en `localStorage` y se inyecta en todas las peticiones mediante un interceptor de Axios. Si el backend responde con 401, la sesión se limpia y redirige al login.

## Git Flow sugerido

```
main              Código en producción
develop           Rama de integración
feature/auth      Pantallas de login y registro
feature/feed      Pantalla del feed
feature/frontend  Configuración inicial y estilos
```

Ver el historial en forma de grafo:

```bash
git log --oneline --graph --all
```

## Uso de inteligencia artificial

Durante el desarrollo se utilizó inteligencia artificial como apoyo para estructurar el proyecto, revisar buenas prácticas de seguridad, generar casos de prueba base y mejorar la documentación técnica. El código fue revisado, adaptado, probado y ajustado manualmente antes de su entrega.

---

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
