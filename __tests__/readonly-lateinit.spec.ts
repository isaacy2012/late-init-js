import {
    ReadonlyLateinitAlreadyInitializedException,
    LateinitNotInitializedException,
    readonlyLateinit
} from "../src/lateinit";


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

})
