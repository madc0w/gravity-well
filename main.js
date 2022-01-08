const massScale = 80;
const velScale = 0.2;
let canvas, ctx, center;
const planets = [];

function onLoad() {
	canvas = document.getElementById('game-canvas');
	canvas.width = 800;
	canvas.height = 800;
	center = {
		x: canvas.width / 2,
		y: canvas.height / 2,
	};
	ctx = canvas.getContext('2d');

	planets.push({
		pos: {
			x: canvas.width / 2 + 120,
			y: canvas.height / 2,
		},
		vel: {
			x: 0,
			y: 6,
		},
		mass: 1,
		style: '#28c',
	});
	planets.push({
		pos: {
			x: canvas.width / 2 + 240,
			y: canvas.height / 2,
		},
		vel: {
			x: 0,
			y: 6,
		},
		mass: 2,
		style: '#66c',
	});

	requestAnimationFrame(draw);

	setInterval(step, 20);
}

function step() {
	for (const planet of planets) {
		planet.pos.x += planet.vel.x;
		planet.pos.y += planet.vel.y;

		const _dist = dist(planet.pos, center);
		planet.vel.x += (velScale * (center.x - planet.pos.x)) / _dist;
		planet.vel.y += (velScale * (center.y - planet.pos.y)) / _dist;
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const canvasStyle = getComputedStyle(canvas);

	const sunRadius = canvas.width / 12;

	const gradient = ctx.createRadialGradient(
		center.x,
		center.y,
		sunRadius * 0.2,
		center.x,
		center.y,
		sunRadius
	);
	gradient.addColorStop(0, '#fdb61c');
	// TODO how to make alpha work??
	gradient.addColorStop(1, canvasStyle.backgroundColor);

	ctx.fillStyle = gradient;
	ctx.beginPath();
	ctx.arc(center.x, center.y, sunRadius, 0, 2 * Math.PI);
	ctx.fill();

	for (const planet of planets) {
		const r = (planet.mass * canvas.width) / massScale;
		ctx.fillStyle = planet.style;
		ctx.beginPath();
		ctx.arc(planet.pos.x, planet.pos.y, r, 0, 2 * Math.PI);
		ctx.fill();
	}

	requestAnimationFrame(draw);
}

function dist(a, b) {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}