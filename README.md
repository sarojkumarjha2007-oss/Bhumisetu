# BhumiSetu (भूमिसेतु)
### Real-Time National Land Acquisition & Management System
**Smart India Hackathon 2026 • Problem Statement 26016**  
*Department of Land Resources (DoLR), Ministry of Rural Development, Government of India*

---

## 💻 VS Code Me Run Karne Ka Step-by-Step Guide

### Step 1: Pre-requisites (Zaroori Software)
Aapke computer me ye pehle se install hona chahiye:
1. **Node.js**: Version 18 ya higher (Recommended: Node.js 20 LTS ya 22 LTS).  
   Check karne ke liye terminal me run karein:
   ```bash
   node -v
   npm -v
   ```
2. **VS Code (Visual Studio Code)**

---

### Step 2: Project Folder VS Code Me Open Karein
1. VS Code open karein.
2. `File` ➔ `Open Folder...` par click karein aur project ka root folder select karein.
3. Terminal open karein: `Ctrl + ~` (Windows/Linux) ya `Cmd + ~` (Mac), ya upar menu se `Terminal` ➔ `New Terminal`.

---

### Step 3: Dependencies Install Karein
Terminal me ye command chalayein (ye saare React, Leaflet, Tailwind aur Firebase packages install karega):
```bash
npm install
```

---

### Step 4: Development Server Start Karein
Terminal me run karein:
```bash
npm run dev
```

Terminal me aapko local link dikhega:
```text
  VITE v8.x.x  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Ab browser me **`http://localhost:3000`** open karein. Aapka **BhumiSetu** platform live chalne lagega!

---

### Step 5: Production Build Test Karna (Optional)
Agar aapko production optimized build test karni ho:
```bash
npm run build
npm run preview
```

---

## 🔑 Important Files & Config in VS Code
- **`firebase-applet-config.json`**: Isme Firebase connection credentials pehle se configured hain. Local run karte waqt ye file automatically connect ho jayegi.
- **`src/App.tsx`**: Main component jahan se saare modules route hote hain.
- **`src/context/AppContext.tsx`**: Saare state transitions, real-time sync, aur audit trail yahan manage hote hain.
- **`src/components/gis/GisMapModule.tsx`**: Interactive Leaflet cadastral map view.

---

## 👥 Demo Logins / Personas (Instant Testing)
App ke top-right bar me **"Login / Roles"** button par click karke aap in 6 personas me switch kar sakte hain:
1. **National Admin**: `national.admin@dolr.gov.in` (Full Central Ministry privileges)
2. **State Admin**: `revenue.sec@maharashtra.gov.in` (State Revenue Scrutiny)
3. **District Authority**: `collector.pune@gov.in` (District Collector / SLAO)
4. **Implementing Agency**: `gm.projects@nhai.org.in` (NHAI / Proposal Submitter)
5. **Field Cadastral Officer**: `amin.khed@pune.gov.in` (GPS Spot Inspection)
6. **Public Citizen Viewer**: `citizen.portal@bhumisetu.gov.in` (RTI Public Transparency Portal)
