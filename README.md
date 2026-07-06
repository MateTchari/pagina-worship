# 360 worship

Web interna para organizar eventos, secciones/plenarias y canciones de un grupo de adoracion. La biblioteca es propia: las letras y acordes se cargan manualmente en formato ChordPro. No hay scraping, importacion automatica ni copia de contenido de sitios externos.

## Stack

- Next.js + React + TypeScript
- Tailwind CSS
- Supabase Auth + Database + RLS
- Deploy preparado para Vercel

## Estado inicial

El proyecto queda limpio: no trae eventos creados, no trae canciones cargadas y no incluye seeds de ejemplo. Al abrirlo sin datos vas a ver estados vacios hasta que configures Supabase y cargues tu propia informacion.

## Funcionalidades incluidas

- Login y registro con Supabase Auth.
- Dashboard con proximos eventos, biblioteca y acceso rapido cuando existan datos.
- Crear evento con tipos `VDM`, `CAMPA` y `OTRO`.
- Secciones automaticas: VDM crea `Alabanzas` y `Adoraciones`; CAMPA crea plenarias.
- Biblioteca con busqueda y filtros por categoria/tags.
- Vista de evento con secciones, canciones, tonos y notas.
- Modo tocar responsive con fondo oscuro, letra grande, pantalla completa, cambio de tamano, ocultar acordes, anterior/siguiente y scroll automatico.
- Parser ChordPro y transposicion de acordes entre corchetes.
- Vista publica para eventos compartidos.
- SQL completo para tablas, indices, triggers y politicas RLS.

## Correr localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir `http://localhost:3000`.

Sin variables de Supabase, la app abre pero no muestra datos ni puede autenticar usuarios. Eso es intencional: tenes que conectar tu propio proyecto Supabase.

## Lo que falta que hagas vos

1. Crear un proyecto en Supabase.
2. Ejecutar `supabase/schema.sql` en el SQL Editor de Supabase.
3. Copiar `Project URL` y `anon public key`.
4. Crear `.env.local` con esas variables.
5. Habilitar email/password en Supabase Authentication.
6. Registrar tu primer usuario desde `/login`.
7. En Supabase, cambiar el rol de ese usuario a `admin` en `users_profiles`.
8. Cargar manualmente tus canciones y eventos desde la app.
9. Subir el proyecto a GitHub.
10. Importarlo en Vercel y agregar las mismas variables de entorno.

Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ttjekoazlizfeophadkd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0amVrb2F6bGl6ZmVvcGhhZGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODE4MTMsImV4cCI6MjA5MjM1NzgxM30.Iv8mV_WUIHgmCYWylcrAEzk61YjNbZXVOtQ4hLLutI0
```

## Roles

Los roles viven en `users_profiles.role`:

- `admin`: crea, edita y elimina eventos/canciones/secciones.
- `musico`: lee eventos y canciones, y actualiza su propio `practice_status`.
- `invitado`: solo lee eventos publicos mediante link compartido.

Para convertir un usuario en admin, actualiza su fila en `users_profiles`.

## Deploy en Vercel

1. Sube el proyecto a GitHub.
2. Importa el repo en Vercel.
3. Agrega `NEXT_PUBLIC_SUPABASE_URL`.
4. Agrega `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Ejecuta deploy.

## Archivos importantes

- `supabase/schema.sql`: tablas, indices, triggers y RLS.
- `src/lib/chordpro.ts`: parser y transposicion.
- `src/lib/data-actions.ts`: funciones `createEvent`, `createSong`, `addSongToEvent`, reorder, compartir, etc.
- `src/lib/queries.ts`: lecturas reales desde Supabase.
- `src/components/FullscreenPerformanceMode.tsx`: modo tocar.
- `src/components/ChordProViewer.tsx`: render ChordPro.

## Restricciones legales

Esta app no scrapea, no descarga, no copia ni importa canciones automaticamente desde CifraClub ni desde ninguna web. `cifraclub_url`, `youtube_url` y `spotify_url` son campos opcionales de referencia.
