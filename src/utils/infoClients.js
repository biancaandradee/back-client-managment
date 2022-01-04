const infoClients = (clients) => {
  return {
    quantidade_clients: clients.length,
    status_clientes: clients.length > 0 ? clients[0].status : "",
    clientes: clients.length > 0 ? clients : [],
  };
};

module.exports = { infoClients };
