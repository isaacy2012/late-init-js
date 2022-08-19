[![npm version](https://img.shields.io/npm/v/ts-lateinit.svg?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/typedjson)
[![license](https://img.shields.io/npm/l/ts-lateinit?&style=for-the-badge&color=green)
](https://github.com/isaacy2012/ts-lateinit/blob/master/LICENSE)

Late initialization decorator for TypeScript. Comes with `@lateinit` and `@readonlyLateinit` variants for controlling 
the mutability of the property.

## Installation

TypedJSON is available from npm:

```
npm install ts-lateinit
```

## How to use

TypeScript needs to run with the `experimentalDecorators` option enabled.

You must use the [definite assignment assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#strict-class-initialization):
```typescript
class Person {
  @lateinit()
  name!: string;
  //  ^ definite assignment assertion
}
```

### Mutable `@lateinit` Property

The following example demonstrates how to annotate a basic, non-nested class for serialization, and how to serialize to JSON and back:

```typescript
import { lateinit } from "ts-lateinit"

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

The following example demonstrates how to annotate a basic, non-nested class for serialization, and how to serialize to JSON and back:

```typescript
import { lateinit } from "ts-lateinit"

class Person {
    @readonlyLateinit()
    name!: string;
}

const person = new Person();
person.name = "Alice";
console.log(person.name); // prints "Alice"
person.name = "Bob"; // throws a ReadonlyLateinitAlreadyInitializedException
```

## License

ts-lateinit is licensed under the ISC License.
