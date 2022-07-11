import Dir from './Dir.js';
import GenBase from './gen/GenBase.js';
import GenText from './gen/GenText.js';
import CtlBase from './ctl/CtlBase.js';

export default class Canvas extends EventTarget {
	rows = [];
	width = 0;
	height = 0;
	x = 0;
	y = 0;
	dir = Dir.RIGHT;
	beautyUpdates = true;
	
	constructor(width, height, dir) {
		super();
		this.width = width;
		this.height = height;
		this.rows = new Array(height).fill(null).map(() => {
			return new Array(width).fill(' ');
		});
		this.dir = dir || Dir.RIGHT;
	}
	
	toString() {
		return this.rows.map(row => row.join('')).join('\n');
	}
	
	toNodes() {
		const res = document.createDocumentFragment();
		const appendText = (s, brk) => {
			let tn = res.lastChild;
			if (!brk && tn instanceof Text) {
				tn.textContent += s;
			}
			else {
				tn = document.createTextNode(s);
				res.appendChild(tn);
			}
		};
		for (let i = 0; i < this.rows.length; i++) {
			const row = this.rows[i];
			for (const item of row) {
				if (item.className) {
					const span = document.createElement('span');
					span.textContent = String(item);
					span.className = item.className;
					res.appendChild(span);
				}
				else {
					appendText(String(item));
				}
			}
			if (i < this.rows.length - 1) {
				appendText('\n');
				appendText('', true);
			}
		}
		return res;
	}
	
	setDir(dir) {
		this.dir = dir;
		return this;
	}
	
	mov(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}
	
	off(ox, oy) {
		this.x += ox | 0 || 0;
		this.y += oy | 0 || 0;
		return this;
	}
	
	_write(generator) {
		const params = {
			initial: {
				x: this.x,
				y: this.y,
				dir: this.dir,
			},
		};
		if (false === generator instanceof GenBase) {
			generator = new GenText(generator);
		}
		let res = 0;
		loop: for (const char of generator.generate(this, params)) {
			switch (char) {
				case '\r': {
					if (this.dir.ox) {
						this.x = params.initial.x;
					}
					if (this.dir.oy) {
						this.y = params.initial.y;
					}
					continue loop;
				}
				case '\n': {
					if (this.dir.ox) {
						this.x = params.initial.x;
						this.y += 1; // this.dir.ox > 0 ? 1 : -1;
					}
					if (this.dir.oy) {
						this.y = params.initial.y;
						this.x += this.dir.oy > 0 ? 1 : -1;
					}
					continue loop;
				}
			}
			if (char instanceof CtlBase) {
				char.invoke(this, params);
				continue loop;
			}
			this.set(this.x, this.y, char);
			this.x += this.dir.ox;
			this.y += this.dir.oy;
			res++;
		}
		return res;
	}
	
	write(text) {
		this._write(text);
		return this;
	}
	
	get(x, y, fallback) {
		if (x == null) {
			x = this.x;
		}
		if (y == null) {
			y = this.y;
		}
		return 0 > x || x >= this.width || 0 > y || y >= this.height
			? fallback
			: this.rows[y][x]
		;
	}
	
	copy(srcX, srcY, width, height) {
		srcX = (srcX | 0) || 0;
		srcY = (srcY | 0) || 0;
		width = Math.max(0, width | 0) || this.width;
		height = Math.max(0, height | 0) || this.height;
		const res = new this.constructor(width, height);
		res.draw(this, 0, 0, srcX, srcY, width, height);
		return res;
	}
	
	draw(src, dstX, dstY, srcX, srcY, srcWidth, srcHeight) {
		throw new Error("TODO");
	}
	
	_set(x, y, char, skipBeautyUpdates) {
		x |= 0;
		y |= 0;
		if (this.get(x, y) == null) {
			return 0;
		}
		const prev = this.get(x, y);
		this.rows[y][x] = char;
		this.dispatchEvent(new CustomEvent('change', {
			detail: { x, y, prev, char },
		}));
		// if (!skipBeautyUpdates && this.beautyUpdates) {
			// this._beautyUpdate(x, y, prev, char);
		// }
		return 1;
	}
	
	set(x, y, char) {
		return this._set(x, y, char, false);
	}
	
	lineDescriptions = {
		'╴': 'l1',
		'╶': 'r1',
		'╵': 'u1',
		'╷': 'd1',
		'│': 'u1d1',
		'┤': 'u1d1l1',
		'╡': 'u1d1l2',
		'╢': 'u2d2l1',
		'╖': 'd2l1',
		'╕': 'd1l2',
		'╣': 'u2d2l2',
		'║': 'u2d2',
		'╗': 'd2l2',
		'╝': 'u2l2',
		'╜': 'u2l1',
		'╛': 'u1l2',
		'┴': 'u1l1r1',
		'┬': 'd1l1r1',
		'├': 'u1d1r1',
		'─': 'l1r1',
		'┼': 'u1d1l1r1',
		'╞': 'u1r2',
		'╟': 'u2d2r1',
		'╚': 'u2r2',
		'╔': 'd2r2',
		'╩': 'u2l2r2',
		'╦': 'd2l2r2',
		'╠': 'u2d2r2',
		'═': 'l2r2',
		'╬': 'u2d2l2r2',
		'╧': 'u1l2r2',
		'╨': 'u2l1r1',
		'╤': 'd1l2r2',
		'╥': 'd2l1r1',
		'╙': 'u2r1',
		'╓': 'd2r1',
		'╫': 'u2d2l1r1',
		'╪': 'u1d1l2r2',
		'╘': 'u1r2',
		'╒': 'd1r2',
		// rounded first:
		'╭': 'd1r1',
		'╮': 'd1l1',
		'╯': 'u1l1',
		'╰': 'u1r1',
		// then angled:
		'┌': 'd1r1',
		'┐': 'd1l1',
		'┘': 'u1l1',
		'└': 'u1r1',
		
		'┏': 'dhrh',
		'┓': 'dhlh',
		'┗': 'uhrh',
		'┛': 'uhlh',
		'╸': 'lh',
		'╹': 'uh',
		'╺': 'rh',
		'╻': 'dh',
	};
	_beautyUpdate(x, y, prev, char) {
		lines: {
			const prevDesc = this.lineDescriptions[prev];
			const charDesc = this.lineDescriptions[char];
			if (!prevDesc || !charDesc) {
				break lines;
			}
			let mixDesc = { u: 0, d: 0, l: 0, r: 0 };
			for (let i = 0; i < prevDesc.length; i += 2) {
				mixDesc[prevDesc[i]] = prevDesc[i + 1];
			}
			for (let i = 0; i < charDesc.length; i += 2) {
				mixDesc[charDesc[i]] = charDesc[i + 1];
			}
			mixDesc = ''
				+ (!mixDesc.u ? '' : 'u' + mixDesc.u)
				+ (!mixDesc.d ? '' : 'd' + mixDesc.d)
				+ (!mixDesc.l ? '' : 'l' + mixDesc.l)
				+ (!mixDesc.r ? '' : 'r' + mixDesc.r)
			;
			if (!mixDesc || mixDesc === charDesc) {
				break lines;
			}
			break lines;
			if (!this.lineDescriptions.flip) {
				this.lineDescriptions.flip = {};
				for (const k in this.lineDescriptions) {
					this.lineDescriptions.flip[this.lineDescriptions[k]] = k;
				}
			}
			const replace = this.lineDescriptions.flip[mixDesc];
			if (!replace || replace === char) {
				break lines;
			}
			this._set(x, y, replace, true);
		}
	}
}
