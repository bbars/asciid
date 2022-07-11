import CtlDir from '../ctl/CtlDir.js';
import CtlOff from '../ctl/CtlOff.js';
import GenDoubleLine from './GenDoubleLine.js';

export default class GenDoubleRect extends GenDoubleLine {
	width = 0;
	height = 0;
	
	constructor(width, height) {
		super();
		this.width = width;
		this.height = height;
	}
	
	*generate(canvas, params) {
		yield CtlDir.RIGHT;
		yield '╔';
		yield* this._line(this.width - 2, this.RIGHT, this.HORIZONTAL, this.LEFT, CtlOff.LEFT);
		yield CtlDir.DOWN;
		yield '╗';
		yield* this._line(this.height - 2, this.DOWN, this.VERTICAL, this.UP, CtlOff.UP);
		yield CtlDir.LEFT;
		yield '╝';
		yield* this._line(this.width - 2, this.LEFT, this.HORIZONTAL, this.RIGHT, CtlOff.RIGHT);
		yield CtlDir.UP;
		yield '╚';
		yield* this._line(this.height - 2, this.UP, this.VERTICAL, this.DOWN, CtlOff.DOWN);
		yield CtlDir.RESET;
		yield new CtlOff(this.width - 1, this.height - 1);
	}
}
