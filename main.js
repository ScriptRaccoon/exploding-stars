// canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// constants
const circleList = [];
const waitBeforeExplode = 200;
const maximumCircleNumber = 1000;
const maximumLifeSpan = 850;

// adjust canvas to whole window
function adjustCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
adjustCanvas();
window.addEventListener("resize", adjustCanvas);

// random integer function
function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a));
}

// euclidean distance function
function distance(x, y, u, v) {
    return Math.sqrt(Math.pow(x - u, 2) + Math.pow(y - v, 2));
}

// circle class
class Circle {
    constructor(x, y, velx, vely) {
        this.x = x;
        this.y = y;
        this.r = 5;
        this.col = "rgba(255,255,0)";
        this.velx = velx;
        this.vely = vely;
        this.lifeTime = 0;
        circleList.push(this);
    }

    // remove a circle
    remove() {
        const i = circleList.indexOf(this);
        circleList.splice(i, 1);
    }

    // draw a circle
    draw() {
        ctx.globalAlpha =
            (this.lifeTime - maximumLifeSpan) / (waitBeforeExplode - maximumLifeSpan);
        ctx.fillStyle = this.col;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    // update a circle
    update() {
        if (this.lifeTime >= maximumLifeSpan) {
            this.remove();
            return;
        }
        this.lifeTime++;
        const greenPart = Math.max(0, 255 * (1 - this.lifeTime / waitBeforeExplode));
        this.col = `rgb(255,${greenPart},0)`;
        this.x += this.velx;
        this.y += this.vely;
        this.bounce();
        if (circleList.length <= maximumCircleNumber) {
            circleList.forEach((circle) => this.explode(circle));
        }
    }

    // bounce the circle off the walls
    bounce() {
        if (this.x - this.r <= 0) {
            this.velx *= -1;
            this.x = this.r;
        } else if (this.x + this.r >= canvas.width) {
            this.x = canvas.width - this.r;
            this.velx *= -1;
        }
        if (this.y - this.r <= 0) {
            this.vely *= -1;
            this.y = this.r;
        } else if (this.y + this.r >= canvas.height) {
            this.y = canvas.height - this.r;
            this.vely *= -1;
        }
    }

    // explosion with another circle
    explode(circle) {
        if (
            circle !== this &&
            this.lifeTime >= waitBeforeExplode &&
            circle.lifeTime >= waitBeforeExplode &&
            distance(this.x, this.y, circle.x, circle.y) < this.r + circle.r
        ) {
            this.remove();
            circle.remove();
            const x = (this.x + circle.x) / 2;
            const y = (this.y + circle.y) / 2;
            const number = randInt(6, 12);
            for (let i = 0; i < number; i++) {
                const alpha = (2 * Math.PI * i) / number;
                const velx = 2 * Math.cos(alpha);
                const vely = 2 * Math.sin(alpha);
                new Circle(x, y, velx, vely);
            }
        }
    }
}

// add two circles
new Circle(800, 400, -2, 0);
new Circle(0, 400, 2, 0);

// loop
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circleList.forEach((circle) => circle.update());
    circleList.forEach((circle) => circle.draw());
    requestAnimationFrame(loop);
}

// start the loop
loop();
