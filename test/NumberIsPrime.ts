import { AsyncSpecification } from '../index';

export class NumberIsPrime extends AsyncSpecification<number> {
  async isSatisfiedBy(n: number) {
    for (var i = 2; i < n; i++) {
      if (n % i === 0) {
        return false;
      }
    }
    return n > 1;
  }
}
