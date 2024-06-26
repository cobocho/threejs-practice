import './style.css';
import * as Three from 'three';

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

	function handleResize() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.render(scene, camera);
	}

	function render() {
		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	render();

	window.addEventListener('resize', handleResize);
}

window.addEventListener('load', () => {
	init();
});
