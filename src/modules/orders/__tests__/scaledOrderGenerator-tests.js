import _ from "lodash";
import { generateOrders } from "../scaledOrderGenerator";
import { ORDER_DISTRIBUTIONS } from "../constants";

const tickSize = 0.5;

it("should fail when upper price is less than lower price", () => {
  const order = {
    amount: 100,
    orderCount: 5,
    priceLower: 11,
    priceUpper: 10,
    distribution: ORDER_DISTRIBUTIONS.FLAT.key,
    tickSize
  };

  expect(generateOrders(order)).toBeInstanceOf(Error);
});

it("should fail when amount is less than two", () => {
  const order = {
    amount: 1,
    orderCount: 5,
    priceLower: 100,
    priceUpper: 200,
    distribution: ORDER_DISTRIBUTIONS.FLAT.key,
    tickSize
  };

  expect(generateOrders(order)).toBeInstanceOf(Error);
});

it("should fail when number of orders is less than two", () => {
  const order = {
    amount: 100,
    orderCount: 1,
    priceLower: 100,
    priceUpper: 200,
    distribution: ORDER_DISTRIBUTIONS.FLAT.key,
    tickSize
  };

  expect(generateOrders(order)).toBeInstanceOf(Error);
});

it("should fail when number of orders is more than 200", () => {
  const order = {
    amount: 100,
    orderCount: 201,
    priceLower: 100,
    priceUpper: 200,
    distribution: ORDER_DISTRIBUTIONS.FLAT.key,
    tickSize
  };

  expect(generateOrders(order)).toBeInstanceOf(Error);
});

describe("flat distribution", () => {
  const workingFlatOrder = () => ({
    amount: 100,
    orderCount: 5,
    priceLower: 100,
    priceUpper: 200,
    distribution: ORDER_DISTRIBUTIONS.FLAT.key,
    tickSize
  });

  it("should return the expected number of orders", () => {
    const order = workingFlatOrder();

    const generatedOrders = generateOrders(order);

    expect(generatedOrders).toBeInstanceOf(Array);
    expect(generatedOrders).toHaveLength(order.orderCount);
  });

  it("should return an evenly distributed amount", () => {
    const order = workingFlatOrder();

    const expectedAmount = order.amount / order.orderCount;

    const generatedOrders = generateOrders(order);
    const amountsAreEqual = generatedOrders.every(
      x => x.amount === expectedAmount
    );

    expect(amountsAreEqual).toBe(true);
  });
});

describe("decreasing distribution", () => {
  const workingDecreasingOrder = () => ({
    amount: 100,
    orderCount: 5,
    priceLower: 100,
    priceUpper: 200,
    distribution: ORDER_DISTRIBUTIONS.DECREASING.key,
    tickSize
  });

  it("should return the expected number of orders", () => {
    const order = workingDecreasingOrder();

    const generatedOrders = generateOrders(order);

    expect(generatedOrders).toBeInstanceOf(Array);
    expect(generatedOrders).toHaveLength(order.orderCount);
  });

  it("should return a decreasing amount", () => {
    const order = workingDecreasingOrder();

    const generatedOrders = generateOrders(order);

    const expectedResult = [
      { price: 100, amount: 35 },
      { price: 125, amount: 27 },
      { price: 150, amount: 19 },
      { price: 175, amount: 13 },
      { price: 200, amount: 6 }
    ];

    expect(JSON.stringify(generatedOrders)).toEqual(
      JSON.stringify(expectedResult)
    );
  });

  it("should return the epected amount", () => {
    const order = workingDecreasingOrder();

    const generatedOrders = generateOrders(order);
    const sum = _.sumBy(generatedOrders, "amount");

    expect(sum).toEqual(order.amount);
  });
});

describe("increasing distribution", () => {
  const workingIncreasingOrder = () => ({
    amount: 100,
    orderCount: 5,
    priceLower: 100,
    priceUpper: 200,
    distribution: ORDER_DISTRIBUTIONS.INCREASING.key,
    tickSize
  });

  it("should return the expected number of orders", () => {
    const order = workingIncreasingOrder();

    const generatedOrders = generateOrders(order);

    expect(generatedOrders).toBeInstanceOf(Array);
    expect(generatedOrders).toHaveLength(order.orderCount);
  });

  it("should return an increasing amount ", () => {
    const order = workingIncreasingOrder();

    const generatedOrders = generateOrders(order);

    const expectedResult = [
      { price: 100, amount: 5 },
      { price: 125, amount: 13 },
      { price: 150, amount: 20 },
      { price: 175, amount: 27 },
      { price: 200, amount: 35 }
    ];

    expect(JSON.stringify(generatedOrders)).toEqual(
      JSON.stringify(expectedResult)
    );
  });

  it("should return the epected amount", () => {
    const order = workingIncreasingOrder();

    const generatedOrders = generateOrders(order);
    const sum = _.sumBy(generatedOrders, "amount");

    expect(sum).toEqual(order.amount);
  });
});
