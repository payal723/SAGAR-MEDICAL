// Premium Three.js Animation for Shree Sagar Medical Store
let scene, camera, renderer;
let particles, medicalCrosses = [], pills = [], molecules = [];
let mouseX = 0, mouseY = 0, scrollY = 0;

function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 40);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('canvas-bg'), 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Enhanced particle system with medical theme
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
        // Create flowing particle field
        const radius = Math.random() * 80 + 20;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 60;
        
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        // Medical green and blue colors with variations
        const colorChoice = Math.random();
        const color = new THREE.Color();
        if (colorChoice < 0.5) {
            color.setHSL(0.45, 0.8, 0.6); // Medical green
        } else {
            color.setHSL(0.55, 0.8, 0.5); // Medical blue
        }

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = Math.random() * 0.2 + 0.1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Create 3D medical crosses
    for (let i = 0; i < 15; i++) {
        const crossGroup = new THREE.Group();
        
        // Horizontal bar of cross
        const hBarGeometry = new THREE.BoxGeometry(2, 0.2, 0.1);
        const hBarMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x10b981,
            emissive: 0x10b981,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.7
        });
        const hBar = new THREE.Mesh(hBarGeometry, hBarMaterial);
        
        // Vertical bar of cross
        const vBarGeometry = new THREE.BoxGeometry(0.2, 2, 0.1);
        const vBar = new THREE.Mesh(vBarGeometry, hBarMaterial);
        
        crossGroup.add(hBar, vBar);
        
        // Position in sphere
        const radius = Math.random() * 60 + 20;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 40;
        
        crossGroup.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        
        crossGroup.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.8 + 0.4,
            originalY: crossGroup.position.y
        };
        
        medicalCrosses.push(crossGroup);
        scene.add(crossGroup);
    }

    // Create floating pill capsules
    for (let i = 0; i < 12; i++) {
        const pill = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.5, 1.5, 4, 8),
            new THREE.MeshPhysicalMaterial({
                color: i % 2 === 0 ? 0x06b6d4 : 0x10b981,
                emissive: i % 2 === 0 ? 0x06b6d4 : 0x10b981,
                emissiveIntensity: 0.3,
                metalness: 0.7,
                roughness: 0.3,
                transparent: true,
                opacity: 0.8
            })
        );
        
        pill.position.set(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 40
        );
        
        pill.userData = {
            rotationAxis: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize(),
            rotationSpeed: Math.random() * 0.02 + 0.01,
            floatSpeed: Math.random() * 0.6 + 0.4,
            originalPosition: pill.position.clone(),
            pulseSpeed: Math.random() * 2 + 1
        };
        
        pills.push(pill);
        scene.add(pill);
    }

    // Create molecular structures
    for (let i = 0; i < 8; i++) {
        const moleculeGroup = new THREE.Group();
        
        // Central atom
        const centerAtom = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 32, 32),
            new THREE.MeshPhysicalMaterial({
                color: 0x3b82f6,
                emissive: 0x3b82f6,
                emissiveIntensity: 0.4,
                metalness: 0.9,
                roughness: 0.1
            })
        );
        moleculeGroup.add(centerAtom);
        
        // Orbiting atoms
        for (let j = 0; j < 3; j++) {
            const orbitAtom = new THREE.Mesh(
                new THREE.SphereGeometry(0.4, 16, 16),
                new THREE.MeshPhysicalMaterial({
                    color: 0x10b981,
                    emissive: 0x10b981,
                    emissiveIntensity: 0.5,
                    metalness: 0.8,
                    roughness: 0.2
                })
            );
            
            const angle = (j / 3) * Math.PI * 2;
            orbitAtom.position.set(Math.cos(angle) * 3, 0, Math.sin(angle) * 3);
            moleculeGroup.add(orbitAtom);
        }
        
        moleculeGroup.position.set(
            (Math.random() - 0.5) * 70,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 35
        );
        
        moleculeGroup.userData = {
            orbitSpeed: Math.random() * 0.02 + 0.01,
            originalPosition: moleculeGroup.position.clone(),
            floatSpeed: Math.random() * 0.5 + 0.3
        };
        
        molecules.push(moleculeGroup);
        scene.add(moleculeGroup);
    }

    // Premium lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0x10b981, 3, 200);
    mainLight.position.set(0, 0, 50);
    scene.add(mainLight);

    const accentLight1 = new THREE.PointLight(0x06b6d4, 2, 150);
    accentLight1.position.set(30, 30, 30);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0x3b82f6, 2, 150);
    accentLight2.position.set(-30, -30, 30);
    scene.add(accentLight2);

    // Mouse interaction
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    const deltaTime = 0.016; // Approximate 60fps

    // Animate particles with wave motion
    particles.rotation.y = time * 0.03;
    particles.rotation.x = Math.sin(time * 0.1) * 0.1;
    
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time * 2 + positions[i] * 0.01) * 0.02;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Animate medical crosses
    medicalCrosses.forEach((cross, i) => {
        cross.rotation.x += cross.userData.rotationSpeed.x;
        cross.rotation.y += cross.userData.rotationSpeed.y;
        cross.rotation.z += cross.userData.rotationSpeed.z;
        
        cross.position.y = cross.userData.originalY + Math.sin(time * cross.userData.floatSpeed + i) * 3;
    });

    // Animate pills with rotation and floating
    pills.forEach((pill, i) => {
        pill.rotateOnAxis(pill.userData.rotationAxis, pill.userData.rotationSpeed);
        pill.position.y = pill.userData.originalPosition.y + Math.sin(time * pill.userData.floatSpeed + i) * 2;
        
        // Pulsing effect
        const scale = 1 + Math.sin(time * pill.userData.pulseSpeed + i) * 0.15;
        pill.scale.set(scale, scale, scale);
    });

    // Animate molecules with orbital motion
    molecules.forEach((molecule, i) => {
        molecule.rotation.y += molecule.userData.orbitSpeed;
        molecule.position.y = molecule.userData.originalPosition.y + Math.sin(time * molecule.userData.floatSpeed + i) * 2;
        
        // Orbit the small atoms
        molecule.children.slice(1).forEach((atom, j) => {
            const angle = (time * molecule.userData.orbitSpeed * 5) + (j / 3) * Math.PI * 2;
            atom.position.x = Math.cos(angle) * 3;
            atom.position.z = Math.sin(angle) * 3;
        });
    });

    // Smooth camera movement
    camera.position.x += (mouseX * 8 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 8 - camera.position.y) * 0.05;
    camera.position.z = 40 + scrollY * 0.015;

    // Dynamic lighting
    mainLight.position.x = Math.sin(time * 0.5) * 15;
    mainLight.position.y = Math.cos(time * 0.3) * 15;
    
    accentLight1.position.x = Math.sin(time * 0.7 + Math.PI) * 25;
    accentLight1.position.y = Math.cos(time * 0.4) * 25;
    
    accentLight2.position.x = Math.cos(time * 0.6) * 25;
    accentLight2.position.y = Math.sin(time * 0.5 + Math.PI) * 25;

    renderer.render(scene, camera);
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// GSAP Animations
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations with premium timing
    gsap.timeline()
        .from('.hero-title', { 
            opacity: 0, 
            y: 80, 
            duration: 1.5, 
            ease: 'power4.out' 
        })
        .from('.hero-description', { 
            opacity: 0, 
            y: 50, 
            duration: 1.2, 
            ease: 'power4.out' 
        }, '-=1')
        .from('.features-grid', { 
            opacity: 0, 
            y: 50, 
            duration: 1.2, 
            ease: 'power4.out' 
        }, '-=0.8')
        .from('.hero-buttons', { 
            opacity: 0, 
            y: 50, 
            duration: 1.2, 
            ease: 'power4.out' 
        }, '-=0.6')
        .from('.store-card', { 
            opacity: 0, 
            scale: 0.7, 
            duration: 1.5, 
            ease: 'back.out(1.7)' 
        }, '-=1.2');

    // Service cards with staggered animation
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            duration: 1,
            delay: i * 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // About section animations
    gsap.from('.about-text > *', {
        opacity: 0,
        x: -50,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.exp-circle', {
        opacity: 0,
        scale: 0,
        duration: 1.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Contact section
    gsap.from('.contact-info > *', {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.from('.location-card', {
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    animate();
    initGSAP();
    
    window.addEventListener('resize', handleResize);
});