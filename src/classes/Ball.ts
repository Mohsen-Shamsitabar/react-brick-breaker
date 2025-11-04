type BallProps = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  color?: string;
};

class Ball {
  protected x;
  protected y;
  protected radius;
  protected speed;
  protected color;
  // [X,Y]
  protected direction: [number, number];

  constructor(props: BallProps) {
    const { radius, speed, x, y, color = "blue" } = props;

    this.radius = radius;
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.color = color;

    const directionX = Math.random() * 2 - 1;
    const directionY = -Math.sqrt(1 - Math.pow(directionX, 2));

    this.direction = [directionX, directionY];
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }

  public getRadius() {
    return this.radius;
  }

  public getDirection() {
    return this.direction;
  }

  public getSpeed() {
    return this.speed;
  }

  public setDirection(vectorX: number, vectorY: number) {
    this.direction = [vectorX, vectorY];
  }

  public setSpeed(newSpeed: number) {
    this.speed = newSpeed;
  }

  public rotateX() {
    this.direction[0] *= -1;
  }

  public rotateY() {
    this.direction[1] *= -1;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  public move() {
    const newX = this.x + this.direction[0] * this.speed;
    const newY = this.y + this.direction[1] * this.speed;

    this.x = newX;
    this.y = newY;
  }

  public stop() {
    this.direction = [0, 0];
    this.speed = 0;
  }
}

export default Ball;
