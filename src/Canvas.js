import Dir from './Dir.js';
import GenBase from './gen/GenBase.js';
import GenText from './gen/GenText.js';
import CtlBase from './ctl/CtlBase.js';
const _CustomEvent = typeof CustomEvent !== 'undefined'
	? CustomEvent
	: typeof Event !== 'undefined'
		? Event
		: class CustomEventDummy {
			constructor(type, ext) {
				Object.assign(this, ext);
				this.type = type;
			}
		}
;

export default class Canvas extends EventTarget {
	rows = [];
	width = 0;
	height = 0;
	x = 0;
	y = 0;
	dir = Dir.RIGHT;
	
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
		width = Math.max(0, width | 0) || (this.width - srcX);
		height = Math.max(0, height | 0) || (this.height - srcY);
		const res = new this.constructor(width, height);
		res.draw(this, 0, 0, srcX, srcY, width, height);
		return res;
	}
	
	draw(src, dstX, dstY, srcX, srcY, srcWidth, srcHeight) {
		const dst = this;
		dstX = (dstX | 0) || 0;
		dstY = (dstY | 0) || 0;
		srcX = (srcX | 0) || 0;
		srcY = (srcY | 0) || 0;
		srcWidth = Math.max(0, srcWidth | 0);
		srcHeight = Math.max(0, srcHeight | 0);
		srcWidth = Math.min(srcWidth || src.width, src.width - srcX, dst.width - dstX);
		srcHeight = Math.min(srcHeight || src.height, src.height - srcY, dst.height - dstY);
		/*
		// TODO: optimize:
		for (let y = Math.max(0, -srcY); y < srcHeight; y++) {
			const y0 = srcY + y;
			const y1 = dstY + y;
			for (let x = Math.max(0, -srcX); x < srcWidth; x++) {
				const x0 = srcX + x;
				const x1 = dstX + x;
				dst.rows[y1][x1] = src.rows[y0][x0];
			}
		}
		*/
		for (let y = Math.max(0, -srcY); y < srcHeight; y++) {
			const y0 = srcY + y;
			const y1 = dstY + y;
			const x0 = srcX + Math.max(0, -srcX);
			const x1 = dstX + Math.max(0, -srcX);
			const slice = src.rows[y0].slice(x0, x0 + srcWidth); // TODO: clone values
			dst.rows[y1].splice(x1, x1 + srcWidth, ...slice);
		}
		return dst;
	}
	
	_set(x, y, char) {
		x |= 0;
		y |= 0;
		if (this.get(x, y) == null) {
			return 0;
		}
		const prev = this.get(x, y);
		this.rows[y][x] = char;
		this.dispatchEvent(new _CustomEvent('change', {
			detail: { x, y, prev, char },
		}));
		return 1;
	}
	
	set(x, y, char) {
		return this._set(x, y, char, false);
	}
}
