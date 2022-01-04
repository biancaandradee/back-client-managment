const { normalizeStatus } = require("./normalizeStatus");

const normalizeCharges = (charges) => {
  return charges.map((charge) => {
    return {
      ...charge,
      status: normalizeStatus(charge),
    };
  });
};

module.exports = { normalizeCharges };
