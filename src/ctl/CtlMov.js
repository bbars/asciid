import CtlBase from './CtlBase.js';

export default class CtlMov extends CtlBase {
	x = 0;
	y = 0;
	
	constructor(x, y) {
		super();
		this.x = x | 0 || 0;
		this.y = y | 0 || 0;
	}
	
	invoke(canvas, params) {
		canvas.mov(this.x, this.y);
	}
}
