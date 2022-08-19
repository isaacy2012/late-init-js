export class LateinitNotInitializedException extends Error {
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

export class ReadonlyLateinitAlreadyInitializedException extends Error {
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

function _lateinit<T>(isReadonly: boolean) {
    const SET = "__ts-lateinit_SET__";
    const VAL = "__ts-lateinit_VAL__";
    return function<T>(proto: Object, propertyKey: string) {
        const getter = function(this: T) {
            if (!this[SET + propertyKey as keyof T]) {
                throw new LateinitNotInitializedException(`The property ${propertyKey} was not set!`);
            }
            return this[VAL + propertyKey as keyof T];
        }
        const setter = function(this: T, newVal: T) {
            if (isReadonly && this[SET + propertyKey as keyof T]) {
                throw new ReadonlyLateinitAlreadyInitializedException(`The property ${propertyKey} was already \
set, and readonly lateinit properties cannot be set twice!`);
            }
            Object.defineProperty(this, VAL + propertyKey, {
                writable: !isReadonly,
                value: newVal
            });
            Object.defineProperty(this, SET + propertyKey, {
                writable: false,
                value: true
            });
        }

        Object.defineProperty(proto, propertyKey, {
            get: getter,
            set: setter
        });
    }
}

export function lateinit() {
    return _lateinit(false);
}

export function readonlyLateinit() {
    return _lateinit(true);
}
