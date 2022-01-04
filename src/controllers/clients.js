const knex = require("../db/connection");
const clientRegistrationSchema = require("../validations/clientRegistrationSchema");
const clientUpdateSchema = require("../validations/clientUpdateSchema");

const showClients = async (req, res) => {
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
    return res.status(200).json(allClients);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const registerClient = async (req, res) => {
  const {
    nome_cliente,
    email_cliente,
    cpf_cliente,
    telefone_cliente,
    cep,
    logradouro,
    complemento,
    bairro,
    cidade,
    estado,
  } = req.body;

  try {
    await clientRegistrationSchema.validate(req.body);

    const clientExists = await knex("clientes")
      .where({ email_cliente })
      .first();

    if (clientExists) {
      return res.status(400).json({
        mensagem: "E-mail informado já cadastrado.",
      });
    }

    const cpfClientExists = await knex("clientes")
      .where({ cpf_cliente })
      .first();

    if (cpfClientExists) {
      return res.status(400).json({
        mensagem: "CPF informado já cadastrado.",
      });
    }

    const client = await knex("clientes")
      .insert({
        nome_cliente,
        email_cliente,
        cpf_cliente,
        telefone_cliente,
        cep,
        logradouro,
        complemento,
        bairro,
        cidade,
        estado,
      })
      .returning("*");

    if (!client) {
      return res
        .status(500)
        .json({ mensagem: "Não foi possível cadastrar o cliente." });
    }
    return res
      .status(201)
      .json({ mensagem: "Cliente cadastrado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const getClient = async (req, res) => {
  const { id } = req.params;

  try {
    const clientExists = await knex("clientes").where({ id }).first();

    if (!clientExists) {
      return res.status(404).json({ mensagem: "Cliente não encontrado." });
    }

    return res.status(200).json(clientExists);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const updateClient = async (req, res) => {
  const {
    nome_cliente,
    email_cliente,
    cpf_cliente,
    telefone_cliente,
    cep,
    logradouro,
    complemento,
    bairro,
    cidade,
    estado,
  } = req.body;

  const { id } = req.params;

  try {
    await clientUpdateSchema.validate(req.body);

    const clientExists = await knex("clientes").where({ id }).first();

    if (!clientExists) {
      return res.status(404).json({ mensagem: "Cliente não encontrado." });
    }

    if (email_cliente) {
      if (email_cliente !== clientExists.email_cliente) {
        const emailClientExists = await knex("clientes")
          .where({ email_cliente })
          .first();

        if (emailClientExists) {
          return res.status(400).json({
            mensagem: "E-mail informado já cadastrado.",
          });
        }
      }
    }

    if (cpf_cliente) {
      if (cpf_cliente !== clientExists.cpf_cliente) {
        const cpfClientExists = await knex("clientes")
          .where({ cpf_cliente })
          .first();

        if (cpfClientExists) {
          return res.status(400).json({
            mensagem: "CPF informado já cadastrado.",
          });
        }
      }
    }

    let updatedClient = await knex("clientes").where({ id }).update({
      nome_cliente,
      email_cliente,
      cpf_cliente,
      telefone_cliente,
      cep,
      logradouro,
      complemento,
      bairro,
      cidade,
      estado,
    });

    if (!updatedClient) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível atualizar o cliente." });
    }
    return res
      .status(200)
      .json({ mensagem: "Cliente foi atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const clientExists = await knex("clientes").where({ id }).first();

    if (!clientExists) {
      return res.status(404).json({ mensagem: "Cliente não encontrado." });
    }

    const deletedClient = await knex("clientes").del().where({ id });

    if (!deletedClient) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível excluir o cliente." });
    }

    return res.status(200).json({ mensagem: "Cliente excluído com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  showClients,
  registerClient,
  getClient,
  updateClient,
  deleteClient,
};
