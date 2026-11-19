import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as Controls } from "three-stdlib";
import { Vector3, OrthographicCamera } from "three";
import { departmentById } from "../../departments/config";
import { useOfficeStore } from "../../store/useOfficeStore";
export function CameraRig() {
  const controls = useRef<Controls>(null);
  const selected = useOfficeStore((s) => s.selected);
  const focus = useOfficeStore((s) => s.focusVersion);
  const reset = useOfficeStore((s) => s.cameraResetVersion);
  const { camera, size } = useThree();
  const reduced = useRef(false);
  const motion = useRef({
    active: false,
    start: 0,
    zoom: 35,
    target: new Vector3(),
    offset: new Vector3(),
    destination: new Vector3(),
    home: new Vector3(19, 23, 28),
    next: new Vector3(),
  });
  const overviewZoom = Math.min(
    size.width / (size.width < 500 ? 39 : 36),
    size.height / 25,
  );
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduced.current = preference.matches;
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const m = motion.current;
    m.target.copy(controls.current?.target ?? new Vector3());
    m.offset.copy(camera.position).sub(m.target);
    m.destination.fromArray(
      focus ? departmentById[selected].position : [0, 0, 0],
    );
    m.zoom = (camera as OrthographicCamera).zoom;
    m.start = performance.now();
    m.active = true;
  }, [selected, focus, reset, camera, size.width, size.height]);
  // Elapsed time, rather than accumulated frame deltas, keeps transitions bounded
  // even when a background browser tab temporarily throttles animation frames.
  useFrame(() => {
    const m = motion.current;
    if (!m.active || !controls.current) return;
    const t = reduced.current
      ? 1
      : Math.min((performance.now() - m.start) / 750, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    controls.current.target.copy(m.target).lerp(m.destination, ease);
    m.next.copy(m.offset);
    if (!focus) m.next.lerp(m.home, ease);
    camera.position.copy(controls.current.target).add(m.next);
    const cam = camera as OrthographicCamera;
    cam.zoom = m.zoom + (overviewZoom * (focus ? 1.95 : 1) - m.zoom) * ease;
    cam.updateProjectionMatrix();
    controls.current.update();
    if (t === 1) m.active = false;
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      minZoom={overviewZoom * 0.7}
      maxZoom={overviewZoom * 2.6}
      minPolarAngle={Math.PI / 4.4}
      maxPolarAngle={Math.PI / 3.15}
      minAzimuthAngle={Math.PI / 12}
      maxAzimuthAngle={Math.PI / 3.1}
      onStart={() => {
        motion.current.active = false;
      }}
    />
  );
}
