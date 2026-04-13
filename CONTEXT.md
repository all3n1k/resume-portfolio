# Portfolio Project Context

## Overview
**Project Name**: Allen's Resume Portfolio
**Description**: A high-fidelity, interactive 3D web portfolio showcasing Allen's experience as a Security Researcher and Full-Stack Engineer. The site features a "Matrix/Hacker" aesthetic, an integrated local AI assistant, and complex Three.js 3D scenes.
**Date Created**: April 2026

## Tech Stack
### Primary
- **Framework**: Next.js 15.5.9 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion, local CSS modules (e.g., `ChatWidget.module.css`)
- **3D Engine**: Three.js v0.183.2, `@react-three/fiber` v9.5.0, `@react-three/drei` v10.7.7
- **UI Components**: `lucide-react` icons, bespoke glassmorphism & glitch text components.
- **Linting**: ESLint v9, strictly enforced (zero warnings/errors target for production).

### Architecture & Key Features
- **3D Scene Pipeline**: 
  - Includes `ArchitectScene.tsx`, `MatrixCanvas.tsx`, `NeoModel.tsx`, and `ArchitectModel.tsx`. 
  - Heavily relies on WebGL and React Three Fiber.
  - *Known Caveats*: We have identified constraints around video texture performance in Three.js and utilize a canvas downscaler to prevent GPU requestAnimationFrame leaks.
  - *Rendering Technicals*: `THREE.DoubleSide` is deliberately omitted on animated FBX meshes (like Mixamo coats/clothing) to prevent Z-fighting artifacts on internal model geometry. `.computeVertexNormals()` is utilized directly post-load to strip out broken imported smoothing groups.
  - *Interactive Lighting*: The `ArchitectScene` features a physically modelled "Source" white void. We use exponential PointLight attenuation and dynamic distance boundary tracking to simulate "liquid" volumetric light sweeps as the doorway opens.
- **AI Assistant Integration**:
  - `src/app/api/chat/route.ts` connects the frontend to a locally hosted LLM (via Ollama or an OpenAI-compatible endpoint).
  - Uses `SYSTEM_PROMPT` to restrict responses to Allen's professional background only.
  - Robust frontend UI integration via `ChatWidget.tsx` offering a "Matrix-style" streaming matrix response interface.
- **Interactive UI & Themes**:
  - `LandingDoorSequence.tsx` and `EasterEggManager.tsx` control specialized user journeys and hidden interactive elements. Complete with rigorous cinematic timing and slower `cameraLerpSpeeds` for dramatic effect.
  - `MouseGlitchText.tsx` and `GlitchText.tsx` build up the core subversive cyberpunk aesthetic using custom `paint-order: stroke fill` strategies and OCR-A font outlines.
  - Includes elements like `ModernAchievements.tsx` and `TechStack.tsx` for structured data presentation.

## Allen's Professional Profile (Data Layer)
The UI dynamically or statically serves this structured career data:
1. **Cybersecurity & Pen-Testing (2024)**: Technical Support Specialist authorized for internal pen-testing (kill-chain execution, enumeration, lateral traversal, privilege escalation). Tools: Metasploit, Burp Suite, Ghidra.
2. **Jewelry Tech Platform Co-Founder (2023)**: Sole architect for a full-stack React app featuring early AI diffusion models, Obsidian-style graph interfaces, multi-stage photo updates, and fiber-networked workstation rollouts. 
3. **Web Security Research (2022)**: Automated botnet evasion, credential stuffing simulation, custom OpenBullet forks, and deep application auth hooking using Frida on mobile OS platforms.
4. **Hardware Modding & Fundamentals (2014-)**: Hardware-level tweaks for PS3/Xbox, PC building, game exploitation (Cheat Engine), reverse engineering, and continuous deployment for game servers.

## Deployment & Security
- **Hosting Environment**: Vercel. 
- **Application Security**: Up-to-date with Next.js 15.5.9 (mitigating CVE-2025-66478).
- **CI/CD Constraints**: Clean build pipelines are prioritized; lint errors strictly block deployment.

## Repository Conventions
- Code must reside in `src/` where appropriate. 
- Ensure adherence to local deployment environment configurations specifically for streaming responses and loading heavy 3D assets to keep the Vercel footprint functional.
- *Living Document Note: This document must be kept up-to-date by Antigravity upon any structural or architectural additions to ensure continuous project continuity.*
