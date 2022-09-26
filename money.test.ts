import { Money, Expression, Bank, Sum } from "./money";

test("multiplication", () => {
  const five: Money = Money.dollar(5);
  expect(Money.dollar(10)).toEqual(five.times(2));
  expect(Money.dollar(15)).toEqual(five.times(3));
});

test("equality", () => {
  expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true);
  expect(Money.dollar(5).equals(Money.dollar(6))).toBe(false);
  expect(Money.franc(5).equals(Money.franc(5))).toBe(true);
});

test("Franc multiplication", () => {
  const five = Money.franc(5);
  expect(Money.franc(10)).toEqual(five.times(2));
  expect(Money.franc(15)).toEqual(five.times(3));
});

test("currency", () => {
  expect("USD").toBe(Money.dollar(1).getCurrency());
  expect("CHF").toBe(Money.franc(1).getCurrency());
});

test("simpleAddition", () => {
  const five: Money = Money.dollar(5);
  const sum: Expression = five.plus(five);
  const bank: Bank = new Bank();
  const reduced: Money = bank.reduce(sum, "USD");
  expect(Money.dollar(10)).toEqual(reduced);
});

test("plusReturnsSum", () => {
  const five: Money = Money.dollar(5);
  const result: Expression = five.plus(five);
  const sum: Sum = result as Sum;
  expect(five).toEqual(sum.augend);
  expect(five).toEqual(sum.addend);
});

test("reduceSum", () => {
  const sum = new Sum(Money.dollar(3), Money.dollar(4));
  const bank = new Bank();
  const result = bank.reduce(sum, "USD");
  expect(Money.dollar(7)).toEqual(result);
});

test("reduceMoney", () => {
  const bank = new Bank();
  const result = bank.reduce(Money.dollar(1), "USD");
  expect(Money.dollar(1)).toEqual(result);
});

test("reduceMoneyDifferentCurrency", () => {
  const bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  const result = bank.reduce(Money.franc(2), "USD");
  expect(Money.dollar(1)).toEqual(result);
});

test("mixedAddition", () => {
  const fiveBucks: Expression = Money.dollar(5);
  const tenFrancs: Expression = Money.franc(10);
  const bank: Bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  const result: Money = bank.reduce(fiveBucks.plus(tenFrancs), "USD");
  expect(Money.dollar(10)).toEqual(result);
});

test("sumPlusMoney", () => {
  const fiveBucks: Expression = Money.dollar(5);
  const tenFrancs: Expression = Money.franc(10);
  const bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  const sum: Expression = new Sum(fiveBucks, tenFrancs).plus(fiveBucks);
  const result: Money = bank.reduce(sum, "USD");
  expect(Money.dollar(15)).toEqual(result);
});

test("sumTimes", () => {
  const fiveBucks = Money.dollar(5);
  const tenFrancs = Money.franc(10);
  const bank = new Bank();
  bank.addRate("CHF", "USD", 2);
  const sum = new Sum(fiveBucks, tenFrancs).times(2);
  const result = bank.reduce(sum, "USD");
  expect(Money.dollar(20)).toEqual(result);
});
