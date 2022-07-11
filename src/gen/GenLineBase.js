import Dir from '../Dir.js';
import CtlOff from '../ctl/CtlOff.js';
import GenBase from './GenBase.js';

export default class GenLineBase extends GenBase {
	LEFT = '╴';
	RIGHT = '╶';
	UP = '╵';
	DOWN = '╷';
	HORIZONTAL = '─';
	VERTICAL = '│';
	
	len = 0;
	
	constructor(len) {
		super();
		this.len = len;
	}
	
	*_line(len, start, fill, end, finalizer) {
		if (len <= 0) {
			return;
		}
		let finalizerNeeded = false;
		for (let i = 0; i <= len; i++) {
			if (i === 0 && start.length > 0) {
				yield start;
				finalizerNeeded++;
			}
			else if (i === len && end.length > 0) {
				yield end;
				finalizerNeeded++;
			}
			else if (i < len) {
				yield fill;
			}
		}
		if (finalizerNeeded && finalizer) {
			yield finalizer;
		}
	}
	
	*generate(canvas, params) {
		switch (canvas.dir.norm()) {
			case Dir.RIGHT:
				yield* this._line(this.len, this.RIGHT, this.HORIZONTAL, this.LEFT, CtlOff.LEFT); // 37
			break;
			case Dir.LEFT:
				yield* this._line(this.len, this.LEFT, this.HORIZONTAL, this.RIGHT, CtlOff.RIGHT); // 39
			break;
			case Dir.UP:
				yield* this._line(this.len, this.UP, this.VERTICAL, this.DOWN, CtlOff.DOWN); // 40
			break;
			case Dir.DOWN:
				yield* this._line(this.len, this.DOWN, this.VERTICAL, this.UP, CtlOff.UP); // 38
			break;
			default:
				throw new Error(`Unsupported direction`);
			break;
		}
	}
}
