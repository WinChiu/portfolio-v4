const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 1.5;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 1.5;
});

const circles = [
  {
    x: canvas.width / 10 + 50,
    y: canvas.height / 10 + 50,
    radius: 100,
    dx: 1,
    dy: -0.6,
    color: '#b74343',
  },
  {
    x: canvas.width / 2 + 25,
    y: canvas.height / 8 + 25,
    radius: 50,
    dx: 0.5,
    dy: 0.8,
    color: '#FFA07A',
  },
  {
    x: (canvas.width * 3) / 4 - 60,
    y: canvas.height / 5 + 60,
    radius: 120,
    dx: -0.4,
    dy: 1,
    color: '#98FB98',
  },
];

function drawCircle(circle) {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx.fillStyle = circle.color;
  ctx.fill();
  ctx.closePath();
}

function updateCircle(circle) {
  circle.x += circle.dx;
  circle.y += circle.dy;

  // 如果圓形碰到邊界，反方向移動
  if (circle.x + circle.radius > canvas.width || circle.x - circle.radius < 0) {
    circle.dx = -circle.dx;
  }
  if (
    circle.y + circle.radius > canvas.height ||
    circle.y - circle.radius < 0
  ) {
    circle.dy = -circle.dy;
  }
}

function draw() {
  // 清除畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 添加模糊效果
  ctx.globalAlpha = 0.35; // 透明度設定
  //ctx.filter = 'blur(30px)'; // 毛玻璃效果
  circles.forEach((circle) => {
    drawCircle(circle);
    updateCircle(circle);
  });

  requestAnimationFrame(draw);
}

draw();
