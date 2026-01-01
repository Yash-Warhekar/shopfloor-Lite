# 🔧 ShopFloor Lite - Production Operations Dashboard

A React Native + Expo application for managing shop floor operations, machine downtime reporting, maintenance tracking, and real-time alerts with role-based access control.

---

## 📋 Quick Start

### Installation
```bash
cd c:\Users\Soft\Desktop\PROJECTS\shopfloor-Lite
npm install
npm install @react-native-async-storage/async-storage  # (if not present)
```

### Running the App
```bash
npx expo start
```
- Scan QR code with Expo Go app, or
- Press `a` for Android, `i` for iOS emulator

---

## ✨ Features

### Core Functionality
- **Machine Monitoring**: Real-time dashboard with live status indicators (Running, Stopped, Maintenance)
- **Downtime Reporting** (Operator): Log downtime with reason and remarks
- **Maintenance Tracking** (Operator): Complete maintenance checklists with records
- **Alert System**: Real-time alerts with severity levels and timestamps
- **Summary KPIs** (Supervisor): View operational metrics for today

### Role-Based Access
- **Operator Mode**: Report downtime, complete maintenance
- **Supervisor Mode**: View all alerts, access KPI dashboard, monitor operations
- **Session Persistence**: User role and state persisted across app restarts

---

## 👥 Role-Based Access Control

### Operator Capabilities
| Feature | Access |
|---------|--------|
| View Machines | ✅ |
| Report Downtime | ✅ |
| Complete Maintenance | ✅ |
| View Alerts | ❌ |
| View Summary KPIs | ❌ |

### Supervisor Capabilities
| Feature | Access |
|---------|--------|
| View Machines | ✅ |
| Report Downtime | ❌ |
| Complete Maintenance | ❌ |
| View Alerts | ✅ |
| View Summary KPIs | ✅ |

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native + Expo
- **State Management**: React Context API
- **Styling**: NativeWind + Tailwind CSS
- **Persistence**: AsyncStorage
- **Routing**: Expo Router

### Context Providers
1. **RoleProvider** - Manages user role (OPERATOR/SUPERVISOR)
2. **AppDataProvider** - Manages machines, alerts, maintenance records

### Data Models
```typescript
// Machine with live status
interface Machine {
  id: string;
  name: string;
  status: 'RUNNING' | 'STOPPED' | 'MAINTENANCE';
  lastUpdated: string;
  downtimeReason?: string;
}

// Alert with severity & timestamp
interface Alert {
  id: string;
  message: string;
  machineName: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt?: string;  // ISO timestamp
}

// Maintenance record
interface MaintenanceRecord {
  id: string;
  machineId: string;
  machineName: string;
  completedItems: ChecklistItem[];
  remarks: string;
  timestamp: string;  // ISO timestamp
}
```

---

## 💾 Data Persistence

All state is automatically persisted to AsyncStorage:
- **machines** - Current machine states
- **alerts** - Generated alerts
- **maintenanceRecords** - Maintenance history
- **userId** - Logged-in user (for session persistence)

On app restart, previous state and login session are automatically restored.

---

## 🔐 Role-Based Authentication

### Login System
The app uses **credential-based authentication** with pre-seeded user accounts stored in `context/AuthContext.tsx`.

### Demo Credentials

**Operator Accounts:**
| Username | Password | Name |
|----------|----------|------|
| `operator` | `op123` | John Operator |
| `operator2` | `op456` | Jane Operator |

**Supervisor Account:**
| Username | Password | Name |
|----------|----------|------|
| `supervisor` | `sup123` | Mike Supervisor |

### Authentication Features
- ✅ Credential validation against seeded users
- ✅ Session persistence (user stays logged in after app restart)
- ✅ User name display in navigation header
- ✅ Logout button with role-based header
- ✅ Demo credentials shown on login screen
- ✅ Role automatically determined from user account

### How It Works
1. User enters username/password on login screen
2. System validates credentials against SEEDED_USERS
3. On success: User ID stored in AsyncStorage, role set in AuthContext
4. Auto-redirect to dashboard with role active
5. User name and logout button appear in header
6. On logout: User ID cleared, returns to login screen

---

## 📁 Project Structure

```
shopfloor-Lite/
├── app/
│   ├── _layout.tsx              # Root layout with providers
│   ├── login.tsx                # Login with credentials
│   └── (tabs)/
│       ├── _layout.tsx          # Tabs with logout header
│       ├── dashboard.tsx        # Machine list
│       ├── downtime.tsx         # Downtime reporting (Operator)
│       ├── maintenance.tsx      # Maintenance checklist (Operator)
│       ├── alerts.tsx           # Alert viewer (Supervisor)
│       └── summary.tsx          # KPI dashboard (Supervisor)
├── components/
│   ├── DowntimeForm.tsx         # Downtime form (role-guarded)
│   ├── MachineCard.tsx          # Machine card with live colors
├── context/
│   ├── AuthContext.tsx          # Auth state with credential validation
│   ├── AppDataContext.tsx       # State: machines, alerts, maintenance
│   └── RoleContext.tsx          # (Legacy - can be removed)
├── constants/
│   └── machine.tsx              # Machine seed data
```

---

## 🔄 Typical Workflows

### Login & Session
1. Open app on fresh install → Login screen appears
2. Enter demo credentials (e.g., `operator` / `op123`)
3. On success → Auto-redirect to dashboard
4. User name and logout button appear in header
5. Close and reopen app → Auto-login with persisted session

### Operator: Report Downtime
1. Ensure logged in as Operator
2. Dashboard shows all machines with live status
3. Tap "Downtime" tab
4. Select machine → Enter reason
5. Submit → Alert generated, machine status changes

### Operator: Complete Maintenance
1. Tap "Maintenance" tab
2. Select machine → Check completed items
3. Add remarks → Submit
4. Machine returns to RUNNING, record saved

### Supervisor: Monitor Operations
1. Login as Supervisor
2. View all machines on Dashboard
3. Tap "Alerts" to see all notifications
4. Tap "Summary" to view today's KPIs:
   - Total machines / Running / Stopped
   - Downtime reports today
   - Maintenance completed today
   - All alerts today

---

## 🚀 Advanced Usage

### Running with Expo Tunnel
```bash
npx expo start --tunnel
```

### Running on Web
```bash
npx expo start --web
```

### Clearing Cache & Debugging
```bash
npx expo start --clear        # Clear cache
npx expo start --devtools     # Open devtools
```

---

## 🔐 Security Notes

- **Local-Only Storage**: No backend required, all data stored locally
- **Role-Based Guards**: Unauthorized users see access denied screens
- **No Authentication**: Demo uses role selection (extend with real auth as needed)

---

## 📱 Supported Platforms

- ✅ iOS 13+
- ✅ Android 5+
- ✅ Web/Browser
- ✅ Physical Devices & Emulators

---

## 🛠️ Troubleshooting

### Q: Expo tunnel fails with exit code 1
**A:** Use LAN mode: `npx expo start --lan`

### Q: Data not persisting after restart
**A:** Ensure AsyncStorage is installed: `npm install @react-native-async-storage/async-storage`

### Q: "Access Denied" message
**A:** Check that you selected the correct role on login screen

### Q: App shows "null" or blank screen
**A:** App is hydrating state from AsyncStorage. Wait a moment; this is normal on first launch.

---

## 📝 Development Notes

### Adding Features
- New machine statuses: Update `MachineStatus` type in AppDataContext
- New actions: Add to AppDataContext and export
- Role-specific pages: Use `useRole()` hook to guard access

### Performance
- State updates optimized for large arrays
- AsyncStorage writes are async (non-blocking)
- NativeWind classes compiled at build time

---

**Last Updated**: January 1, 2026  
**Framework**: React Native + Expo | **State**: React Context + AsyncStorage | **UI**: NativeWind

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
