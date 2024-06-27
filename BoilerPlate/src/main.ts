import './style.css';

import * as THREE from 'three';

window.addEventListener('load', function () {
	init();
});

async function init() {
	const canvas = document.querySelector('#canvas')!;

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas,
	});

	renderer.setSize(window.innerWidth, window.innerHeight);

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		500,
	);

	camera.position.set(0, 25, 150);

	render();

	function render() {
		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	function handleResize() {
		camera.aspect = window.innerWidth / window.innerHeight;

		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

		renderer.render(scene, camera);
	}

	window.addEventListener('resize', handleResize);
}
