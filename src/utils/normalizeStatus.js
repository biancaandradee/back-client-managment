const normalizeStatus = (charges) => {
  const actualDate = Date.now();
  const timestamp = +new Date(charges.data_vencimento);

  if (charges.status === "Paga") {
    return "Paga";
  }

  return timestamp < actualDate ? "Vencida" : "Pendente";
};

module.exports = { normalizeStatus };
