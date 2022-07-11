export default class Dir {
	ox = 0;
	oy = 0;
	
	constructor(ox, oy) {
		this.ox = ox;
		this.oy = oy;
	}
	
	norm() {
		if (this === Dir.RIGHT || this === Dir.LEFT || this === Dir.UP || this === Dir.DOWN) {
			return this;
		}
		if (this.ox === Dir.RIGHT.ox && this.oy === Dir.RIGHT.oy) {
			return Dir.RIGHT;
		}
		if (this.ox === Dir.LEFT.ox && this.oy === Dir.LEFT.oy) {
			return Dir.LEFT;
		}
		if (this.ox === Dir.UP.ox && this.oy === Dir.UP.oy) {
			return Dir.UP;
		}
		if (this.ox === Dir.DOWN.ox && this.oy === Dir.DOWN.oy) {
			return Dir.DOWN;
		}
		return this;
	}
}

Dir.RIGHT = new Dir(+1,  0);
Dir.LEFT =  new Dir(-1,  0);
Dir.UP =    new Dir( 0, -1);
Dir.DOWN =  new Dir( 0, +1);
