# Terminal Resume Environment [0x01]

> A brutalist, interactive 3D portfolio and professional workspace bridging the gap between web applications and immersive game rendering. Built to stand out and simulate a highly-secured hacker mainframe.

This project completely ditches standard scrolling web structures and places the recruiter inside a dense, 3D Matrix-inspired server room. You navigate freely via panning your viewport, diving deep into CRT monitors that cycle through high-performance dynamic video textures showcasing prior development work, all while seamlessly rendering professional endpoints like a secured NodeMailer email transmission pipeline.

## ⚙️ Core Architecture Features

- **Dynamic 3D Environment**: Entire landing environment is built inside a custom decoupled React-Three-Fiber WebGL `<Canvas>`. The physics constraints natively lock and unlock depending on user interaction, allowing smooth `.lerp()` sequence movements when approaching screens or exiting the grid.
- **Micro-Memory Allocation**: Heavy 3D geometry is structurally culled behind the viewport and exclusively mapped using `<instancedMesh>` bindings to keep layout bounds strictly under control and prevent VRAM spikes. 
- **Video Texture Pipelining**: WebGL Canvas texture mappers pull low-latency `HTMLVideoElement` feeds from hidden DOM elements natively wrapped inside `requestAnimationFrame` loops, allowing complex high-definition streaming directly onto curved 3D meshes without crashing low-end hardware.
- **Secure Backend Transmission**: Bypasses the traditional "Mock Submit" systems. Features a hardened `Next.js 15` POST endpoint that parses `.env.local` level Gmail App Passwords remotely within the server framework, authenticating natively through NodeMailer to route form payloads from Vercel securely to your physical inbox.

## 🛠️ Tech Stack 

- **Framework**: `Next.js 15` (App Router Core)
- **3D Engine**: `@react-three/fiber` & `three` (WebGL Engine)
- **Geometry Wrappers**: `@react-three/drei` (OrbitControls, MeshReflector)
- **Styling**: `TailwindCSS` (Brutalist monospace overlays)
- **SMTP Engine**: `nodemailer` (Backend Contact Gateway)
- **Deployment**: `Vercel` (Edge & Serverless Node.js infrastructure)

## 📦 Setting up your Node.js Environment

### 1. Installation 
Run the command prompt in the root of the repo directory to install all dependencies:
```bash
npm install
```

### 2. Environment Variables 
For the Contact Form to successfully transmit server-routed emails, you must construct an `.env.local` file at the root. Do **NOT** upload this file to Git. 

Create a `.env.local`:
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

*(Note: Standard passwords will fail. You must navigate to your active Google Account -> SECUIRITY -> 2-Step Verification and generate a 16-character **App Password**. Make sure to remove any spaces if copying horizontally!)*

### 3. Startup 
Run your local testing server: 
```bash
npm run dev
```

Navigate to `http://localhost:3000` to interact with the environment sandbox. 

## 🚀 Production Deployment Sequence
Whenever you perform a code push to the main branch via Vercel GitHub hooking, remember you must inject the environment variables natively into the Vercel infrastructure. 

1. Launch your `Vercel` deploy dashboard.
2. Under `Settings > Environment Variables`.
3. Push `GMAIL_USER` and `GMAIL_APP_PASSWORD` respectively.
4. Set the `GMAIL_APP_PASSWORD` variable as `[Sensitive]` to restrict UI visibility on the Vercel portal.
5. Trigger a fresh deployment rollout.

Enjoy building inside the Grid!
