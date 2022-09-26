export interface Expression {
  reduce(bank: Bank, to: string): Money;
  plus(addend: Expression): Expression;
  times(multiplier: number): Expression;
}

export class Bank {
  rates: object = {};

  reduce(source: Expression, to: string) {
    return source.reduce(this, to);
  }

  addRate(from: string, to: string, rate: number): void {
    this.rates[[from, to].toString()] = rate;
  }

  rate(from: string, to: string) {
    if (from === to) return 1;
    const rate = this.rates[[from, to].toString()];
    return rate;
  }
}

export class Money implements Expression {
  amount: number;
  currency: string;

  constructor(amount: number, currency: string) {
    this.amount = amount;
    this.currency = currency;
  }

  equals(object: object): boolean {
    const money = object as Money;
    return (
      this.amount === money.amount && this.getCurrency() === money.getCurrency()
    );
  }

  reduce(bank: Bank, to: string): Money {
    const rate = bank.rate(this.currency, to);
    return new Money(this.amount / rate, to);
  }

  static dollar(amount: number) {
    return new Money(amount, "USD");
  }

  static franc(amount: number) {
    return new Money(amount, "CHF");
  }

  times(multiplier: number): Expression {
    return new Money(this.amount * multiplier, this.currency);
  }

  getCurrency() {
    return this.currency;
  }

  toString(): string {
    return this.amount + " " + this.currency;
  }

  plus(addend: Expression): Expression {
    return new Sum(this, addend);
  }
}

export class Sum implements Expression {
  augend: Expression;
  addend: Expression;

  constructor(augend: Expression, addend: Expression) {
    this.augend = augend;
    this.addend = addend;
  }

  reduce(bank: Bank, to: string) {
    const amount =
      this.augend.reduce(bank, to).amount + this.addend.reduce(bank, to).amount;
    return new Money(amount, to);
  }

  plus(addend: Expression): Expression {
    return new Sum(this, addend);
  }

  times(multiplier: number) {
    return new Sum(
      this.augend.times(multiplier),
      this.addend.times(multiplier)
    );
  }
}
