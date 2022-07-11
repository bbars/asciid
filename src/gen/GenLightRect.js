import CtlDir from '../ctl/CtlDir.js';
import CtlOff from '../ctl/CtlOff.js';
import GenLightLine from './GenLightLine.js';

export default class GenLightRect extends GenLightLine {
	width = 0;
	height = 0;
	rounded = false;
	
	constructor(width, height, rounded) {
		super();
		this.width = width;
		this.height = height;
		this.rounded = rounded;
	}
	
	*generate(canvas, params) {
		yield CtlDir.RIGHT;
		yield* this._line(this.width - 1, this.RIGHT, this.HORIZONTAL, this.LEFT, CtlOff.LEFT);
		yield CtlDir.DOWN;
		yield* this._line(this.height - 1, this.DOWN, this.VERTICAL, this.UP, CtlOff.UP);
		yield CtlDir.LEFT;
		yield* this._line(this.width - 1, this.LEFT, this.HORIZONTAL, this.RIGHT, CtlOff.RIGHT);
		yield CtlDir.UP;
		yield* this._line(this.height - 1, this.UP, this.VERTICAL, this.DOWN, CtlOff.DOWN);
		
		yield CtlDir.RIGHT;
		yield this.rounded ? '╭' : '┌';
		yield new CtlOff(this.width - 2, 0);
		yield this.rounded ? '╮' : '┐';
		yield new CtlOff(-1, this.height - 1);
		yield this.rounded ? '╯' : '┘';
		yield new CtlOff(-this.width, 0);
		yield this.rounded ? '╰' : '└';
		yield new CtlOff(this.width - 2, 0);
		yield CtlDir.RESET;
	}
}
