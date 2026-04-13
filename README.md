# Terminal Resume Environment [0x01]

> A brutalist, interactive 3D portfolio and professional workspace bridging the gap between web applications and immersive game rendering. Built to stand out and simulate a highly-secured hacker mainframe.

This project completely ditches standard scrolling web structures and places the recruiter inside a dense, 3D Matrix-inspired server room. You navigate freely via panning your viewport, diving deep into CRT monitors that cycle through high-performance dynamic video textures showcasing prior development work, all while seamlessly rendering professional endpoints like a secured NodeMailer email transmission pipeline and a live persistent Telegram chat terminal.

## ⚙️ Core Architecture Features

- **Dynamic 3D Environment**: Entire landing environment is built inside a custom decoupled React-Three-Fiber WebGL `<Canvas>`. Monitors feature rounded CRT-style geometry with beveled casings and persistent highlight overlays.
- **Micro-Memory Allocation**: Heavy 3D geometry is structurally culled behind the viewport and exclusively mapped using `<instancedMesh>` bindings to keep layout bounds strictly under control and prevent VRAM spikes. 
- **Video Texture Pipelining**: WebGL Canvas texture mappers pull low-latency `HTMLVideoElement` feeds from hidden DOM elements natively wrapped inside `requestAnimationFrame` loops, allowing complex high-definition streaming directly onto curved 3D meshes without crashing hardware.
- **CRT Terminal Contact System**: A dedicated `/contact` page mimicking a 1990s monochrome phosphor CRT terminal. Features typewriter boot sequences, phosphor glow, scanline overlays, and voltage-flicker animations.
- **Live Telegram Relay (Persistent)**: Uses **Upstash Redis** to maintain persistent chat sessions across serverless cold starts. Messages sent in the terminal are relayed to your Telegram bot instantly, allowing for a "Live Chat with Allen" experience in the browser.

## 🛠️ Tech Stack 

- **Framework**: `Next.js 15` (App Router Core)
- **3D Engine**: `@react-three/fiber` & `three` (WebGL Engine)
- **Geometry Wrappers**: `@react-three/drei` (OrbitControls, MeshReflector)
- **Database (Session Store)**: `@upstash/redis` (Serverless persistence)
- **SMTP Engine**: `nodemailer` (Backend Contact Gateway)
- **Aesthetics**: `framer-motion` (UI transitions)
- **Deployment**: `Vercel` (Edge & Serverless Node.js infrastructure)

## 📦 Setting up your Node.js Environment

### 1. Installation 
Run the command prompt in the root of the repo directory to install all dependencies:
```bash
npm install
```

### 2. Environment Variables 
For the contact system and live chat to function, you must construct an `.env.local` file at the root.

Create a `.env.local`:
```
# Email (Nodemailer)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop

# Persistence (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Telegram Bot
TELEGRAM_BOT_TOKEN=123456789:ABCDef...
TELEGRAM_CHAT_ID=987654321
```

*(Note: For Gmail, you must generate a 16-character **App Password** from your Google Account Security settings. For Telegram, message @BotFather to create a bot and get a token.)*

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
3. Push all variables from the `.env.local` list.
4. Set the `GMAIL_APP_PASSWORD` and `UPSTASH_REDIS_REST_TOKEN` as `[Sensitive]`.
5. Trigger a fresh deployment rollout.

Enjoy building inside the Grid!
