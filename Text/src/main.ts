import {
	DragControls,
	EffectComposer,
	FontLoader,
	OrbitControls,
	RenderPass,
	UnrealBloomPass,
} from 'three/examples/jsm/Addons.js';
import './style.css';
import * as Three from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import GUI from 'lil-gui';

async function init() {
	const renderer = new Three.WebGLRenderer({
		antialias: true,
	});
	renderer.shadowMap.enabled = true;

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	const gui = new GUI();

	const scene = new Three.Scene();

	const camera = new Three.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		500,
	);

	new OrbitControls(camera, renderer.domElement);

	camera.position.set(0, 0, 5);

	// text
	const fontLoader = new FontLoader().setPath('assets/fonts/');
	const font = await fontLoader.loadAsync('kor.json');
	const textGeometry = new TextGeometry('Hello World!', {
		font,
		size: 0.5,
		height: 0.1,
		bevelEnabled: true,
		bevelSegments: 5,
		bevelThickness: 0.02,
		bevelSize: 0.02,
	});
	textGeometry.center();
	const textMaterial = new Three.MeshPhongMaterial();
	const text = new Three.Mesh(textGeometry, textMaterial);
	text.castShadow = true;
	scene.add(text);

	// texture
	const textureLoader = new Three.TextureLoader().setPath('assets/textures/');
	const texture = await textureLoader.loadAsync('holographic.jpeg');
	textMaterial.map = texture;

	// Plain
	const planeGeometry = new Three.PlaneGeometry(2000, 2000);
	const planeMaterial = new Three.MeshPhongMaterial({ color: 0x000000 });
	const plain = new Three.Mesh(planeGeometry, planeMaterial);
	plain.position.z = -10;
	plain.receiveShadow = true;
	scene.add(plain);

	// Ambient light
	const ambientLight = new Three.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);

	const gradientTexture = await textureLoader.loadAsync('gradient.jpg');

	// Spot light
	const spotLight = new Three.SpotLight(
		0xffffff,
		20,
		30,
		Math.PI * 0.15,
		0.2,
		0.5,
	);
	spotLight.map = gradientTexture;
	spotLight.target.position.set(0, 0, -3);
	spotLight.position.set(0, 0, 3);
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 512 * 2;
	spotLight.shadow.mapSize.height = 512 * 2;
	spotLight.shadow.radius = 10;

	window.addEventListener('mousemove', (e) => {
		const x = (e.clientX / window.innerWidth - 0.5) * 5;
		const y = -(e.clientY / window.innerHeight - 0.5) * 5;

		spotLight.target.position.set(x, y, -3);
		spotLight.position.set(x, y, 3);
	});

	scene.add(spotLight, spotLight.target);

	const spotLightHelper = new Three.SpotLightHelper(spotLight);

	const composer = new EffectComposer(renderer);
	const renderPass = new RenderPass(scene, camera);
	const unrealBloomPass = new UnrealBloomPass(
		new Three.Vector2(window.innerWidth, window.innerHeight),
		0.8,
		1,
		0,
	);
	composer.addPass(renderPass);
	composer.addPass(unrealBloomPass);

	const spotLightFolder = gui.addFolder('spot light');

	spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.01);
	spotLightFolder.add(spotLight.position, 'z', 1, 10, 1);
	spotLightFolder.add(spotLight, 'distance', 1, 30, 0.01);
	spotLightFolder.add(spotLight, 'decay', 0, 10, 0.01);
	spotLightFolder.add(spotLight, 'penumbra', 0, 1, 0.01);
	spotLightFolder.add(spotLight.shadow, 'radius', 0, 20, 0.01);

	function handleResize() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.render(scene, camera);
	}

	function render() {
		composer.render();

		spotLightHelper.update();
		requestAnimationFrame(render);
	}

	render();

	window.addEventListener('resize', handleResize);
}

window.addEventListener('load', () => {
	init();
});
