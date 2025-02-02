import * as THREE from "https://esm.sh/three";
import { EffectComposer } from "https://esm.sh/three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "https://esm.sh/three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://esm.sh/three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "https://esm.sh/three/addons/postprocessing/OutputPass.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color('black');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, 0.4, 0.85
);
composer.addPass(bloomPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

function createStars() {
    const starCount = 4000;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
        sizes[i] = Math.random() * 1.4 + 1.4;  
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            fadeDuration: { value: 5.0 }, 
            glowColor: { value: new THREE.Color(0.3, 1, 2.0) }
        },
        vertexShader: `
            attribute float size;
            varying float vSize;
            uniform float time;
            void main() {
                vSize = size;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            uniform float time;
            uniform float fadeDuration;
            varying float vSize;
            void main() {
                vec2 center = gl_PointCoord - 0.2;
                float dist = length(center);
                float alpha = smoothstep(0.5, 0.0, dist);
                float twinkle = sin(time * 5.0 + vSize * 10.0) * 0.5 + 0.5;
                vec3 color = mix(vec3(1.0), glowColor, twinkle);
                float fadeFactor = min(time / fadeDuration, 1.0); // Calculate fade-in factor
                gl_FragColor = vec4(color, alpha * twinkle * fadeFactor); // Apply fade-in factor to alpha
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });

    return new THREE.Points(geometry, material);
}

const stars = createStars();
scene.add(stars);

document.addEventListener('mousemove', onMouseMove, false);

let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

function animate(time) {
    requestAnimationFrame(animate);
    stars.material.uniforms.time.value = time * 0.001;
    targetX = mouseX * 0.2;
    targetY = mouseY * 0.2;

    camera.position.x += (targetX - camera.position.x) * 0.2;
    camera.position.y += (-targetY - camera.position.y) * 0.2;

    camera.lookAt(scene.position);

    composer.render();
}

animate(0);

window.addEventListener('load', function() {
    
    const firstSvg = document.querySelector('.svg-elem-1');
    const secondSvg = document.querySelector('.svg-elem-2');
    const dotSvg = document.querySelector('.hidden.circle');

    firstSvg.classList.remove('hidden');
    firstSvg.classList.add('animate');

    setTimeout(() => {
        dotSvg.classList.remove('hidden');
        dotSvg.classList.add('fade-in');
    }, 4000);

    firstSvg.addEventListener('animationend', function() {
        console.log('First animation ended');
        setTimeout(() => {
            console.log('Adding animate class to second SVG');
            secondSvg.classList.add('animate');
            document.querySelector('.hidden.spacing').classList.remove('hidden');
					setTimeout(() => {
                document.querySelector('.fade').classList.add('fade-out');
            }, 2500);      
        }, 800);
    });
});
