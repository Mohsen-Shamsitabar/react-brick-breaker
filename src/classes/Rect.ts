import type { Bounds } from "../types.ts";

export type RectProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
};

export class Rect {
  protected x;
  protected y;
  protected width;
  protected height;
  protected color;

  constructor(props: RectProps) {
    const { x, y, width, height, color = "orange" } = props;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }

  public getCenterX() {
    return this.x + this.width / 2;
  }

  public getCenterY() {
    return this.y + this.height / 2;
  }

  public getBounds() {
    const bounds: Bounds = {
      bottom: this.y + this.height,
      left: this.x,
      right: this.x + this.width,
      top: this.y,
    };

    return bounds;
  }

  public draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.color;
    context.beginPath();
    context.fillRect(this.x, this.y, this.width, this.height);
    context.closePath();
  }
}
