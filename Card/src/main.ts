import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css';
import * as Three from 'three';
import { Card } from './Card';
import GUI from 'lil-gui';
import gsap from 'gsap';

function init() {
	const renderer = new Three.WebGLRenderer({
		antialias: true,
		alpha: true,
	});
	renderer.shadowMap.enabled = true;

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const scene = new Three.Scene();
	const camera = new Three.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		500,
	);
	camera.position.set(0, 0, 25);

	const gui = new GUI();
	const cardFolder = gui.addFolder('Card');

	const COLORS = ['#ff6e6e', '#31e0c1', '#006fff', '#ffd732'];

	const card = new Card({
		width: 10,
		height: 15.8,
		radius: 0.5,
		color: COLORS[0],
	});
	card.mesh.rotation.z = Math.PI / 1.2;
	card.mesh.castShadow = true;

	gsap.to(card.mesh.rotation, {
		y: Math.PI * 5,
		duration: 1.5,
		ease: 'power1.out',
	});

	cardFolder
		.add(card.mesh.material, 'roughness')
		.min(0)
		.max(1)
		.step(0.01)
		.name('material.roughness');

	cardFolder
		.add(card.mesh.material, 'metalness')
		.min(0)
		.max(1)
		.step(0.01)
		.name('material.metalness');

	scene.add(card.mesh);

	const wallGeo = new Three.PlaneGeometry(100, 100);
	const wallMat = new Three.ShadowMaterial({
		color: 'grey',
	});
	const wall = new Three.Mesh(wallGeo, wallMat);
	wall.position.z = -10;
	wall.receiveShadow = true;

	scene.add(wall);

	const ambient = new Three.AmbientLight(0xffffff, 0.8);
	ambient.position.set(-5, -5, -5);
	scene.add(ambient);

	const directional1 = new Three.DirectionalLight(0xffffff, 3);
	const directional2 = directional1.clone();

	directional1.position.set(1, 1, 3);
	directional2.position.set(-1, -1, -3);

	scene.add(directional1, directional2);

	const spotLight = new Three.SpotLight(
		0xffffff,
		20,
		30,
		Math.PI * 0.35,
		0.2,
		0.5,
	);
	const spotLightHelper = new Three.SpotLightHelper(spotLight);

	spotLight.position.set(0, 0, 10);
	spotLight.shadow.mapSize.width = 512 * 2;
	spotLight.shadow.mapSize.height = 512 * 2;
	spotLight.shadow.radius = 10;
	scene.add(spotLight, spotLight.target, spotLightHelper);

	const spotLightFolder = gui.addFolder('spot light');

	spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.01);
	spotLightFolder.add(spotLight.position, 'x', 1, 10, 1);
	spotLightFolder.add(spotLight.position, 'y', 1, 10, 1);
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
		renderer.render(scene, camera);
		card.mesh.rotation.y += 0.01;
		spotLightHelper.update();

		requestAnimationFrame(render);
	}

	render();

	const $container = document.querySelector('.container')!;

	COLORS.forEach((color) => {
		const $colorButton = document.createElement('button');

		$colorButton.style.backgroundColor = color;
		$colorButton.style.width = '40px';
		$colorButton.style.height = '40px';
		$colorButton.style.borderRadius = '50%';
		$colorButton.style.border = 'none';
		$colorButton.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.4)';

		$container.appendChild($colorButton);
		$colorButton.addEventListener('click', () => {
			card.mesh.material.color = new Three.Color(color);
			gsap.to(card.mesh.rotation, {
				y: card.mesh.rotation.y + Math.PI * 2,
				duration: 0.5,
				ease: 'power1.out',
			});
		});
	});

	window.addEventListener('resize', handleResize);
}

window.addEventListener('load', () => {
	init();
});
