import Dir from '../Dir.js';
import CtlBase from './CtlBase.js';

export default class CtlDir extends CtlBase {
	dir = null;
	
	constructor(dir) {
		super();
		this.dir = dir;
	}
	
	invoke(canvas, params) {
		canvas.dir = this.dir || params.initial.dir;
	}
}
CtlDir.LEFT = new CtlDir(Dir.LEFT);
CtlDir.UP = new CtlDir(Dir.UP);
CtlDir.RIGHT = new CtlDir(Dir.RIGHT);
CtlDir.DOWN = new CtlDir(Dir.DOWN);
CtlDir.RESET = new CtlDir(null);
