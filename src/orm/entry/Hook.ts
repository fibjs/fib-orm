import { FibOrmFixedModelInstance } from "@fxjs/orm";

export function trigger(self: FibOrmFixedModelInstance, cb: Function, _: boolean);
export function trigger () {
	var args = Array.prototype.slice.apply(arguments);
	var self = args.shift();
	var cb   = args.shift();

	if (typeof cb === "function") {
		cb.apply(self, args);
	}
};

export function wait(self: FibOrmFixedModelInstance, cb: Function, saveAssociation: object, opts: object);
export function wait(self: FibOrmFixedModelInstance, cb: Function, next: Function);
export function wait () {
	var args = Array.prototype.slice.apply(arguments);
	var self = args.shift();
	var cb   = args.shift();
	var next = args.shift();

	args.push(next);

	if (typeof cb === "function") {
		cb.apply(self, args);

		if (cb.length < args.length) {
			return next();
		}
	} else {
		return next();
	}
};
