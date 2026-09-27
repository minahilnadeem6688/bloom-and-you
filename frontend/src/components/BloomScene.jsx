import { useEffect, useRef, useState } from "react";

/*
  A 3D flower that opens when the page loads, lit like a studio product render.
  Petals shade from the brand's dusty rose to blush, with a lavender centre, glossy pearls
  floating around it and a few petals drifting down. Three.js is loaded on demand,
  rendering pauses off-screen, and reduced-motion visitors see the open flower standing still.
*/

const ROSE = "#D6A6C3";
const PINK = "#E6C1D5";
const BLUSH = "#FBEAEA";
const LAVENDER = "#9D8FB8";

export default function BloomScene() {
  const host = useRef(null);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const el = host.current;
      if (disposed || !el) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        setOk(false);
        return;
      }
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 1.0;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = env;
      scene.environmentIntensity = 0.5;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
      camera.position.set(0, 3.6, 6.6);
      camera.lookAt(0, 0.1, 0);

      scene.add(new THREE.HemisphereLight(0xfff5f7, 0xb7799c, 0.45));
      const key = new THREE.DirectionalLight(0xfff0f3, 1.25);
      key.position.set(-3, 5, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xc9bde0, 1.2);
      rim.position.set(3, 1.5, -4);
      scene.add(rim);

      /* ---------- petal geometry: a cupped, tapered, gently curled blade ---------- */
      const cBase = new THREE.Color("#B7799C"), cMid = new THREE.Color(ROSE), cTip = new THREE.Color(PINK);
      function petalGeometry(len, wid, cup, curl) {
        const g = new THREE.PlaneGeometry(1, 1, 18, 26);
        const pos = g.attributes.position;
        const colors = [];
        const col = new THREE.Color();
        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);            // -0.5 .. 0.5
          const v = pos.getY(i) + 0.5;      //  0 .. 1 from base to tip
          const e = (v - 0.58) / 0.58;
          const w = wid * Math.sqrt(Math.max(0, 1 - e * e)) * (0.35 + 0.65 * Math.min(1, v * 2.2));
          const x = u * w;
          const y = v * len * (1 - 0.16 * Math.pow(2 * u, 2) * Math.pow(v, 3));
          const z = cup * x * x * 2.2 - curl * Math.pow(v, 2.2) * len * 0.45 + Math.sin(u * 9 + v * 4) * 0.004;
          pos.setXYZ(i, x, y, z);
          if (v < 0.45) col.copy(cBase).lerp(cMid, v / 0.45);
          else col.copy(cMid).lerp(cTip, Math.min(1, (v - 0.45) / 0.55));
          col.lerp(new THREE.Color(BLUSH), Math.max(0, v - 0.85) * 1.6); // pale rim at the very edge
          colors.push(col.r, col.g, col.b);
        }
        g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
        g.computeVertexNormals();
        return g;
      }
      const petalMat = new THREE.MeshPhysicalMaterial({
        vertexColors: true, side: THREE.DoubleSide, roughness: 0.55, metalness: 0,
        sheen: 0.7, sheenColor: new THREE.Color(BLUSH), sheenRoughness: 0.5,
        clearcoat: 0.12, clearcoatRoughness: 0.7, envMapIntensity: 0.55,
      });

      const flower = new THREE.Group();
      scene.add(flower);

      // rings of petals, inner ones smaller and more closed
      const LAYERS = [
        { n: 5, len: 0.72, wid: 0.66, cup: 1.6, curl: 0.0, open: 0.28, r: 0.04, y: 0.14 },
        { n: 6, len: 0.96, wid: 0.84, cup: 1.25, curl: 0.1, open: 0.58, r: 0.08, y: 0.07 },
        { n: 7, len: 1.18, wid: 0.96, cup: 1.0, curl: 0.28, open: 0.92, r: 0.12, y: 0.0 },
        { n: 8, len: 1.3, wid: 1.02, cup: 0.75, curl: 0.48, open: 1.22, r: 0.15, y: -0.06 },
      ];
      const petals = [];
      LAYERS.forEach((L, li) => {
        const geo = petalGeometry(L.len, L.wid, L.cup, L.curl);
        for (let i = 0; i < L.n; i++) {
          const yaw = (i / L.n) * Math.PI * 2 + li * 0.37;
          const pivot = new THREE.Group();
          pivot.rotation.y = yaw;
          pivot.position.y = L.y;
          const hinge = new THREE.Group();
          hinge.position.z = L.r;
          const m = new THREE.Mesh(geo, petalMat);
          m.rotation.y = Math.PI; // cup faces inwards
          m.rotation.z = (Math.random() - 0.5) * 0.16; // no two petals sit quite the same
          m.scale.setScalar(0.93 + Math.random() * 0.12);
          hinge.add(m);
          pivot.add(hinge);
          flower.add(pivot);
          petals.push({ hinge, open: L.open + (Math.random() - 0.5) * 0.08, delay: (3 - li) * 0.18 + i * 0.015, sway: Math.random() * 6 });
        }
      });

      // lavender centre
      const heart = new THREE.Group();
      const stamenMat = new THREE.MeshPhysicalMaterial({ color: LAVENDER, roughness: 0.35, clearcoat: 1, sheen: 0.6, sheenColor: new THREE.Color("#ffffff") });
      const dotGeo = new THREE.SphereGeometry(0.045, 16, 12);
      for (let i = 0; i < 26; i++) {
        const a = i * 2.39996, r = Math.sqrt(i / 26) * 0.2;
        const d = new THREE.Mesh(dotGeo, stamenMat);
        d.position.set(Math.cos(a) * r, 0.2 + (0.2 - r) * 0.5, Math.sin(a) * r);
        heart.add(d);
      }
      flower.add(heart);

      // pearls
      const pearlMat = new THREE.MeshPhysicalMaterial({ color: "#fff3f5", roughness: 0.16, metalness: 0.05, clearcoat: 1, iridescence: 0.85, iridescenceIOR: 1.6, sheen: 0.4, sheenColor: new THREE.Color(PINK) });
      const lilacMat = pearlMat.clone(); lilacMat.color = new THREE.Color("#E9E1F3");
      const pearls = [
        { r: 0.24, x: -1.75, y: 0.95, z: 0.2, mat: pearlMat, sp: 0.9 },
        { r: 0.15, x: 1.7, y: 1.35, z: -0.3, mat: lilacMat, sp: 1.2 },
        { r: 0.11, x: 1.35, y: -0.35, z: 0.9, mat: pearlMat, sp: 1.5 },
        { r: 0.08, x: -1.2, y: -0.3, z: 1.0, mat: lilacMat, sp: 1.8 },
      ].map((p) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(p.r, 48, 32), p.mat);
        m.position.set(p.x, p.y, p.z);
        scene.add(m);
        return { m, ...p };
      });

      // drifting petals
      const fallGeo = petalGeometry(0.34, 0.3, 1.2, 0.2);
      const drifters = Array.from({ length: 6 }, (_, i) => {
        const m = new THREE.Mesh(fallGeo, petalMat);
        scene.add(m);
        const d = { m, t: Math.random() * 10, x: 0, z: 0, spin: 0.6 + Math.random() };
        const reset = (top) => {
          d.x = (Math.random() - 0.5) * 4.2;
          d.z = (Math.random() - 0.5) * 1.6;
          m.position.set(d.x, top ? 2.8 + Math.random() * 1.5 : -1.5 + Math.random() * 4, d.z);
        };
        d.reset = reset;
        reset(i % 2 === 0);
        return d;
      });

      // soft pink contact shadow
      const sc = document.createElement("canvas");
      sc.width = sc.height = 256;
      const sg = sc.getContext("2d");
      const grad = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, "rgba(157,113,140,0.32)");
      grad.addColorStop(1, "rgba(157,113,140,0)");
      sg.fillStyle = grad;
      sg.fillRect(0, 0, 256, 256);
      const shadowTex = new THREE.CanvasTexture(sc);
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -1.2;
      scene.add(shadow);

      flower.position.y = -0.38;
      flower.rotation.x = 0.3;
      flower.scale.setScalar(1.18);

      const resize = () => {
        const w = el.clientWidth || 400, h = el.clientHeight || 400;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // keep the whole bloom in frame on tall, narrow boxes
        camera.position.z = w / h < 0.9 ? 6.6 / Math.max(0.62, w / h) * 0.9 : 6.6;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(() => { resize(); if (reduce) renderer.render(scene, camera); });
      ro.observe(el);

      const target = { x: 0, y: 0 };
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.9)));
        target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.9)));
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
      let raf = 0, last = performance.now(), time = 0, visible = true;

      const pose = (t) => {
        petals.forEach((p) => {
          const k = ease((t - 0.2 - p.delay) / 2.4);
          const breathe = Math.sin(t * 0.9 + p.sway) * 0.03 * k;
          p.hinge.rotation.x = 0.12 + (p.open - 0.12) * k + breathe; // 0.12 = closed bud, larger = open
        });
        heart.scale.setScalar(0.6 + 0.4 * ease((t - 0.8) / 1.6));
      };

      const frame = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        time += dt;
        pose(time);
        flower.rotation.y += dt * 0.12;
        flower.rotation.z = Math.sin(time * 0.5) * 0.04;
        flower.position.y = -0.38 + Math.sin(time * 0.8) * 0.05;
        pearls.forEach((p, i) => {
          p.m.position.y = p.y + Math.sin(time * p.sp + i) * 0.12;
          p.m.position.x = p.x + Math.cos(time * p.sp * 0.6 + i) * 0.05;
        });
        drifters.forEach((d) => {
          d.t += dt;
          const m = d.m;
          m.position.y -= dt * 0.32;
          m.position.x = d.x + Math.sin(d.t * 0.9) * 0.35;
          m.rotation.set(d.t * d.spin, d.t * 0.7, Math.sin(d.t) * 0.8);
          if (m.position.y < -1.6) d.reset(true);
        });
        scene.rotation.y += (target.x * 0.28 - scene.rotation.y) * 0.05;
        scene.rotation.x += (target.y * 0.12 - scene.rotation.x) * 0.05;
        renderer.render(scene, camera);
        if (visible) raf = requestAnimationFrame(frame);
      };
      const start = () => { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } };
      const stop = () => { cancelAnimationFrame(raf); raf = 0; };

      if (reduce) {
        pose(10);
        drifters.forEach((d) => (d.m.visible = false));
        flower.rotation.y = 0.4;
        renderer.render(scene, camera);
      } else start();
      el.classList.add("is-ready");

      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; visible ? start() : stop(); });
      io.observe(el);
      const onVis = () => { visible = !document.hidden; visible ? start() : stop(); };
      document.addEventListener("visibilitychange", onVis);

      cleanup = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", onVis);
        scene.traverse((o) => {
          o.geometry?.dispose?.();
          const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
          mats.forEach((m) => m.dispose());
        });
        shadowTex.dispose();
        env.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, []);

  if (!ok) return null;
  return <div ref={host} className="bloom-scene" aria-hidden="true" />;
}
