import GUI from 'lil-gui';
import './style.css';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function init() {
	const renderer = new Three.WebGLRenderer({
		antialias: true,
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const scene = new Three.Scene();
	const camera = new Three.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		500,
	);
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.autoRotate = true;
	controls.enableDamping = true;

	const cubeGeometry = new Three.IcosahedronGeometry(1);
	const cubeMaterial = new Three.MeshLambertMaterial({
		color: 'skyblue',
		emissive: '#111111',
	});
	const cube = new Three.Mesh(cubeGeometry, cubeMaterial);

	const skeletonGeometry = new Three.IcosahedronGeometry(2);
	const skeletonMaterial = new Three.MeshBasicMaterial({
		wireframe: true,
		transparent: true,
		opacity: 0.2,
		color: '#aaaaaa',
	});
	const skeleton = new Three.Mesh(skeletonGeometry, skeletonMaterial);

	scene.add(cube, skeleton);
	camera.position.z = 5;

	const directionalLight = new Three.DirectionalLight('#FFFFFF', 1);
	scene.add(directionalLight);

	const clock = new Three.Clock();

	function handleResize() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.render(scene, camera);
		controls.update();
	}

	function render() {
		renderer.render(scene, camera);
		controls.update();

		requestAnimationFrame(render);
	}

	render();

	window.addEventListener('resize', handleResize);

	const gui = new GUI();
	gui.add(cube.position, 'y', -3, 3);
}

window.addEventListener('load', () => {
	init();
});
