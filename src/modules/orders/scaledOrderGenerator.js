// Inspired by bitfinex. please don't sue me

import _ from "lodash";
import { ORDER_DISTRIBUTIONS } from "./constants";

// Get distribution weights
const getAmountDistribution = (distribution, orderCount) => {
  if (
    distribution === ORDER_DISTRIBUTIONS.DECREASING.key ||
    distribution === ORDER_DISTRIBUTIONS.INCREASING.key
  ) {
    const pricePointPercentages = [];

    // Min and max percentage of the amount allocated per price point
    const minPercentage = 0.05;
    const maxPercentage = 0.4;

    for (let i = 0; i < orderCount; i += 1) {
      pricePointPercentages[i] =
        minPercentage + i * (maxPercentage - minPercentage) / (orderCount + 1);
    }

    if (distribution === "decreasing") {
      return pricePointPercentages.reverse();
    }

    return pricePointPercentages;
  }

  if (distribution === ORDER_DISTRIBUTIONS.FLAT.key) {
    return _.range(orderCount).map(x => 100 / orderCount);
  }

  return new Error(`Unknown distribution type '${distribution}' was passed`);
};

// Distribute an amount based on weighting
const distributeAmount = (total, weights) => {
  let leftover = 0;
  const distributedTotal = [];
  const distributionSum = _.sum(weights);

  weights.forEach(weight => {
    const val = weight * total / distributionSum + leftover;

    const weightedValue = Math.trunc(val);
    leftover = val % 1;

    distributedTotal.push(weightedValue);
  });

  distributedTotal[-1] = _.round(distributedTotal[-1] + leftover);

  return distributedTotal;
};

const generateOrders = ({
  amount,
  orderCount,
  priceLower,
  priceUpper,
  distribution
}) => {
  const weights = getAmountDistribution(distribution, orderCount);
  const orderSizes = distributeAmount(amount, weights);

  const priceDiff = priceUpper - priceLower;
  const stepsPerPricePoint = priceDiff / (orderCount - 1);

  // Generate the prices we're placing orders at
  const orderPrices = _.range(orderCount)
    .map(i => {
      // Lower price
      if (i === 0) {
        return priceLower;
      }

      // Upper price
      if (i === orderCount - 1) {
        return priceUpper;
      }

      return priceLower + stepsPerPricePoint * i;
    })
    .map(price => _.round(price, 0));

  let minPrice = Infinity;
  let maxPrice = -Infinity;

  const orders = orderPrices.reduce((acc, curr, index) => {
    minPrice = Math.min(minPrice, curr);
    maxPrice = Math.max(maxPrice, curr);

    return acc.concat({
      price: curr,
      amount: _.floor(orderSizes[index], 0)
    });
  }, []);

  // Verify that the generated orders match the specification so that we don't end up poor

  if (Math.abs(_.sumBy(orders, order => order.amount)) > Math.abs(amount)) {
    return new Error(`The orders total up to an amount larger than ${amount}`);
  }

  if (minPrice < priceLower) {
    return new Error("Order is lower than the specified lower price");
  }

  if (maxPrice > priceUpper) {
    return new Error("Order is higher than the specified upper price");
  }

  return orders;
};

export { generateOrders };
