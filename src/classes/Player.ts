import { Rect, type RectProps } from "./Rect.ts";

type PlayerProps = RectProps;

class Player extends Rect {
  constructor(props: PlayerProps) {
    super(props);
  }

  public MoveX(newX: number) {
    this.x = newX - this.width / 2;
  }
}

export default Player;
