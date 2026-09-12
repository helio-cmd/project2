cat > src/App.jsx <<'EOF'
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, OrbitControls, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

const company = {
  name: 'SRI PAVAN COMPUTERS',
  location: 'Kakinada, Andhra Pradesh',
  address: '[ACTUAL ADDRESS]',
  phone: '[PHONE]',
  email: '[EMAIL]',
  hours: '[BUSINESS HOURS]',
};

const services = [
  ['01', 'COMPUTER SALES', 'Systems selected around the way you work, create and compute.'],
  ['02', 'CUSTOM PC BUILDING', 'Purpose-built machines assembled with precision and care.'],
  ['03', 'LAPTOPS & WORKSTATIONS', 'Reliable technology for home, business and professional work.'],
  ['04', 'COMPUTER REPAIR', 'Diagnosis, restoration and technical support for everyday systems.'],
  ['05', 'LAPTOP REPAIR', 'Careful service for hardware, software and performance issues.'],
  ['06', 'PERIPHERAL SUPPORT', 'Printers, displays, accessories and the details that complete a setup.'],
];

const journey = [
  ['FOUNDATION', '[FOUNDING YEAR]', '[FOUNDING STORY]'],
  ['EARLY YEARS', '[EARLY BUSINESS]', '[EARLY YEARS STORY]'],
  ['GROWTH', '[MAJOR MILESTONE]', '[GROWTH STORY]'],
  ['EVOLUTION', '[TECHNOLOGY EVOLUTION]', '[EVOLUTION STORY]'],
  ['TODAY', '[CURRENT ERA]', '[CURRENT STORY]'],
  ['THE FUTURE', '[FUTURE VISION]', '[FUTURE STORY]'],
];

function Part({ type, position, rotation = [0, 0, 0], scale = 1, color = '#4f7fff', glow = false }) {
  const material = (
    <meshStandardMaterial
      color={color}
      metalness={0.8}
      roughness={0.24}
      emissive={glow ? color : '#000000'}
      emissiveIntensity={glow ? 1.4 : 0}
    />
  );

  if (type === 'board') {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <mesh>
          <boxGeometry args={[2.9, 0.12, 2]} />
          {material}
        </mesh>
        {[-1, -0.3, 0.4, 1.1].map((x) => (
          <mesh key={x} position={[x, 0.09, 0]}>
            <boxGeometry args={[0.42, 0.025, 1.3]} />
            <meshStandardMaterial color="#a7bddf" metalness={0.75} roughness={0.35} />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === 'chip') {
    return (
      <mesh position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[0.68, 0.18, 0.68]} />
        {material}
      </mesh>
    );
  }

  if (type === 'ram') {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <mesh>
          <boxGeometry args={[0.16, 1.15, 0.48]} />
          <meshStandardMaterial color="#d4def0" metalness={0.72} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.02, 0.03]}>
          <boxGeometry args={[0.1, 0.82, 0.03]} />
          <meshStandardMaterial color="#5291ff" emissive="#1c5cff" emissiveIntensity={0.8} />
        </mesh>
      </group>
    );
  }

  if (type === 'gpu') {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <mesh>
          <boxGeometry args={[2.4, 0.35, 0.85]} />
          {material}
        </mesh>
        <mesh position={[0.7, 0.2, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.08, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#111923" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.25, 0.2, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.08, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#111923" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    );
  }

  if (type === 'fan') {
    return (
      <group position={position} rotation={rotation} scale={scale}>
        <mesh>
          <cylinderGeometry args={[0.72, 0.72, 0.12, 32]} />
          <meshStandardMaterial color="#172333" metalness={0.7} roughness={0.35} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, i * Math.PI / 2]} position={[0, 0.08, 0]}>
            <boxGeometry args={[0.12, 1.12, 0.04]} />
            <meshStandardMaterial color="#6d9cff" emissive="#3569e8" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      {material}
    </mesh>
  );
}

function ComputerAssembly({ progress, reducedMotion }) {
  const group = useRef();
  const fan = useRef();

  const part = (name, start, end, options = {}) => {
    const p = reducedMotion ? 1 : THREE.MathUtils.smoothstep(progress, options.from ?? 0, options.to ?? 1);
    return {
      key: name,
      position: start.map((v, i) => THREE.MathUtils.lerp(v, end[i], p)),
      rotation: options.rotation || [0, 0, 0],
      scale: options.scale || 1,
      color: options.color,
      type: options.type,
      glow: progress > 0.65 && options.glow,
    };
  };

  const parts = useMemo(() => [
    part('board', [0, -1.6, 0], [0, -0.3, 0], { type: 'board', from: 0.05, to: 0.35, color: '#1d6e9c' }),
    part('chip', [-1.8, 1.5, 0], [-0.35, -0.12, 0.05], { type: 'chip', from: 0.12, to: 0.5, color: '#c5d1e5' }),
    part('ram1', [2.1, 1.1, 0], [0.15, 0.18, 0], { type: 'ram', from: 0.2, to: 0.52, color: '#8ca3c4' }),
    part('ram2', [2.6, 1.7, 0], [0.42, 0.18, 0], { type: 'ram', from: 0.23, to: 0.55, color: '#8ca3c4' }),
    part('gpu', [-2.8, -0.4, 0], [0, -0.02, 0.25], { type: 'gpu', from: 0.27, to: 0.63, color: '#26364c' }),
    part('fan', [2.4, -1.5, 0.5], [0, 0.15, 0.72], { type: 'fan', from: 0.34, to: 0.7, color: '#182b4d' }),
    part('psu', [-2.5, 1.2, -0.7], [-0.3, -0.7, -0.6], { type: 'box', from: 0.38, to: 0.76, color: '#59677c' }),
    part('ssd', [2.2, -0.9, -0.5], [0.75, -0.05, 0.1], { type: 'box', from: 0.4, to: 0.72, scale: [0.8, 0.08, 0.28], color: '#9bafc9' }),
  ], [progress, reducedMotion]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.08;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, (progress - 0.5) * 0.28, 0.04);
    if (fan.current) fan.current.rotation.z += delta * (progress > 0.68 ? 5 : 0.3);
  });

  return (
    <group ref={group} scale={window.innerWidth < 700 ? 0.72 : 1}>
      {parts.map((item) => (
        <group key={item.key} ref={item.type === 'fan' ? fan : null}>
          <Part {...item} />
        </group>
      ))}
      <mesh position={[0, -0.34, 0.25]} scale={[2.1, 1.8, 0.12]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#07101e" metalness={0.92} roughness={0.2} transparent opacity={progress > 0.55 ? 0.88 : 0.14} />
      </mesh>
      <mesh position={[0, 0.42, 0.28]} scale={[1.6, 0.8, 0.05]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#09182c" emissive="#0c64ff" emissiveIntensity={progress > 0.7 ? 1.2 : 0.15} transparent opacity={progress > 0.55 ? 0.55 : 0.05} />
      </mesh>
    </group>
  );
}

function Scene({ progress, reducedMotion }) {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <PerspectiveCamera makeDefault position={[0, 0.4, 7.2]} fov={42} />
      <color attach="background" args={['#05070b']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={3} color="#dce9ff" />
      <pointLight position={[-4, 1, 3]} intensity={8} distance={8} color="#1d73ff" />
      <pointLight position={[4, -2, -2]} intensity={5} distance={7} color="#5eafff" />
      <Sparkles count={90} scale={10} size={1.4} speed={0.25} color="#9ec5ff" />
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.2}>
        <ComputerAssembly progress={progress} reducedMotion={reducedMotion} />
      </Float>
      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}

function Nav({ onMenu }) {
  return (
    <header className="nav">
      <a className="brand" href="#top">
        <span className="brand-mark">SP</span>
        <span>SRI PAVAN<br />COMPUTERS</span>
      </a>
      <nav>
        <a href="#journey">OUR JOURNEY</a>
        <a href="#services">SERVICES</a>
        <a href="#philosophy">PHILOSOPHY</a>
        <a href="#contact">CONTACT</a>
      </nav>
      <a className="nav-cta" href="#contact">VISIT US <span>↗</span></a>
      <button className="menu-button" onClick={onMenu} aria-label="Open navigation">MENU</button>
    </header>
  );
}

function App() {
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main id="top">
      <div className="scene-fixed" aria-hidden="true">
        <Scene progress={progress} reducedMotion={reducedMotion} />
      </div>

      <Nav onMenu={() => setMenu(true)} />

      {menu && (
        <div className="mobile-menu">
          <button onClick={() => setMenu(false)}>CLOSE ×</button>
          {['journey', 'services', 'philosophy', 'contact'].map((id) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{id.replace('-', ' ').toUpperCase()}</a>
          ))}
        </div>
      )}

      <section className="hero">
        <div className="eyebrow"><span /> FROM COMPONENTS TO COMPUTING</div>
        <div className="hero-copy">
          <p className="kicker">A TECHNOLOGY LEGACY IN MOTION</p>
          <h1>{company.name}</h1>
          <p className="hero-subtitle">Where technology meets trust.</p>
          <p className="hero-note">A journey built on technology, service and generations of trust.</p>
        </div>
        <div className="scroll-cue"><span /> SCROLL TO ASSEMBLE</div>
        <div className="progress-line"><i style={{ width: `${progress * 100}%` }} /></div>
      </section>

      <section className="statement">
        <p className="eyebrow">THE IDEA</p>
        <h2>A computer begins as individual components. A company begins with an idea.</h2>
        <p className="body-copy">As the machine takes shape, so does the story of SRI PAVAN COMPUTERS: people, experience and technology coming together with purpose.</p>
      </section>

      <section id="journey" className="journey section-shell">
        <div className="section-heading">
          <p className="eyebrow">01 / OUR JOURNEY</p>
          <h2>Built over time.<br /><em>Defined by trust.</em></h2>
        </div>
        <div className="timeline">
          {journey.map(([title, year, story], index) => (
            <article className="timeline-item" key={title}>
              <span className="timeline-number">0{index + 1}</span>
              <div className="timeline-dot" />
              <p>{year}</p>
              <h3>{title}</h3>
              <span>{story}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="museum">
        <div className="museum-copy">
          <p className="eyebrow">02 / TECHNOLOGY EVOLUTION</p>
          <h2>Technology never<br /><em>stands still.</em></h2>
          <p className="body-copy">From the machines of yesterday to the systems of tomorrow, every generation teaches us something about progress.</p>
        </div>
        <div className="evolution-object">
          <div className="crt" />
          <div className="modern-board">
            <span /><span /><span /><span />
          </div>
          <p>YESTERDAY <b>→</b> TOMORROW</p>
        </div>
      </section>

      <section id="services" className="services section-shell">
        <div className="section-heading">
          <p className="eyebrow">03 / WHAT WE DO</p>
          <h2>Technology is only<br /><em>powerful when it works for you.</em></h2>
        </div>
        <div className="service-list">
          {services.map(([number, title, text]) => (
            <article key={number} className="service-row">
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <b>↗</b>
            </article>
          ))}
        </div>
      </section>

      <section className="trust">
        <p className="eyebrow">04 / BUILT ON TRUST</p>
        <h2>Real relationships.<br /><em>Real responsibility.</em></h2>
        <div className="trust-grid">
          <div><strong>[YEARS]</strong><span>OF EXPERIENCE</span></div>
          <div><strong>[PEOPLE]</strong><span>BEHIND THE WORK</span></div>
          <div><strong>[MILESTONES]</strong><span>STILL TO BE WRITTEN</span></div>
        </div>
      </section>

      <section id="philosophy" className="philosophy">
        <p className="eyebrow">05 / OUR PHILOSOPHY</p>
        <div className="word-stack">
          {['LISTEN.', 'UNDERSTAND.', 'BUILD.', 'REPAIR.', 'SUPPORT.', 'DELIVER.', 'TRUST.'].map((word) => <span key={word}>{word}</span>)}
        </div>
      </section>

      <section className="future">
        <div>
          <p className="eyebrow">06 / THE NEXT CHAPTER</p>
          <h2>Technology changes.<br /><em>Our commitment doesn’t.</em></h2>
          <p className="body-copy">[FUTURE VISION: Add the actual goals and direction of SRI PAVAN COMPUTERS here.]</p>
        </div>
        <div className="hologram">
          <span /><span /><span /><span />
          <b>SRI PAVAN<br />SYSTEM / 01</b>
        </div>
      </section>

      <section id="contact" className="contact section-shell">
        <div>
          <p className="eyebrow">07 / BEGIN A CONVERSATION</p>
          <h2>Built with technology.<br /><em>Driven by trust.</em></h2>
        </div>
        <div className="contact-grid">
          <div><span>LOCATION</span><p>{company.location}<br />{company.address}</p></div>
          <div><span>CONTACT</span><p>{company.phone}<br />{company.email}</p></div>
          <div><span>HOURS</span><p>{company.hours}</p></div>
          <div><span>MAP</span><p>[GOOGLE MAP EMBED]</p></div>
        </div>
        <div className="contact-actions">
          <a href="#contact">CALL US ↗</a>
          <a href="#contact">WHATSAPP ↗</a>
          <a href="#contact">GET DIRECTIONS ↗</a>
        </div>
      </section>

      <footer>
        <span>{company.name}</span>
        <span>© {new Date().getFullYear()} / TECHNOLOGY MEETS TRUST</span>
      </footer>
    </main>
  );
}

export default App;
EOF