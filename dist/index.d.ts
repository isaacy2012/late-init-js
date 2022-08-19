export declare class LateinitNotInitializedException extends Error {
    constructor(message: string);
}
export declare class ReadonlyLateinitAlreadyInitializedException extends Error {
    constructor(message: string);
}
export interface LateinitOptions {
    /**
     * If this is a readonly option, ignore the first 'set' action if the value to set was undefined.
     * This can be helpful when using reflection to instantiate a class.
     */
    ignoreInitialUndefined: boolean;
}
export declare function lateinit(options?: LateinitOptions): <T>(proto: Object, propertyKey: string) => void;
export declare function readonlyLateinit(options?: LateinitOptions): <T>(proto: Object, propertyKey: string) => void;
/**
 * Check whether a given property is initialized.
 * Returns true iff the property was set using the setter.
 * Returns false if the property was never set, or if this is not a ts-lateinit property
 * @param thisRef the object that may or may not have the property
 * @param propertyKey the key for the property
 */
export declare function isInitialized(thisRef: any, propertyKey: string): boolean;
