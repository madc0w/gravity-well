const numPlanets = 8;
const velScale = 0.004;
const explosionSize = 60;
const sunRotVel = 0.002;

let canvas,
	ctx,
	center,
	sunRadius,
	collisions = [],
	sunRot = 0;
const explosionImg = new Image();
const sunImg = new Image();
const venusImg = new Image();
const planets = [];

function onLoad() {
	explosionImg.src = 'img/explosion.png';
	sunImg.src = 'img/sun.png';
	venusImg.src = 'img/venus.png';

	canvas = document.getElementById('game-canvas');
	canvas.width = 800;
	canvas.height = 800;
	sunRadius = canvas.width / 8;
	center = {
		x: canvas.width / 2,
		y: canvas.height / 2,
	};

	ctx = canvas.getContext('2d');

	for (let i = 0; i < numPlanets; i++) {
		let color = Math.floor(Math.random() * (1 << 12)).toString(16);
		while (color.length < 3) {
			color = '0' + color;
		}
		color += '4';
		const planet = {
			id: i,
			vel: {
				x: 0,
				y: (Math.random() < 0.5 ? 1 : -1) * (1 + Math.random() * 0.4),
			},
			radius: 8 + Math.random() * 24,
			rotVel: (Math.random() - 0.5) * 0.01,
			rot: 0,
			style: '#' + color,
		};
		let isCollision;
		do {
			planet.pos = {
				x: center.x + 40 + Math.random() * 400,
				y: center.y + (Math.random() - 0.5) * 100,
			};
			isCollision = false;
			for (const planet2 of planets) {
				if (dist(planet.pos, planet2.pos) <= planet.radius + planet2.radius) {
					isCollision = true;
					// console.log('init collission', planet.id, planet2.id);
					break;
				}
			}
		} while (isCollision);
		planets.push(planet);
	}

	requestAnimationFrame(draw);

	setInterval(step, 1);
}

function step() {
	collisions = [];
	for (const planet of planets) {
		for (const planet2 of planets) {
			if (planet != planet2) {
				if (dist(planet.pos, planet2.pos) <= planet.radius + planet2.radius) {
					console.log('collision', planet.id, planet2.id);
					collisions.push({
						planet1: planet,
						planet2,
					});
				}
			}
		}
		planet.pos.x += planet.vel.x;
		planet.pos.y += planet.vel.y;

		const _dist = dist(planet.pos, center);
		planet.vel.x += (velScale * (center.x - planet.pos.x)) / _dist;
		planet.vel.y += (velScale * (center.y - planet.pos.y)) / _dist;
		planet.rot += planet.rotVel;
	}
	sunRot += sunRotVel;
}

function draw() {
	{
		const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
		gradient.addColorStop(0, '#00a');
		gradient.addColorStop(1, '#000');
		// ctx.fillStyle = '#226';
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	// const canvasStyle = getComputedStyle(canvas);
	{
		const gradient = ctx.createRadialGradient(
			center.x,
			center.y,
			sunRadius * 0.2,
			center.x,
			center.y,
			sunRadius
		);
		gradient.addColorStop(0, '#fca816cc');
		gradient.addColorStop(1, '#0000');

		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(center.x, center.y, sunRadius, 0, 2 * Math.PI);
		ctx.fill();
	}

	drawImage(sunImg, center.x, center.y, 0.12, sunRot);

	ctx.font = '20px Arial';
	for (const planet of planets) {
		drawImage(
			venusImg,
			planet.pos.x,
			planet.pos.y,
			(2 * planet.radius) / venusImg.width,
			planet.rot
		);
		// ctx.drawImage(
		// 	venusImg,
		// 	planet.pos.x - planet.radius,
		// 	planet.pos.y - planet.radius,
		// 	planet.radius * 2,
		// 	planet.radius * 2
		// );

		const theta = Math.atan2(planet.pos.y - center.y, planet.pos.x - center.x);
		// console.log(theta / Math.PI);
		ctx.fillStyle = planet.style;
		ctx.beginPath();
		ctx.arc(
			planet.pos.x,
			planet.pos.y,
			planet.radius,
			theta + Math.PI / 2,
			theta - Math.PI / 2
		);
		ctx.fill();

		ctx.fillStyle = '#000c';
		ctx.beginPath();
		ctx.arc(
			planet.pos.x,
			planet.pos.y,
			planet.radius,
			theta - Math.PI / 2,
			theta + Math.PI / 2
		);
		ctx.fill();

		// ctx.fillStyle = '#fff';
		// ctx.fillText(planet.id, planet.pos.x, planet.pos.y);
	}

	for (const collision of collisions) {
		ctx.drawImage(
			explosionImg,
			(collision.planet1.pos.x + collision.planet2.pos.x - explosionSize) / 2,
			(collision.planet1.pos.y + collision.planet2.pos.y - explosionSize) / 2,
			explosionSize,
			explosionSize
		);
	}

	requestAnimationFrame(draw);
}

function dist(a, b) {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}

function drawImage(image, x, y, scale, rotation) {
	ctx.save();
	ctx.setTransform(scale, 0, 0, scale, x, y);
	ctx.rotate(rotation);
	const cx = image.width / 2;
	const cy = image.height / 2;
	ctx.drawImage(image, -cx, -cy);
	ctx.restore();
}
