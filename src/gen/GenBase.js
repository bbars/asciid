export default class GenBase {
	*generate(canvas, params) {
		throw new Error(`Must be implemented in descendant`);
	}
	
	pipe(mid) {
		if (!mid) {
			return this;
		}
		mid.feed(this);
		return mid;
	}
}
