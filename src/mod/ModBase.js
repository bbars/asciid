import GenBase from '../gen/GenBase.js';
import GenText from '../gen/GenText.js';

export default class ModBase extends GenBase {
	srcs = [];
	
	feed(src) {
		src = src instanceof GenBase ? src : new GenText(src);
		this.srcs.push(src);
		return this;
	}
	
	*generate(canvas, params) {
		while (this.srcs.length > 0) {
			const src = this.srcs.shift();
			yield* this.modify(src.generate(canvas, params), canvas, params);
		}
	}
	
	*modify(src, canvas, params) {
		throw new Error(`Must be implemented in descendant`);
	}
}
