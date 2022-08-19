[![npm version](https://img.shields.io/npm/v/late-init-js.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/late-init-js)
[![license](https://img.shields.io/npm/l/late-init-js?&style=for-the-badge&color=green)
](https://github.com/isaacy2012/late-init-js/blob/master/LICENSE)

Late initialization decorator for TypeScript. Comes with `@lateinit` and `@readonlyLateinit` variants for controlling 
the mutability of the property.

## Installation

TypedJSON is available from npm:

```
npm install late-init-js
```

## How to Use

TypeScript needs to run with the `experimentalDecorators` option enabled.

You must use the [definite assignment assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#strict-class-initialization)
if the property type is not optional (i.e not `T | undefined`):
```typescript
class Person {
  @lateinit()
  name!: string;
  //  ^ definite assignment assertion
    
  @lateinit()
  nullableName: string | undefined;
  //  no definite assignment required
}
```

### Mutable `@lateinit` Property

```typescript
import { lateinit } from "late-init-js"

class Person {
  @lateinit()
  name!: string;
}

const person = new Person();
person.name = "Alice";
console.log(person.name); // prints "Alice"
person.name = "Bob";
console.log(person.name); // prints "Bob"

const anotherPerson = new Person();
console.log(anotherPerson.name); // throws a LateinitNotInitializedException
```

### Immutable `@readonlyLateinit` Property

```typescript
import { readonlyLateinit } from "late-init-js"

class Person {
    @readonlyLateinit()
    name!: string;
}

const person = new Person();
person.name = "Alice";
console.log(person.name); // prints "Alice"
person.name = "Bob"; // throws a ReadonlyLateinitAlreadyInitializedException
```

### Ignoring initial set to `undefined`

`@lateinit` and `@readonlyLateInit` accept an optional parameter `options` for which if `ignoreInitialUndefined` is `true`,
late-init-js will ignore the first "set" action on the property if it is `undefined`. 

This can be helpful when using reflection to instantiate a class, for example when using serialization/deserialization
libraries such as [TypedJson](https://www.npmjs.com/package/typedjson).

```typescript
import { readonlyLateinit } from "late-init-js"

class Person {
    @readonlyLateinit({ ignoreInitialUndefined: true })
    name!: string;
}

const person = new Person();
person.name = "Alice";
console.log(person.name); // prints "Alice"
person.name = "Bob"; // throws a ReadonlyLateinitAlreadyInitializedException
```

### Checking if a Property Has Been Initialized

To check whether the property has been initialized, use the `isInitialized(thisRef: any, propertyKey: string)` function.

```typescript
import { readonlyLateinit, isInitialized } from "late-init-js"

class Person {
    @readonlyLateinit()
    name!: string;
}

const person = new Person();
console.log(isInitialized(person, "name")); // prints "false"
person.name = "Alice";
console.log(isInitialized(person, "name")); // prints "true"
```

However, if you find you are using `isInitialized` a lot, you may wish to consider using a optional type instead 
to take advantage of TypeScripts optional chaining features such as `?` and `??`.

## Notes
late-init-js adds two extra properties for each property that is defined as lateinit, prefixed with `__late-init-js_INI__` 
and `__late-init-js_VAL__`, to keep track of whether the property was initialized and the value respectively. 

In addition, if the `ignoreInitialUndefined` parameter option is enabled, an additional property prefixed with 
`__late-init-js_SET__` is used to keep track of whether the property has been first set with `undefined` yet.

For example, for the above example with the property `name`, the two extra properties would be `__late-init-js_INI__name` 
and `__late-init-js_VAL__name`, and with `ignoreInitialUndefined` enabled, the additional property would be 
`late-init-js_SET_name`


Ensure that these properties are not overwritten. 

## License

late-init-js is licensed under the ISC License.
