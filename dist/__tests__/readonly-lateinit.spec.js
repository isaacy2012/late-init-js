"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe("Readonly Lateinit", () => {
    it("should throw an error when it is uninitialized", () => {
        class TestClass {
        }
        __decorate([
            (0, index_1.readonlyLateinit)()
        ], TestClass.prototype, "theProperty", void 0);
        const testObject1 = new TestClass();
        expect(() => {
            console.log(testObject1.theProperty);
        }).toThrow(index_1.LateinitNotInitializedException);
    });
    it("should be able to check if property has been initialized yet when it has not been", () => {
        class TestClass {
        }
        __decorate([
            (0, index_1.readonlyLateinit)()
        ], TestClass.prototype, "theProperty", void 0);
        const testObject1 = new TestClass();
        expect((0, index_1.isInitialized)(testObject1, "theProperty")).toBe(false);
        expect(() => {
            console.log(testObject1.theProperty);
        }).toThrow(index_1.LateinitNotInitializedException);
    });
    it("should be able to check if property has been initialized yet when it has been", () => {
        class TestClass {
        }
        __decorate([
            (0, index_1.readonlyLateinit)()
        ], TestClass.prototype, "theProperty", void 0);
        const testObject1 = new TestClass();
        const testString = "testString";
        testObject1.theProperty = testString;
        expect((0, index_1.isInitialized)(testObject1, "theProperty")).toBe(true);
        expect(testObject1.theProperty).toBe(testString);
    });
    it("should retain set value", () => {
        class TestClass {
        }
        __decorate([
            (0, index_1.readonlyLateinit)()
        ], TestClass.prototype, "theProperty", void 0);
        const testObject1 = new TestClass();
        const testString = "testString";
        testObject1.theProperty = testString;
        expect(testObject1.theProperty).toBe(testString);
    });
    it("should retain set value individually across instances", () => {
        class TestClass {
        }
        __decorate([
            (0, index_1.readonlyLateinit)()
        ], TestClass.prototype, "theProperty", void 0);
        const testObject1 = new TestClass();
        const testString1 = "testString1";
        testObject1.theProperty = testString1;
        expect(testObject1.theProperty).toBe(testString1);
        const testObject2 = new TestClass();
        const testString2 = "testString2";
        testObject2.theProperty = testString2;
        expect(testObject2.theProperty).toBe(testString2);
    });
    it("should retain set value individually across instances for objects", () => {
        class PropertyObject {
            constructor(num) {
                this.num = num;
            }
        }
        class TestClass {
        }
        __decorate([
            (0, index_1.readonlyLateinit)()
        ], TestClass.prototype, "theProperty", void 0);
        const testObject1 = new TestClass();
        const obj1 = new PropertyObject(1);
        testObject1.theProperty = obj1;
        expect(testObject1.theProperty).toBe(obj1);
        const testObject2 = new TestClass();
        const obj2 = new PropertyObject(2);
        testObject2.theProperty = obj2;
        expect(testObject2.theProperty).toBe(obj2);
    });
    it("should throw an error when trying to redefine the readonlyLateinit", () => {
        class PropertyObject {
            constructor(num) {
                this.num = num;
            }
        }
        class TestClass {
        }
        __decorate([
            (0, index_1.readonlyLateinit)()
        ], TestClass.prototype, "theProperty", void 0);
        const testObject1 = new TestClass();
        const obj1 = new PropertyObject(1);
        testObject1.theProperty = obj1;
        expect(testObject1.theProperty).toBe(obj1);
        expect(() => {
            testObject1.theProperty = new PropertyObject(3);
        }).toThrow(index_1.ReadonlyLateinitAlreadyInitializedException);
    });
    it("ignores first undefined initialization if parameter is set", () => {
        class TestClass {
        }
        __decorate([
            (0, index_1.readonlyLateinit)({ ignoreInitialUndefined: true })
        ], TestClass.prototype, "theProperty", void 0);
        const testObject1 = new TestClass();
        // @ts-ignore
        testObject1.theProperty = undefined;
        expect((0, index_1.isInitialized)(testObject1, "theProperty")).toBe(false);
        expect(() => {
            console.log(testObject1.theProperty);
        }).toThrow(index_1.LateinitNotInitializedException);
        const str = "string";
        testObject1.theProperty = str;
        expect(testObject1.theProperty).toBe(str);
    });
    it("does not ignore second undefined initialization if parameter is set", () => {
        class TestClass {
        }
        __decorate([
            (0, index_1.readonlyLateinit)({ ignoreInitialUndefined: true })
        ], TestClass.prototype, "theProperty", void 0);
        const testObject1 = new TestClass();
        // @ts-ignore
        testObject1.theProperty = undefined;
        expect((0, index_1.isInitialized)(testObject1, "theProperty")).toBe(false);
        expect(() => {
            console.log(testObject1.theProperty);
        }).toThrow(index_1.LateinitNotInitializedException);
        // @ts-ignore
        testObject1.theProperty = undefined;
        expect((0, index_1.isInitialized)(testObject1, "theProperty")).toBe(true);
        expect(() => {
            console.log(testObject1.theProperty);
        }).not.toThrow(index_1.LateinitNotInitializedException);
    });
    it("does not ignore first undefined initialization if parameter is not set", () => {
        class TestClass {
        }
        __decorate([
            (0, index_1.readonlyLateinit)()
        ], TestClass.prototype, "theProperty", void 0);
        const testObject1 = new TestClass();
        // @ts-ignore
        testObject1.theProperty = undefined;
        expect((0, index_1.isInitialized)(testObject1, "theProperty")).toBe(true);
        expect(testObject1.theProperty).toBeUndefined();
        expect(() => {
            testObject1.theProperty = "string";
        }).toThrow(index_1.ReadonlyLateinitAlreadyInitializedException);
    });
});
