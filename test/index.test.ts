import { expect } from 'chai';
import { AsyncSpecification } from '..';
import { NumberIsFortyTwo } from './NumberIsFortyTwo';
import { NumberIsGreaterThanTen } from './NumberIsGreaterThanTen';
import { NumberIsOdd } from './NumberIsOdd';
import { NumberIsPrime } from './NumberIsPrime';

function setup() {
  const isFortyTwo = new NumberIsFortyTwo();
  const isGreaterThanTen = new NumberIsGreaterThanTen();
  const isOdd = new NumberIsOdd();
  const isPrime = new NumberIsPrime();
  return { isFortyTwo, isGreaterThanTen, isOdd, isPrime };
}

describe('AsyncSpecification', () => {
  it('and', async () => {
    const { isFortyTwo, isGreaterThanTen, isOdd, isPrime } = setup();

    const result1 = await isGreaterThanTen.and(isOdd).isSatisfiedBy(11);
    expect(result1).to.be.true;

    const result2 = await isOdd.and(isGreaterThanTen).isSatisfiedBy(11);
    expect(result2).to.be.true;

    const result3 = await isFortyTwo.and(isPrime).isSatisfiedBy(42);
    expect(result3).to.be.false;

    const result5 = await isOdd
      .and(isPrime)
      .and(isGreaterThanTen)
      .isSatisfiedBy(41);
    expect(result5).to.be.true;

    const result6 = await isOdd.and(isPrime).isSatisfiedBy(2);
    expect(result6).to.be.false;
  });

  it('andNot', async () => {
    const { isFortyTwo, isGreaterThanTen, isOdd, isPrime } = setup();

    const result1 = await isGreaterThanTen.andNot(isOdd).isSatisfiedBy(11);
    expect(result1).to.be.false;

    const result2 = await isOdd.andNot(isGreaterThanTen).isSatisfiedBy(9);
    expect(result2).to.be.true;

    const result3 = await isFortyTwo.andNot(isPrime).isSatisfiedBy(42);
    expect(result3).to.be.true;

    const result5 = await isOdd
      .andNot(isPrime)
      .andNot(isGreaterThanTen)
      .isSatisfiedBy(9);
    expect(result5).to.be.true;

    const result6 = await isOdd.andNot(isPrime).isSatisfiedBy(8);
    expect(result6).to.be.false;
  });

  it('or', async () => {
    const { isFortyTwo, isGreaterThanTen, isOdd, isPrime } = setup();

    const result1 = await isGreaterThanTen.or(isOdd).isSatisfiedBy(12);
    expect(result1).to.be.true;

    const result2 = await isOdd.or(isGreaterThanTen).isSatisfiedBy(12);
    expect(result2).to.be.true;

    const result3 = await isFortyTwo.or(isPrime).isSatisfiedBy(42);
    expect(result3).to.be.true;

    const result5 = await isOdd
      .or(isPrime)
      .or(isGreaterThanTen)
      .isSatisfiedBy(4);
    expect(result5).to.be.false;
  });

  it('orNot', async () => {
    const { isFortyTwo, isGreaterThanTen, isOdd, isPrime } = setup();

    const result1 = await isGreaterThanTen.orNot(isOdd).isSatisfiedBy(11);
    expect(result1).to.be.true;

    const result2 = await isGreaterThanTen.orNot(isOdd).isSatisfiedBy(8);
    expect(result2).to.be.true;

    const result3 = await isFortyTwo.orNot(isPrime).isSatisfiedBy(41);
    expect(result3).to.be.false;

    const result5 = await isOdd
      .orNot(isPrime)
      .orNot(isGreaterThanTen)
      .orNot(isFortyTwo)
      .isSatisfiedBy(41);
    expect(result5).to.be.true;
  });

  it('not', async () => {
    const { isFortyTwo, isGreaterThanTen, isOdd, isPrime } = setup();

    const result1 = await isGreaterThanTen.and(isOdd.not()).isSatisfiedBy(11);
    expect(result1).to.be.false;

    const result2 = await isGreaterThanTen.not().or(isOdd).isSatisfiedBy(12);
    expect(result2).to.be.false;

    const result3 = await isFortyTwo.orNot(isPrime.not()).isSatisfiedBy(41);
    expect(result3).to.be.true;
  });

  it('all together...', async () => {
    const { isFortyTwo, isGreaterThanTen, isOdd, isPrime } = setup();

    const result1 = await isGreaterThanTen
      .and(isOdd.not())
      .or(isPrime)
      .isSatisfiedBy(13);
    expect(result1).to.be.true;

    const result2 = await isGreaterThanTen
      .and(isOdd.not())
      .or(isFortyTwo)
      .isSatisfiedBy(42);
    expect(result2).to.be.true;

    const result3 = await isGreaterThanTen
      .and(isOdd.not())
      .orNot(isFortyTwo)
      .isSatisfiedBy(42);
    expect(result3).to.be.false;
  });

  it('throw...', async () => {
    const { isFortyTwo } = setup();

    class ThrowsSpecification extends AsyncSpecification<number> {
      async isSatisfiedBy(n: number): Promise<boolean> {
        throw new Error('Oh no!');
      }
    }

    const throwsSpecification = new ThrowsSpecification();

    let error: Error;
    try {
      await isFortyTwo.and(throwsSpecification).isSatisfiedBy(42);
    } catch (e) {
      error = e;
    }

    expect(error.message).to.equal('Oh no!');
  });
});
