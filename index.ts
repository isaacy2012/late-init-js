export class LateinitNotInitializedException extends Error {
    constructor(propertyKey: string) {
        super(`The property ${propertyKey} was not set!`);
        this.name = new.target.name;
    }
}

export class ReadonlyLateinitAlreadyInitializedException extends Error {
    constructor(propertyKey: string) {
        super(`The property ${propertyKey} was already set, and readonly lateinit properties cannot be set more than once!`);
        this.name = new.target.name;
    }
}

// Property for whether the value was initialized or not
const INI = "__late-init-js_INI__";
// Property for whether the value was set or not, regardless of whether it was actually initialized
const SET = "__late-init-js_SET__";
// Property for the actual value stored
const VAL = "__late-init-js_VAL__";

export interface LateinitOptions {
    /**
     * If this is a readonly option, ignore the first 'set' action if the value to set was undefined.
     * This can be helpful when using reflection to instantiate a class.
     */
    ignoreInitialUndefined: boolean
}

function _lateinit<T>(isReadonly: boolean, options?: LateinitOptions) {
    return function<T>(proto: Object, propertyKey: string) {
        const getter = function(this: T) {
            if (!this[INI + propertyKey as keyof T]) {
                throw new LateinitNotInitializedException(propertyKey);
            }
            return this[VAL + propertyKey as keyof T];
        }
        const setter = function(this: T, newVal: T) {
            if (options?.ignoreInitialUndefined === true
                && !this[SET + propertyKey as keyof T]
                && !this[INI + propertyKey as keyof T]
                && newVal == undefined) {
                Object.defineProperty(this, SET + propertyKey, {
                    writable: false,
                    value: true
                });
                return;
            }
            if (isReadonly && this[INI + propertyKey as keyof T]) {
                throw new ReadonlyLateinitAlreadyInitializedException(propertyKey);
            }
            Object.defineProperty(this, VAL + propertyKey, {
                writable: !isReadonly,
                value: newVal
            });
            Object.defineProperty(this, INI + propertyKey, {
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

export function lateinit(options?: LateinitOptions) {
    return _lateinit(false, options);
}

export function readonlyLateinit(options?: LateinitOptions) {
    return _lateinit(true, options);
}

/**
 * Check whether a given property is initialized.
 * Returns true iff the property was set using the setter.
 * Returns false if the property was never set, or if this is not a late-init-js property
 * @param thisRef the object that may or may not have the property
 * @param propertyKey the key for the property
 */
export function isInitialized(thisRef: any, propertyKey: string): boolean {
    return thisRef[INI + propertyKey] === true;
}
