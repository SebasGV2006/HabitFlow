# HabitFlow

HabitFlow is a personal habit-tracking app for creating routines, recording daily completions, maintaining weekly streaks, and viewing statistics. It works entirely locally and includes reminders via local notifications.

## Main Features

- Create, edit, and delete habits.

- Define name, description, icon, color, and weekly goal (1 to 7 days).

- Mark and unmark the current day's completion directly from the list.

- View weekly progress and current streak for each habit.

- View the completion history for the last 7 days.

- See a statistical summary of habits, streaks, and recent completions.

- View a heat map of the last 84 days.

- View progress bars for the last 8 weeks.

- Schedule daily local reminders for each habit.

- Choose light, dark, or system theme.

- Persist habits, completions, and preferences locally.

- Haptic feedback when marking a habit as completed.


## Technology stack

The versions in this list correspond to the project's `package.json`:

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

The project uses npm as its package manager.

## Prerequisites

- Node.js installed on your computer.

- npm accessible from the terminal.

- An iOS or Android phone with Expo Go installed.

- Your phone and computer connected to the same local network when using Expo's LAN connection.

Expo SDK 54 is intentionally locked to maintain compatibility with the version of Expo Go used by the project.

## Local Installation and Execution

1. Clone the repository or extract the project.

2. Navigate to the project folder:

``bash
cd HabitFlow
```

3. Install dependencies with npm:

``bash
npm install
```

4. Start the Expo development server:

``bash
npx expo start
```

5. Scan the QR code displayed in the terminal or the Expo interface using Expo Go. On Android, you can also press `a` from the Expo terminal; on iOS, press `i` if you have an iOS environment available.

You can also use the scripts defined in the project:

```bash
npm run start
npm run android
npm run ios
```

To clear the Metro cache during development:

```bash
npx expo start --clear
```

## Project Structure

```text
src/
components/ Reusable UI components, such as Screen, Button, Card, and TextInput.

screens/ Screens for habits, details, statistics, and settings.

navigation/ Configuration of the root browser, lower tabs, and habits stack.

store/ Zustand stores for theme, habits, and compliance logs.

theme/ Tokens for theme colors, typography, spacing, and resolution.

hooks/ Shared custom hooks.

types/ Shared domain interfaces and types.

utils/ Pure functions for dates, progress, streaks, and notifications.

```

`App.tsx` connects the resolved theme, data rehydration, `NavigationContainer`, and the root browser.

## Architecture Decisions

### Fixed Expo SDK 54

The project fixes Expo SDK 54 to maintain compatibility with Expo Go and avoid incompatibilities between the mobile client version and the project version. Related dependencies are aligned with the SDK using the Expo installer.

### Local Notifications Instead of Remote Push

Reminders are scheduled on the device using `expo-notifications`. No push tokens, backend, or remote services are used because the application is local and does not require server infrastructure.

### No External Charting Library

The heat map and weekly bars are built using `View` components, dynamic styles, and flexbox. This reduces native dependencies and keeps visualizations simple for the application's scope.

### State and Local Persistence

Zustan manages the state of habits and records. Zustand Persist, using AsyncStorage, preserves data between sessions and allows for versioning future model migrations.

### Direct Navigation with React Navigation

The application uses a Bottom Tab Navigator with a nested Native Stack to explicitly show how the screens are organized, without adding the Expo Router abstraction layer.

## Known Limitations

- The application is 100% local and does not sync data between devices.

- Habits and records are stored only on the device.

- Local notifications may be delayed or not delivered if the operating system restricts background activity, battery saving, and notification permissions.

Notifications depend on user permissions and operating system settings.

There is no authentication, user accounts, or cloud data retrieval.

Statistics are calculated using data available on the current device.

## License

This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for the full license text and copyright notice.