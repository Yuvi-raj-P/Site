import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('.threejs-canvas'),
    alpha: true 
  });
renderer.setSize(window.innerWidth, window.innerHeight);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// Load the 3D model
const loader = new GLTFLoader();
loader.load('leaf.glb', function (gltf) {
    scene.add(gltf.scene);
}, undefined, function (error) {
    console.error(error);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('load', function() {
    const firstSvg = document.querySelector('.svg-elem-1');
    const PLayer = document.querySelector('.hidden.spacing');
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
            PLayer.classList.remove('hidden');
        }, 50);
    });
});