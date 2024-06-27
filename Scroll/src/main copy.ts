import GUI from 'lil-gui';
import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

async function init() {
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
		canvas: document.querySelector('canvas')!,
	});
	const gui = new GUI();
	const clock = new THREE.Clock();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	document.body.appendChild(renderer.domElement);

	const scene = new THREE.Scene();

	scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500);

	gui.add(scene.fog, 'near', 0, 100, 0.01);
	gui.add(scene.fog, 'far', 100, 1000, 10);

	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		500,
	);
	camera.position.set(0, 25, 150);

	const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150);

	const WAVE_HEIGHT = 2.5;

	const initialZPositions: Array<number> = [];

	for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
		const z =
			waveGeometry.attributes.position.getZ(i) +
			(Math.random() - 0.5) * WAVE_HEIGHT;
		initialZPositions.push(z);
		waveGeometry.attributes.position.setZ(i, z);
	}

	const waveMaterial = new THREE.MeshStandardMaterial({
		color: 0x00ffff,
	});
	const wave = new THREE.Mesh(waveGeometry, waveMaterial) as THREE.Mesh<
		THREE.PlaneGeometry,
		THREE.MeshStandardMaterial,
		THREE.Object3DEventMap
	> & { update: () => void };
	wave.rotation.x = -Math.PI / 2;
	wave.receiveShadow = true;

	wave.update = () => {
		const elapsedTime = clock.getElapsedTime();

		for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
			const z =
				initialZPositions[i] + Math.sin(elapsedTime * 3 + i ** 2) * WAVE_HEIGHT;
			waveGeometry.attributes.position.setZ(i, z);
		}
		waveGeometry.attributes.position.needsUpdate = true;
	};

	scene.add(wave);

	const pointLight = new THREE.PointLight(0xffffff, 500, 1000, 1.6);
	pointLight.position.set(40, 15, 15);
	pointLight.castShadow = true;
	pointLight.shadow.mapSize.width = 1024;
	pointLight.shadow.mapSize.height = 1024;
	pointLight.shadow.radius = 10;

	scene.add(pointLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
	directionalLight.position.set(15, 15, 15);
	directionalLight.castShadow = true;
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.radius = 10;

	scene.add(directionalLight);

	const gltfLoader = new GLTFLoader();
	const gltf = await gltfLoader.loadAsync('models/ship/scene.gltf');
	const ship = gltf.scene as THREE.Group<THREE.Object3DEventMap> & {
		update: () => void;
	};
	ship.scale.set(40, 40, 40);
	ship.rotation.y = Math.PI;

	ship.update = () => {
		const elapsedTime = clock.getElapsedTime();
		ship.position.y = Math.sin(elapsedTime) * WAVE_HEIGHT;
	};
	ship.castShadow = true;
	ship.traverse((obj) => {
		if (obj instanceof THREE.Mesh) {
			obj.castShadow = true;
		}
	});

	scene.add(ship);

	function handleResize() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.render(scene, camera);
	}

	function render() {
		renderer.render(scene, camera);

		wave.update();
		ship.update();
		camera.lookAt(ship.position);

		requestAnimationFrame(render);
	}

	render();

	window.addEventListener('resize', handleResize);
}

window.addEventListener('load', () => {
	init();
});
