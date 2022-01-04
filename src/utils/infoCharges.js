const infoCharges = (charges) => {
  return {
    valor_total: charges.reduce(
      (previous, current) => Number(previous) + Number(current.valor),
      0
    ),
    quantidade_cobrancas: charges.length,
    status_cobranca: charges.length > 0 ? charges[0].status : "",
    clientes: charges.length > 0 ? charges : [],
  };
};

module.exports = { infoCharges };
