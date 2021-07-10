import { AsyncSpecification } from '../index';

export class NumberIsGreaterThanTen extends AsyncSpecification<number> {
  async isSatisfiedBy(n: number) {
    return n > 10;
  }
}
