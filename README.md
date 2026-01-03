# 🔧 ShopFloor Lite – Production Operations Dashboard

ShopFloor Lite is a **React Native + Expo** application for managing shop-floor operations with **role-based access** for Operators and Supervisors.

---

## 🚀 Tech Stack
- React Native + Expo
- Expo Router (file-based navigation)
- React Context API+Zustand (state management)
- AsyncStorage (local persistence)
- NativeWind (Tailwind CSS)

---

## ✨ Key Features
- **Dashboard**: Live machine status (Running / Stopped / Maintenance)
- **Downtime Capture (Operator)**  
  Start → Select reason from a **2-level tree** → End  
  Optional photo attachment 
  Offline-first (events queued locally)
- **Maintenance Checklist (Operator)**  
  Complete checklist → machine returns to RUNNING
- **Alerts (Supervisor)**  
  View, acknowledge, and clear alerts
- **Summary (Supervisor)**  
  Machine status counts & KPIs

---

## 👥 Role-Based Access
| Feature | Operator | Supervisor |
|------|---------|-----------|
| Dashboard | ✅ | ✅ |
| Downtime | ✅ | ❌ |
| Maintenance | ✅ | ❌ |
| Alerts | ❌ | ✅ |
| Summary | ❌ | ✅ |

---

## 🔐 Authentication (Mock)
- Credential-based login 
- Session persisted via AsyncStorage


---

## 💾 Offline & Persistence
- Machines, alerts, and maintenance records stored locally
- Offline actions queued and synced when connectivity is restored (simulated)

---

## ▶️ Run Locally
```bash
npm install
npx expo start
