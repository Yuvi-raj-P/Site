import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.threejs-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(1, 1, 1).normalize();
scene.add(light);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5, // Reduced strength
    0.4, // Radius
    0.85 // Threshold
);
composer.addPass(bloomPass);

const finalPass = new ShaderPass(
    new THREE.ShaderMaterial({
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: composer.renderTarget2.texture }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D baseTexture;
            uniform sampler2D bloomTexture;
            varying vec2 vUv;
            void main() {
                vec4 bloom = texture2D(bloomTexture, vUv);
                gl_FragColor = texture2D(baseTexture, vUv) + vec4(1.0, 0.0, 1.0, 0.5) * bloom; // Subtle purple glow
            }
        `,
        transparent: true,
        defines: {}
    }), 'baseTexture'
);
finalPass.needsSwap = true;
composer.addPass(finalPass);

// Mouse position
const mouse = new THREE.Vector2();
const targetRotation = new THREE.Vector2();
const currentRotation = new THREE.Vector2();

// Update mouse position
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    targetRotation.x = mouse.y * 0.1;
    targetRotation.y = mouse.x * 0.1;
}

window.addEventListener('mousemove', onMouseMove, false);

// Function to create stars with twinkle effect
function createStars() {
    const starGeometry = new THREE.SphereGeometry(0.5, 8, 8); // Fixed radius and reduced segments for better performance
    const starMaterial = new THREE.ShaderMaterial({
        uniforms: {
            opacity: { value: 0.0 },
            glowColor: { value: new THREE.Color(0.5, 0.5, 1.0) } // Light purple and blue
        },
        vertexShader: `
            uniform float opacity;
            varying float vOpacity;
            void main() {
                vOpacity = opacity;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float vOpacity;
            void main() {
                vec3 color = mix(glowColor, vec3(1.0), 0.5); // White core with glow
                gl_FragColor = vec4(color * 2.0, vOpacity); // Increase intensity
            }
        `,
        transparent: true
    });

    const stars = [];
    for (let i = 0; i < 2000; i++) { // Increase the number of stars to 2000
        const star = new THREE.Mesh(starGeometry, starMaterial.clone());

        star.position.x = Math.random() * 2000 - 1000;
        star.position.y = Math.random() * 2000 - 1000;
        star.position.z = Math.random() * 2000 - 1000;

        scene.add(star);
        stars.push(star);
    }

    // Animate the opacity of the stars
    let opacity = 0.0;
    const fadeIn = () => {
        if (opacity < 1.0) {
            opacity += 0.01;
            stars.forEach(star => {
                star.material.uniforms.opacity.value = opacity;
            });
            requestAnimationFrame(fadeIn);
        } else {
            twinkle(); // Start twinkle animation after fade-in is complete
        }
    };

    // Twinkle animation
    const twinkle = () => {
        stars.forEach(star => {
            star.material.uniforms.opacity.value = 0.5 + 0.5 * Math.sin(Date.now() * 0.001 + star.position.x);
        });
        requestAnimationFrame(twinkle);
    };

    // Delay the fade-in animation
    setTimeout(() => {
        fadeIn();
    }, 2000); // Delay of 2000 milliseconds (2 seconds)
}

// Load SVGs
window.addEventListener('load', function() {
    const firstSvg = document.querySelector('.svg-elem-1');
    const secondSvg = document.querySelector('.svg-elem-2');
    const dotSvg = document.querySelector('.hidden.circle');

    // Original SVG animations
    firstSvg.classList.add('animate');

    setTimeout(() => {
        dotSvg.classList.add('fade-in');
    }, 4000);

    firstSvg.addEventListener('animationend', function() {
        console.log('First animation ended');
        setTimeout(() => {
            console.log('Adding animate class to second SVG');
            secondSvg.classList.add('animate');
            document.querySelector('.hidden.spacing').classList.remove('hidden');

            // Add stars after the second SVG animation
            createStars();
        }, 800);
    });
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Camera movement
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
    camera.position.x = currentRotation.y * 2;
    camera.position.y = currentRotation.x * 2;
    camera.lookAt(scene.position);

    composer.render();
}

animate();

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
