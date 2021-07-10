import { AsyncSpecification } from '../index';

export class NumberIsOdd extends AsyncSpecification<number> {
  async isSatisfiedBy(n: number) {
    return Boolean(n % 2);
  }
}
