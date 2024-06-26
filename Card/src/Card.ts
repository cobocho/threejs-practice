import * as Three from 'three';

interface CardParams {
	width: number;
	height: number;
	radius: number;
	color: Three.ColorRepresentation;
}

export class Card {
	mesh: Three.Mesh;

	constructor({ width, height, radius, color }: CardParams) {
		const x = width / 2 - radius;
		const y = height / 2 - radius;

		const shape = new Three.Shape();

		shape
			.absarc(x, y, radius, Math.PI / 2, 0, true)
			.lineTo(x + radius, -y)
			.absarc(x, -y, radius, 0, -Math.PI / 2, true)
			.lineTo(-x, -y - radius)
			.absarc(-x, -y, radius, -Math.PI / 2, -Math.PI, true)
			.lineTo(-x - radius, y)
			.absarc(-x, y, radius, -Math.PI, (-Math.PI * 3) / 2, true)
			.lineTo(x, y + radius);

		const geo = new Three.ExtrudeGeometry(shape, {
			depth: 0.2,
			bevelEnabled: false,
		});
		const mat = new Three.MeshStandardMaterial({
			color,
			side: Three.DoubleSide,
			metalness: 0.5,
			roughness: 0.5,
		});
		const mesh = new Three.Mesh(geo, mat);

		this.mesh = mesh;
	}
}
