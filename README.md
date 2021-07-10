# ts-async-specification

A asynchronous implementation of the specification pattern

## Installation

`npm i ts-async-specification`

## Usage

Create a class that extends `AsyncSpecification` by override the abstract `isSatisfiedBy` method. Your new specification will then have the following interface:

```typescript
interface IAsyncSpecification<T> {
  isSatisfiedBy(object: T): Promise<boolean>;
  and(spec: IAsyncSpecification<T>): IAsyncSpecification<T>;
  andNot(spec: IAsyncSpecification<T>): IAsyncSpecification<T>;
  or(spec: IAsyncSpecification<T>): IAsyncSpecification<T>;
  orNot(spec: IAsyncSpecification<T>): IAsyncSpecification<T>;
  not(): IAsyncSpecification<T>;
}
```

```typescript
import { AsyncSpecification } from 'ts-async-specification';

class NumberIsFortyTwo extends AsyncSpecification<number> {
  async isSatisfiedBy(n: number) {
    return n === 42;
  }
}

class NumberIsOdd extends AsyncSpecification<number> {
  async isSatisfiedBy(n: number) {
    return Boolean(n % 2);
  }
}

const isFortyTwo = new NumberIsFortyTwo();
await isFortyTwo.isSatisfiedBy(42); // true
await isFortyTwo.isSatisfiedBy(41); // false

const isOdd = new NumberIsOdd();
await isFortyTwo.or(isOdd).isSatisfiedBy(41); // true
await isFortyTwo.and(isOdd).isSatisfiedBy(41); // false
```
