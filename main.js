let canvas, ctx;

function onLoad() {
	canvas = document.getElementById('game-canvas');
	canvas.width = 800;
	canvas.height = 800;
	ctx = canvas.getContext('2d');
	requestAnimationFrame(draw);
}

function draw() {
	const canvasStyle = getComputedStyle(canvas);

	const center = {
		x: canvas.width / 2,
		y: canvas.height / 2,
	};
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
	requestAnimationFrame(draw);
}
