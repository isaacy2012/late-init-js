"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInitialized = exports.readonlyLateinit = exports.lateinit = exports.ReadonlyLateinitAlreadyInitializedException = exports.LateinitNotInitializedException = void 0;
class LateinitNotInitializedException extends Error {
    constructor(propertyKey) {
        super(`The property ${propertyKey} was not set!`);
        this.name = new.target.name;
    }
}
exports.LateinitNotInitializedException = LateinitNotInitializedException;
class ReadonlyLateinitAlreadyInitializedException extends Error {
    constructor(propertyKey) {
        super(`The property ${propertyKey} was already set, and readonly lateinit properties cannot be set more than once!`);
        this.name = new.target.name;
    }
}
exports.ReadonlyLateinitAlreadyInitializedException = ReadonlyLateinitAlreadyInitializedException;
// Property for whether the value was initialized or not
const INI = "__late-init-js_INI__";
// Property for whether the value was set or not, regardless of whether it was actually initialized
const SET = "__late-init-js_SET__";
// Property for the actual value stored
const VAL = "__late-init-js_VAL__";
function _lateinit(isReadonly, options) {
    return function (proto, propertyKey) {
        const getter = function () {
            if (!this[INI + propertyKey]) {
                throw new LateinitNotInitializedException(propertyKey);
            }
            return this[VAL + propertyKey];
        };
        const setter = function (newVal) {
            if ((options === null || options === void 0 ? void 0 : options.ignoreInitialUndefined) === true
                && !this[SET + propertyKey]
                && !this[INI + propertyKey]
                && newVal == undefined) {
                Object.defineProperty(this, SET + propertyKey, {
                    writable: false,
                    value: true
                });
                return;
            }
            if (isReadonly && this[INI + propertyKey]) {
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
        };
        Object.defineProperty(proto, propertyKey, {
            get: getter,
            set: setter
        });
    };
}
function lateinit(options) {
    return _lateinit(false, options);
}
exports.lateinit = lateinit;
function readonlyLateinit(options) {
    return _lateinit(true, options);
}
exports.readonlyLateinit = readonlyLateinit;
/**
 * Check whether a given property is initialized.
 * Returns true iff the property was set using the setter.
 * Returns false if the property was never set, or if this is not a late-init-js property
 * @param thisRef the object that may or may not have the property
 * @param propertyKey the key for the property
 */
function isInitialized(thisRef, propertyKey) {
    return thisRef[INI + propertyKey] === true;
}
exports.isInitialized = isInitialized;
