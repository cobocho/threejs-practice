import * as THREE from 'three';

interface FireworkProps {
	x: number;
	y: number;
}

type Particle = {
	deltaX: number;
	deltaY: number;
	deltaZ: number;
	theta: number;
	phi: number;
} & THREE.Vector3;

export class Firework {
	particles: Particle[] = [];

	points: THREE.Points;

	constructor({ x, y }: FireworkProps) {
		const count = 1000 + Math.round(Math.random() * 5000);
		const velocity = 10 + Math.random() * 10;

		const particlesGeometry = new THREE.BufferGeometry();

		const particles = [];

		for (let i = 0; i < count; i++) {
			const particle = new THREE.Vector3(x, y, 0) as Particle;

			particle.theta = Math.random() * Math.PI * 2;
			particle.phi = Math.random() * Math.PI * 2;

			particle.deltaX =
				velocity * Math.sin(particle.theta) * Math.cos(particle.phi);
			particle.deltaY =
				velocity * Math.sin(particle.theta) * Math.sin(particle.phi);
			particle.deltaZ = velocity * Math.cos(particle.theta);

			particles.push(particle);
		}

		this.particles = particles;

		particlesGeometry.setFromPoints(particles);

		const textureLoader = new THREE.TextureLoader();

		const texture = textureLoader.load('/assets/textures/particle.png');

		const particlesMaterial = new THREE.PointsMaterial({
			size: 1,
			alphaMap: texture,
			transparent: true,
			depthWrite: false,
			color: new THREE.Color(Math.random(), Math.random(), Math.random()),
			blending: THREE.AdditiveBlending,
		});

		const points = new THREE.Points(particlesGeometry, particlesMaterial);

		this.points = points;
	}

	update() {
		const position = this.points.geometry.attributes.position;

		this.particles.forEach((_, i) => {
			const x = position.getX(i);
			const y = position.getY(i);
			const z = position.getZ(i);

			position.setX(i, x + this.particles[i].deltaX);
			position.setY(i, y + this.particles[i].deltaY);
			position.setZ(i, z + this.particles[i].deltaZ);
		});

		position.needsUpdate = true;
	}
}
