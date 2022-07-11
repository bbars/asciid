import MidBase from './MidBase.js';

export default class MidSpan extends MidBase {
	className;
	
	constructor(className) {
		super();
		this.className = className;
	}
	
	*pass(src, canvas, params) {
		for (const char of src) {
			if (typeof char === 'object' && false === char instanceof String) {
				yield char;
			}
			else {
				const char2 = new String(String(char));
				char2.className = this.className;
				yield char2;
			}
		}
	}
}
