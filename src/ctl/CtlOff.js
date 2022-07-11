import CtlBase from './CtlBase.js';

export default class CtlOff extends CtlBase {
	ox = 0;
	oy = 0;
	
	constructor(ox, oy) {
		super();
		this.ox = ox | 0 || 0;
		this.oy = oy | 0 || 0;
	}
	
	invoke(canvas, params) {
		canvas.off(this.ox, this.oy);
	}
}
CtlOff.LEFT = new CtlOff(-1, 0);
CtlOff.UP = new CtlOff(0, -1);
CtlOff.RIGHT = new CtlOff(+1, 0);
CtlOff.DOWN = new CtlOff(0, +1);
