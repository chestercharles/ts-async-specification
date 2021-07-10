export interface IAsyncSpecification<T> {
  isSatisfiedBy(object: T): Promise<boolean>;
  and(spec: IAsyncSpecification<T>): IAsyncSpecification<T>;
  andNot(spec: IAsyncSpecification<T>): IAsyncSpecification<T>;
  or(spec: IAsyncSpecification<T>): IAsyncSpecification<T>;
  orNot(spec: IAsyncSpecification<T>): IAsyncSpecification<T>;
  not(): IAsyncSpecification<T>;
}

export abstract class AsyncSpecification<T> implements IAsyncSpecification<T> {
  abstract isSatisfiedBy(object: T): Promise<boolean>;

  public and(specification: IAsyncSpecification<T>): IAsyncSpecification<T> {
    return new AndSpecification(this, specification);
  }

  public andNot(specification: IAsyncSpecification<T>): IAsyncSpecification<T> {
    return new AndNotSpecification(this, specification);
  }

  public or(specification: IAsyncSpecification<T>): IAsyncSpecification<T> {
    return new OrSpecification(this, specification);
  }

  public orNot(specification: IAsyncSpecification<T>): IAsyncSpecification<T> {
    return new OrNotSpecification(this, specification);
  }

  public not(): IAsyncSpecification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends AsyncSpecification<T> {
  constructor(
    private leftCondition: IAsyncSpecification<T>,
    private rightCondition: IAsyncSpecification<T>
  ) {
    super();
  }

  async isSatisfiedBy(object: T): Promise<boolean> {
    const leftIsSatisfied = await this.leftCondition.isSatisfiedBy(object);
    if (!leftIsSatisfied) {
      return false;
    }

    const rightIsSatisfied = await this.rightCondition.isSatisfiedBy(object);
    if (!rightIsSatisfied) {
      return false;
    }

    return true;
  }
}

class AndNotSpecification<T> extends AsyncSpecification<T> {
  constructor(
    private leftCondition: IAsyncSpecification<T>,
    private rightCondition: IAsyncSpecification<T>
  ) {
    super();
  }

  async isSatisfiedBy(object: T): Promise<boolean> {
    const leftIsSatisfied = await this.leftCondition.isSatisfiedBy(object);
    if (!leftIsSatisfied) {
      return false;
    }

    const rightIsSatisfied = await this.rightCondition.isSatisfiedBy(object);
    if (rightIsSatisfied) {
      return false;
    }

    return true;
  }
}

class NotSpecification<T> extends AsyncSpecification<T> {
  constructor(private specification: IAsyncSpecification<T>) {
    super();
  }

  async isSatisfiedBy(object: T): Promise<boolean> {
    return !this.specification.isSatisfiedBy(object);
  }
}

class OrNotSpecification<T> extends AsyncSpecification<T> {
  constructor(
    private leftCondition: IAsyncSpecification<T>,
    private rightCondition: IAsyncSpecification<T>
  ) {
    super();
  }

  async isSatisfiedBy(object: T): Promise<boolean> {
    const leftIsSatisfied = await this.leftCondition.isSatisfiedBy(object);
    if (leftIsSatisfied) {
      return true;
    }

    const rightIsSatisfied = await this.rightCondition.isSatisfiedBy(object);
    if (!rightIsSatisfied) {
      return true;
    }

    return false;
  }
}

class OrSpecification<T> extends AsyncSpecification<T> {
  constructor(
    private leftCondition: IAsyncSpecification<T>,
    private rightCondition: IAsyncSpecification<T>
  ) {
    super();
  }

  async isSatisfiedBy(object: T): Promise<boolean> {
    const leftIsSatisfied = await this.leftCondition.isSatisfiedBy(object);
    if (leftIsSatisfied) {
      return true;
    }

    const rightIsSatisfied = await this.rightCondition.isSatisfiedBy(object);
    if (rightIsSatisfied) {
      return true;
    }

    return false;
  }
}
