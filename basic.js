import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { SVGLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/SVGLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('.threejs-canvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 5;

    const loadSVG = (url, position, scale) => {
        const loader = new SVGLoader();
        loader.load(url, (data) => {
            const paths = data.paths;
            const group = new THREE.Group();
            group.position.copy(position);
            group.scale.multiplyScalar(scale);

            paths.forEach((path) => {
                const material = new THREE.MeshBasicMaterial({
                    color: 0xffffff, // White color for visibility against black background
                    side: THREE.DoubleSide,
                    depthWrite: false
                });

                const shapes = SVGLoader.createShapes(path);
                shapes.forEach((shape) => {
                    const geometry = new THREE.ShapeGeometry(shape);
                    const mesh = new THREE.Mesh(geometry, material);
                    group.add(mesh);
                });
            });

            scene.add(group);
        });
    };

    loadSVG('YuvrajText.svg', new THREE.Vector3(-2, 1, 0), 5);

    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();
});