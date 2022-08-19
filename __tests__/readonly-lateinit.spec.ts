import {
    ReadonlyLateinitAlreadyInitializedException,
    LateinitNotInitializedException,
    readonlyLateinit, lateinit, isInitialized
} from "../index";


describe("Readonly Lateinit", () => {
    it("should throw an error when it is uninitialized", () => {
        class TestClass {
            @readonlyLateinit()
            theProperty!: string;
        }

        const testObject1 = new TestClass();
        expect(() => {
            console.log(testObject1.theProperty);
        }).toThrow(LateinitNotInitializedException);
    });

    it("should be able to check if property has been initialized yet when it has not been", () => {
        class TestClass {
            @readonlyLateinit()
            theProperty!: string;
        }

        const testObject1 = new TestClass();
        expect(isInitialized(testObject1, "theProperty")).toBe(false);
        expect(() => {
            console.log(testObject1.theProperty);
        }).toThrow(LateinitNotInitializedException);
    });

    it("should be able to check if property has been initialized yet when it has been", () => {
        class TestClass {
            @readonlyLateinit()
            theProperty!: string;
        }

        const testObject1 = new TestClass();
        const testString = "testString";
        testObject1.theProperty = testString;
        expect(isInitialized(testObject1, "theProperty")).toBe(true);
        expect(testObject1.theProperty).toBe(testString);
    });


    it("should retain set value", () => {
        class TestClass {
            @readonlyLateinit()
            theProperty!: string;
        }

        const testObject1 = new TestClass();
        const testString = "testString";
        testObject1.theProperty = testString;
        expect(testObject1.theProperty).toBe(testString);
    });

    it("should retain set value individually across instances", () => {
        class TestClass {
            @readonlyLateinit()
            theProperty!: string;
        }

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
            num: number

            constructor(num: number) {
                this.num = num;
            }
        }

        class TestClass {
            @readonlyLateinit()
            theProperty!: PropertyObject;
        }

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
            num: number

            constructor(num: number) {
                this.num = num;
            }
        }

        class TestClass {
            @readonlyLateinit()
            theProperty!: PropertyObject;
        }

        const testObject1 = new TestClass();
        const obj1 = new PropertyObject(1);
        testObject1.theProperty = obj1;
        expect(testObject1.theProperty).toBe(obj1);

        expect(() => {
            testObject1.theProperty = new PropertyObject(3);
        }).toThrow(ReadonlyLateinitAlreadyInitializedException);
    });

    it("ignores first undefined initialization if parameter is set", () => {
        class TestClass {
            @readonlyLateinit({ ignoreInitialUndefined: true })
            theProperty!: string;
        }

        const testObject1 = new TestClass();
        // @ts-ignore
        testObject1.theProperty = undefined;
        expect(isInitialized(testObject1, "theProperty")).toBe(false);
        expect(() => {
            console.log(testObject1.theProperty);
        }).toThrow(LateinitNotInitializedException);
        const str = "string";
        testObject1.theProperty = str;
        expect(testObject1.theProperty).toBe(str);
    });

    it("does not ignore first undefined initialization if parameter is not set", () => {
        class TestClass {
            @readonlyLateinit()
            theProperty!: string;
        }

        const testObject1 = new TestClass();
        // @ts-ignore
        testObject1.theProperty = undefined;
        expect(isInitialized(testObject1, "theProperty")).toBe(true);
        expect(testObject1.theProperty).toBeUndefined();
        expect(() => {
            testObject1.theProperty = "string";
        }).toThrow(ReadonlyLateinitAlreadyInitializedException);
    });

})
