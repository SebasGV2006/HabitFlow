# HabitFlow

HabitFlow es una aplicación personal de seguimiento de hábitos para crear rutinas, registrar cumplimientos diarios, mantener rachas semanales y consultar estadísticas. Funciona completamente de forma local e incluye recordatorios mediante notificaciones locales.

## Funcionalidades principales

- Crear, editar y eliminar hábitos.
- Definir nombre, descripción, icono, color y meta semanal de 1 a 7 días.
- Marcar y desmarcar el cumplimiento del día actual directamente desde la lista.
- Consultar el progreso semanal y la racha actual de cada hábito.
- Consultar el historial de cumplimiento de los últimos 7 días.
- Ver un resumen estadístico de hábitos, rachas y cumplimientos recientes.
- Visualizar un mapa de calor de los últimos 84 días.
- Visualizar barras de progreso de las últimas 8 semanas.
- Programar recordatorios locales diarios por hábito.
- Elegir el tema claro, oscuro o del sistema.
- Persistir hábitos, cumplimientos y preferencias localmente.
- Feedback háptico al marcar un hábito como completado.

## Stack tecnológico

Las versiones de esta lista corresponden al `package.json` del proyecto:

- Expo: `54.0.37` (SDK 54)
- React: `19.1.0`
- React Native: `0.81.5`
- TypeScript: `~5.9.2`
- React Navigation Native: `^7.3.16`
- React Navigation Bottom Tabs: `^7.18.16`
- React Navigation Native Stack: `^7.18.8`
- React Navigation Elements: `^2.9.38`
- Zustand: `^5.0.15`
- AsyncStorage: `2.2.0`
- Expo Notifications: `~0.32.17`
- Expo Haptics: `~15.0.8`
- Expo Status Bar: `~3.0.9`
- Expo Vector Icons: `^15.0.3`
- React Native Safe Area Context: `~5.6.0`
- React Native Screens: `~4.16.0`

El proyecto usa npm como gestor de paquetes.

## Requisitos previos

- Node.js instalado en el equipo.
- npm disponible desde la terminal.
- Un teléfono iOS o Android con Expo Go instalado.
- El teléfono y el equipo conectados a la misma red local cuando se use la conexión LAN de Expo.

Expo SDK 54 está fijado intencionadamente para mantener compatibilidad con la versión de Expo Go utilizada por el proyecto.

## Instalación y ejecución local

1. Clona el repositorio o descomprime el proyecto.
2. Entra en la carpeta del proyecto:

   ```bash
   cd HabitFlow
   ```

3. Instala las dependencias con npm:

   ```bash
   npm install
   ```

4. Inicia el servidor de desarrollo de Expo:

   ```bash
   npx expo start
   ```

5. Escanea el código QR mostrado en la terminal o en la interfaz de Expo con Expo Go. En Android también puedes pulsar `a` desde la terminal de Expo; en iOS, pulsa `i` si tienes un entorno iOS disponible.

También puedes usar los scripts definidos en el proyecto:

```bash
npm run start
npm run android
npm run ios
```

Para limpiar la caché de Metro durante el desarrollo:

```bash
npx expo start --clear
```

## Estructura del proyecto

```text
src/
  components/   Componentes reutilizables de interfaz, como Screen, Button, Card y TextInput.
  screens/      Pantallas de hábitos, detalle, estadísticas y ajustes.
  navigation/   Configuración del navegador raíz, tabs inferiores y stack de hábitos.
  store/        Stores de Zustand para tema, hábitos y registros de cumplimiento.
  theme/        Tokens de colores, tipografía, espaciado y resolución de temas.
  hooks/        Hooks personalizados compartidos.
  types/        Interfaces y tipos compartidos del dominio.
  utils/        Funciones puras de fechas, progreso, rachas y notificaciones.
```

`App.tsx` conecta el tema resuelto, la rehidratación de datos, `NavigationContainer` y el navegador raíz.

## Decisiones de arquitectura

### Expo SDK 54 fijo

El proyecto fija Expo SDK 54 para mantener compatibilidad con Expo Go y evitar incompatibilidades entre la versión del cliente móvil y la versión del proyecto. Las dependencias relacionadas se alinean con el SDK mediante el instalador de Expo.

### Notificaciones locales en lugar de push remotas

Los recordatorios se programan en el dispositivo con `expo-notifications`. No se usan tokens push, backend ni servicios remotos, porque la aplicación es local y no necesita infraestructura de servidor.

### Sin librería externa de gráficos

El mapa de calor y las barras semanales se construyen con componentes `View`, estilos dinámicos y flexbox. Esto reduce dependencias nativas y mantiene las visualizaciones sencillas para el alcance de la aplicación.

### Estado y persistencia local

Zustand gestiona el estado de hábitos y registros. Zustand Persist, usando AsyncStorage, conserva los datos entre sesiones y permite versionar futuras migraciones del modelo.

### Navegación directa con React Navigation

La aplicación usa un Bottom Tab Navigator con un Native Stack anidado para mostrar de forma explícita cómo se organizan las pantallas, sin añadir la capa de abstracción de Expo Router.

## Limitaciones conocidas

- La aplicación es 100% local y no sincroniza datos entre dispositivos.
- Los hábitos y registros se almacenan únicamente en el dispositivo.
- Las notificaciones locales pueden retrasarse o no entregarse si el sistema operativo restringe la actividad en segundo plano, el ahorro de batería o los permisos de notificaciones.
- Las notificaciones dependen de que el usuario conceda permisos y de la configuración del sistema operativo.
- No hay autenticación, cuentas de usuario ni recuperación de datos en la nube.
- Las estadísticas se calculan con los datos disponibles en el dispositivo actual.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para ver el texto completo de la licencia y su aviso de copyright.
