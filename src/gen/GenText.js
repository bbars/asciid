import GenBase from './GenBase.js';

export default class GenText extends GenBase {
	text;
	
	constructor(text) {
		super();
		this.text = typeof text !== 'string' && false === text instanceof String ? String(text) : text;
	}
	
	*generate(canvas, params) {
		yield* this.text;
	}
}
