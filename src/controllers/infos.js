const knex = require("../db/connection");
const { normalizeCharges } = require("../utils/normalizeCharges");
const { infoCharges } = require("../utils/infoCharges");
const { infoClients } = require("../utils/infoClients");

const chargesInfo = async (req, res) => {
  try {
    const charges = await knex("cobrancas")
      .join("clientes", "clientes.id", "cobrancas.cliente_id")
      .select(
        "cobrancas.id",
        "cliente_id",
        "clientes.nome_cliente",
        "valor",
        "data_vencimento",
        "status",
        "descricao"
      )
      .returning("*");
    const normalize = normalizeCharges(charges);
    const pendingCharges = infoCharges(
      normalize.filter(({ status }) => status === "Pendente")
    );
    const paidCharges = infoCharges(
      normalize.filter(({ status }) => status === "Paga")
    );
    const overdueCharges = infoCharges(
      normalize.filter(({ status }) => status === "Vencida")
    );
    return res.status(200).json([pendingCharges, paidCharges, overdueCharges]);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const clientsInfo = async (req, res) => {
  try {
    const clients = await knex("clientes")
      .leftJoin("cobrancas", "cobrancas.cliente_id", "clientes.id")
      .select(
        "clientes.id",
        "nome_cliente",
        "cpf_cliente",
        "email_cliente",
        "telefone_cliente",
        "cep",
        "logradouro",
        "complemento",
        "bairro",
        "cidade",
        "estado",
        "cobrancas.data_vencimento as cobranca_vencimento",
        "cobrancas.status as cobranca_status"
      )
      .returning("*");

    const allClients = clients
      .map((client) => {
        const status = clients
          .filter((c) => c.id === client.id)
          .some(
            (c) =>
              c.cobranca_status === "Pendente" &&
              +new Date(c.cobranca_vencimento) < Date.now()
          )
          ? "Inadimplente"
          : "Em dia";
        const { cobranca_status, cobranca_vencimento, ...newClient } = client;
        return { ...newClient, status };
      })
      .filter(
        (client, index) => clients.map((c) => c.id).indexOf(client.id) === index
      );

    const punctualClient = infoClients(
      allClients.filter(({ status }) => status === "Em dia")
    );

    const defaultingClient = infoClients(
      allClients.filter(({ status }) => status === "Inadimplente")
    );

    return res.status(200).json([punctualClient, defaultingClient]);
    // return res.status(200).json([defaultingClient]);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  chargesInfo,
  clientsInfo,
};
