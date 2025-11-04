import { Rect, type RectProps } from "./Rect.ts";

type BrickProps = RectProps;

class Brick extends Rect {
  constructor(props: BrickProps) {
    super(props);
  }
}

export default Brick;
