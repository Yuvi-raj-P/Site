import * as THREE from "https://esm.sh/three";
import { EffectComposer } from "https://esm.sh/three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "https://esm.sh/three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://esm.sh/three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "https://esm.sh/three/addons/postprocessing/OutputPass.js";

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a plane geometry to represent the water surface
const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: true });
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Position the camera
camera.position.z = 50;
camera.position.y = 50;
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Simple wave effect
    const time = Date.now() * 0.001;
    for (let i = 0; i < geometry.vertices.length; i++) {
        const vertex = geometry.vertices[i];
        vertex.z = Math.sin(vertex.x * 0.1 + time) * 2 + Math.sin(vertex.y * 0.1 + time) * 2;
    }
    geometry.verticesNeedUpdate = true;

    renderer.render(scene, camera);
}
animate();
