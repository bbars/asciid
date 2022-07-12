import ModBase from './ModBase.js';

export default class ModBeautyLines extends ModBase {
	*modify(src, canvas, params) {
		let prev;
		for (const char of src) {
			prev = canvas.get(canvas.x, canvas.y);
			yield this._beautify(prev, char);
		}
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
	_beautify(prev, char) {
		const prevDesc = this.lineDescriptions[prev];
		const charDesc = this.lineDescriptions[char];
		if (!prevDesc || !charDesc) {
			return char;
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
			return char;
		}
		if (!this.lineDescriptions.flip) {
			this.lineDescriptions.flip = {};
			for (const k in this.lineDescriptions) {
				this.lineDescriptions.flip[this.lineDescriptions[k]] = k;
			}
		}
		const replace = this.lineDescriptions.flip[mixDesc];
		if (!replace) {
			return char;
		}
		return replace;
	}
}
