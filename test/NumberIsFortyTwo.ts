import { AsyncSpecification } from '../index';

export class NumberIsFortyTwo extends AsyncSpecification<number> {
  async isSatisfiedBy(n: number) {
    return n === 42;
  }
}
