"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Global vanilla store to broadcast activation and selection state robustly
let devSubscribers: (() => void)[] = [];
export const devStore = {
  isDevActive: false,
  selected: null as THREE.Object3D | null,
  snapshot: null as any,
  tick: 0,
  subscribe: (cb: () => void) => {
    devSubscribers.push(cb);
    return () => { devSubscribers = devSubscribers.filter(s => s !== cb); };
  },
  toggle: () => {
    if (devStore.isDevActive) {
      devStore.revert(); // Revert unsaved changes when closing the inspector
    }
    devStore.isDevActive = !devStore.isDevActive;
    if (!devStore.isDevActive) devStore.selected = null;
    devSubscribers.forEach(cb => cb());
  },
  setSelected: (obj: THREE.Object3D | null) => {
    // If selecting a new object and old one wasn't saved, auto-revert old one
    if (devStore.selected && devStore.selected !== obj) {
      devStore.revert();
    }
    devStore.selected = obj;
    if (obj) {
      const rawMat = (obj as any).material;
      const mat = Array.isArray(rawMat) ? rawMat[0] : rawMat;
      devStore.snapshot = {
        position: obj.position.clone(),
        rotation: obj.rotation.clone(),
        scale: obj.scale.clone(),
        intensity: (obj as any).intensity,
        mat: mat ? {
          color: mat.color ? mat.color.clone() : undefined,
          emissive: mat.emissive ? mat.emissive.clone() : undefined,
          metalness: mat.metalness,
          roughness: mat.roughness,
        } : null
      };
    } else {
      devStore.snapshot = null;
    }
    devStore.forceRender();
  },
  save: () => {
    if (!devStore.selected) return;
    // Resnapshot the current state to act as the new baseline
    devStore.setSelected(devStore.selected);
  },
  revert: () => {
    const obj = devStore.selected;
    const snap = devStore.snapshot;
    if (!obj || !snap) return;
    
    obj.position.copy(snap.position);
    obj.rotation.copy(snap.rotation);
    obj.scale.copy(snap.scale);
    if (snap.intensity !== undefined) (obj as any).intensity = snap.intensity;
    
    const rawMat = (obj as any).material;
    const mat = Array.isArray(rawMat) ? rawMat[0] : rawMat;
    
    if (mat && snap.mat) {
      if (snap.mat.color && mat.color) mat.color.copy(snap.mat.color);
      if (snap.mat.emissive && mat.emissive) mat.emissive.copy(snap.mat.emissive);
      if (snap.mat.metalness !== undefined) mat.metalness = snap.mat.metalness;
      if (snap.mat.roughness !== undefined) mat.roughness = snap.mat.roughness;
    }
    devStore.forceRender();
  },
  forceRender: () => {
    devStore.tick++;
    devSubscribers.forEach(cb => cb());
  }
};

// ─── CANVS COMPONENT (INTERNAL RAYCASTER) ──────────────────────────────────
export function DevInspectorRaycaster() {
  const { gl, camera, scene, raycaster, pointer } = useThree();
  const [active, setActive] = useState(devStore.isDevActive);
  const [selected, setSelected] = useState<THREE.Object3D | null>(devStore.selected);
  const helperRef = useRef<THREE.BoxHelper | null>(null);

  // Sync with store
  useEffect(() => {
    return devStore.subscribe(() => {
      setActive(devStore.isDevActive);
      setSelected(devStore.selected);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`") {
        devStore.toggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Raycaster logic
  useEffect(() => {
    if (!active) return;
    
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName !== "CANVAS") return;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const hit = intersects.find(i => i.object.type === "Mesh" || i.object.type.includes("Light"));
        if (hit && hit.object) {
          devStore.setSelected(hit.object);
          if (helperRef.current) scene.remove(helperRef.current);
          helperRef.current = new THREE.BoxHelper(hit.object, new THREE.Color(0x00ff41));
          scene.add(helperRef.current);
        } else {
          devStore.setSelected(null);
        }
      } else {
        devStore.setSelected(null);
      }
    };

    gl.domElement.addEventListener("click", onClick);
    return () => {
      gl.domElement.removeEventListener("click", onClick);
      if (helperRef.current) {
        scene.remove(helperRef.current);
        helperRef.current = null;
      }
    };
  }, [active, camera, gl.domElement, pointer, raycaster, scene]);

  useFrame(() => {
    if (helperRef.current && selected) {
      helperRef.current.update();
    }
  });

  return null;
}

// ─── DOM COMPONENT (EXTERNAL UI) ─────────────────────────────────────────
export function DevInspectorUI() {
  const [active, setActive] = useState(devStore.isDevActive);
  const [selected, setSelected] = useState<THREE.Object3D | null>(devStore.selected);
  const [, setTick] = useState(0);

  useEffect(() => {
    return devStore.subscribe(() => {
      setActive(devStore.isDevActive);
      setSelected(devStore.selected);
      setTick(devStore.tick);
    });
  }, []);

  if (!active || typeof window === 'undefined') return null;

  return (
      <div 
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          width: "320px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0,255,65,0.5)",
          padding: "16px",
          borderRadius: "12px",
          color: "#00ff41",
          fontFamily: "monospace",
          fontSize: "12px",
          boxShadow: "0 0 30px rgba(0,255,65,0.15)",
          userSelect: "none",
          zIndex: 99999
        }}
        onPointerDown={(e) => e.stopPropagation()} 
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,255,65,0.3)", paddingBottom: "8px", marginBottom: "12px" }}>
          <h2 className="text-sm font-bold tracking-widest" style={{ margin: 0 }}>DEV INSPECTOR</h2>
          <span style={{ backgroundColor: "rgba(0,255,65,0.2)", padding: "2px 8px", borderRadius: "4px", fontSize: "10px" }}>ACTIVE</span>
        </div>
        
        {!selected ? (
          <p style={{ opacity: 0.6, fontStyle: "italic", marginTop: "16px", textAlign: "center" }}>Click any 3D asset to inspect.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: "rgba(0,255,65,0.05)", padding: "8px", borderRadius: "4px" }}>
              <p style={{ fontSize: "10px", opacity: 0.7, margin: "0 0 4px 0" }}>TARGET</p>
              <p style={{ fontWeight: "bold", margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{selected.name || selected.type}</p>
            </div>
            
            <VectorEditor label="POSITION" obj={selected} prop="position" onUpdate={() => devStore.forceRender()} />
            <VectorEditor label="ROTATION" obj={selected} prop="rotation" onUpdate={() => devStore.forceRender()} isAngle min={-360} max={360} />
            <VectorEditor label="SCALE" obj={selected} prop="scale" onUpdate={() => devStore.forceRender()} min={0.01} max={10} step={0.01} />

            {selected.type.includes("Light") && (
              <NumberEditor label="INTENSITY" obj={selected} prop="intensity" min={0} max={10} step={0.1} onUpdate={() => devStore.forceRender()} />
            )}

            {(selected as THREE.Mesh).material && (
              <MaterialEditor material={(selected as THREE.Mesh).material} onUpdate={() => devStore.forceRender()} />
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,255,65,0.3)' }}>
              <button 
                onClick={() => devStore.revert()}
                style={{ flex: 1, padding: "8px", background: "transparent", border: "1px solid rgba(0,255,65,0.4)", color: "#00ff41", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}
              >
                REVERT CHANGES
              </button>
              <button 
                onClick={() => devStore.save()}
                style={{ flex: 1, padding: "8px", background: "rgba(0,255,65,0.2)", border: "1px solid rgba(0,255,65,0.6)", color: "#00ff41", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}
              >
                SAVE STATE
              </button>
            </div>
          </div>
        )}
      </div>
  );
}

// ─── Sub-Editors ──────────────────────────────────────────────────────────────

function VectorEditor({ label, obj, prop, onUpdate, isAngle, min = -50, max = 50, step = 0.1 }: any) {
  const target = obj[prop];
  return (
    <div style={{ backgroundColor: "rgba(0,255,65,0.05)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(0,255,65,0.1)" }}>
      <p style={{ fontWeight: "bold", marginBottom: "12px", opacity: 0.8, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px 0" }}>{label}</p>
      {['x', 'y', 'z'].map(axis => {
        const val = isAngle ? target[axis] * (180 / Math.PI) : target[axis];
        return (
          <div key={axis} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <span style={{ width: "12px", fontWeight: "bold", opacity: 0.6, textTransform: "uppercase" }}>{axis}</span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={val || 0}
              onChange={(e) => {
                const newVal = parseFloat(e.target.value);
                target[axis] = isAngle ? newVal * (Math.PI / 180) : newVal;
                onUpdate();
              }}
              style={{ flex: 1, accentColor: "#00ff41" }}
            />
            <input
              type="number"
              value={Number((val || 0).toFixed(2))}
              onChange={(e) => {
                const newVal = parseFloat(e.target.value);
                target[axis] = isAngle ? newVal * (Math.PI / 180) : newVal;
                onUpdate();
              }}
              style={{ width: "56px", background: "transparent", outline: "none", textAlign: "right", border: "none", borderBottom: "1px solid rgba(0,255,65,0.3)", color: "inherit", fontFamily: "inherit", fontSize: "11px" }}
            />
          </div>
        );
      })}
    </div>
  );
}

function NumberEditor({ label, obj, prop, onUpdate, min, max, step }: any) {
  return (
    <div style={{ backgroundColor: "rgba(0,255,65,0.05)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(0,255,65,0.1)", marginBottom: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontWeight: "bold", opacity: 0.8, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
        <input
          type="number"
          value={Number((obj[prop] || 0).toFixed(2))}
          onChange={(e) => {
            obj[prop] = parseFloat(e.target.value);
            onUpdate();
          }}
          style={{ width: "56px", background: "transparent", outline: "none", textAlign: "right", border: "none", borderBottom: "1px solid rgba(0,255,65,0.3)", color: "inherit", fontFamily: "inherit", fontSize: "11px" }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={obj[prop] || 0}
        onChange={(e) => {
          obj[prop] = parseFloat(e.target.value);
          onUpdate();
        }}
        style={{ width: "100%", accentColor: "#00ff41" }}
      />
    </div>
  );
}

function MaterialEditor({ material, onUpdate }: any) {
  // If array of materials, grab first
  const mat = Array.isArray(material) ? material[0] : material;
  
  return (
    <div style={{ backgroundColor: "rgba(0,255,65,0.05)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(0,255,65,0.1)", display: "flex", flexDirection: "column", gap: "12px" }}>
      <p style={{ fontWeight: "bold", opacity: 0.8, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(0,255,65,0.2)", paddingBottom: "4px", margin: 0 }}>MATERIAL</p>
      
      {mat.metalness !== undefined && (
        <NumberEditor label="Metalness" obj={mat} prop="metalness" min={0} max={1} step={0.01} onUpdate={onUpdate} />
      )}
      {mat.roughness !== undefined && (
        <NumberEditor label="Roughness" obj={mat} prop="roughness" min={0} max={1} step={0.01} onUpdate={onUpdate} />
      )}
      {mat.color && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "4px" }}>
          <span style={{ fontWeight: "bold", opacity: 0.8, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>COLOR</span>
          <input 
            type="color" 
            value={"#" + mat.color.getHexString()} 
            onChange={(e) => {
              mat.color.set(e.target.value);
              onUpdate();
            }}
            style={{ width: "32px", height: "32px", borderRadius: "4px", cursor: "pointer", border: "none", background: "transparent" }}
          />
        </div>
      )}
      {mat.emissive && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "4px" }}>
          <span style={{ fontWeight: "bold", opacity: 0.8, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>EMISSIVE</span>
          <input 
            type="color" 
            value={"#" + mat.emissive.getHexString()} 
            onChange={(e) => {
              mat.emissive.set(e.target.value);
              onUpdate();
            }}
            style={{ width: "32px", height: "32px", borderRadius: "4px", cursor: "pointer", border: "none", background: "transparent" }}
          />
        </div>
      )}
    </div>
  );
}
