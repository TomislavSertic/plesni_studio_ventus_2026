'use client';
import { useEffect, useRef } from 'react';
export function KineticRibbon() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(max-width: 700px)').matches) return;
    let disposed = false;
    let cleanup = () => {};
    void import('three').then(THREE => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      element.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.z = 8;
      const group = new THREE.Group();
      const resources: { dispose: () => void }[] = [];
      for (let lineIndex = 0; lineIndex < 12; lineIndex++) {
        const points = Array.from({ length: 190 }, (_, i) => {
          const t = (i / 189) * Math.PI * 2;
          const r = 1.5 + lineIndex * 0.032;
          return new THREE.Vector3(Math.cos(t) * r * 1.2, Math.sin(t) * r * 0.74, Math.sin(t * 2 + lineIndex * 0.07) * 0.5);
        });
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: lineIndex % 3 === 0 ? 0xffb36c : 0xff673a, transparent: true, opacity: 0.22 + lineIndex * 0.025 });
        resources.push(geometry, material);
        group.add(new THREE.LineLoop(geometry, material));
      }
      group.rotation.set(0.25, -0.45, -0.55);
      scene.add(group);
      const pointer = { x: 0, y: 0 };
      const move = (e: PointerEvent) => { pointer.x = e.clientX / innerWidth - 0.5; pointer.y = e.clientY / innerHeight - 0.5; };
      window.addEventListener('pointermove', move, { passive: true });
      const resize = new ResizeObserver(() => { renderer.setSize(element.clientWidth, element.clientHeight); camera.aspect = element.clientWidth / Math.max(element.clientHeight, 1); camera.updateProjectionMatrix(); });
      resize.observe(element);
      let visible = true;
      const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
      intersection.observe(element);
      renderer.setAnimationLoop((time: number) => {
        if (!visible || document.hidden) return;
        group.rotation.y = -0.45 + Math.sin(time * 0.00013) * 0.35 + pointer.x * 0.2;
        group.rotation.z = -0.55 + Math.sin(time * 0.0001) * 0.1;
        group.rotation.x = 0.25 + pointer.y * 0.15;
        renderer.render(scene, camera);
      });
      cleanup = () => { renderer.setAnimationLoop(null); resize.disconnect(); intersection.disconnect(); window.removeEventListener('pointermove', move); resources.forEach(r => r.dispose()); renderer.dispose(); renderer.domElement.remove(); };
    }).catch(() => { /* The photograph and CSS ring remain available without WebGL. */ });
    return () => { disposed = true; cleanup(); };
  }, []);
  return <div ref={host} className="kinetic-ribbon" aria-hidden="true" />;
}
