export default class CtlBase {
	invoke(canvas, params) {
		throw new Error(`Must be implemented in descendant`);
	}
}
