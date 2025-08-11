
# CCC Trips (Prototype)

Mobile app prototype for Conley Concrete & Construction drivers to log trips.

## What this prototype includes
- New Trip form with dropdowns and free-text delivery location
- Start/End timestamps via buttons (auto-filled)
- Local/offline storage (per-device) using AsyncStorage
- "Today's Trips" screen + one-tap CSV copy (for manual testing)
- Branding colors: Orange (#F5821E), Black, White
- Placeholder "C.C.C." logo with black outline/shadow

> Note: Backend (Firebase) + daily 10 PM email reports are not wired in this package. This is the mobile app first, as requested. I include instructions below to connect Firebase later.

## Run locally (Expo)
1. Install Node.js LTS.
2. Install Expo CLI: `npm i -g expo`
3. In this folder: `npm install`
4. Start: `npm start`
5. Scan the QR code with **Expo Go** app on your phone (Android or iOS).

## Configure lists
Edit `src/store/data.ts` to change drivers, trucks, customers, materials, pickup locations.

## Export CSV
Open **Today's Trips** and tap **Copy CSV of Today's Trips**. Paste into email or a file to simulate a report.

## Hook up Firebase later (optional)
- Create a Firebase project and Firestore database.
- Add a web app in Firebase console; copy the config into a new file `src/firebase/config.ts`:
```ts
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```
- Install Firebase packages: `npm i firebase`
- Replace storage calls in `src/store/storage.ts` with Firestore read/writes (or keep local for pilot).
- For daily 10 PM reports: create a Cloud Function (Node) that queries today's trips and emails a CSV through SendGrid.

## Notes
- Delivery Location is free text.
- Start/End timestamps are captured on press; started trip resets after saving.
- This is an MVP scaffold meant for pilot testing and feedback.
