const knex = require("../db/connection");
const chargesRegistrationSchema = require("../validations/chargesRegistrationSchema");
const chargesUpdateSchema = require("../validations/chargesUpdateSchema");
const { normalizeCharges } = require("../utils/normalizeCharges");

const showCharges = async (req, res) => {
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

    return res.status(200).json(normalizeCharges(charges));
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const detailCharges = async (req, res) => {
  const { idCliente } = req.params;

  try {
    const clientExists = await knex("clientes")
      .where({ id: idCliente })
      .first();

    if (!clientExists) {
      return res.status(400).json({
        mensagem: "Cliente não encontrado.",
      });
    }

    const charges = await knex("cobrancas")
      .leftJoin("clientes", "clientes.id", "cobrancas.cliente_id")
      .select(
        "cobrancas.id",
        "cliente_id",
        "clientes.nome_cliente",
        "valor",
        "data_vencimento",
        "status",
        "descricao"
      )
      .where({ cliente_id: idCliente })
      .returning("*");
    return res.status(200).json(normalizeCharges(charges));
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const getCharges = async (req, res) => {
  const { idCobranca } = req.params;
  try {
    const chargesExists = await knex("cobrancas")
      .where({ id: idCobranca })
      .first();
    if (!chargesExists) {
      return res.status(404).json({ mensagem: "Cobrança não encontrada." });
    }
    const charge = await knex("cobrancas")
      .innerJoin("clientes", "clientes.id", "cobrancas.cliente_id")
      .select(
        "cobrancas.id as cobranca_id",
        "clientes.nome_cliente",
        "cobrancas.valor",
        "cobrancas.data_vencimento",
        "cobrancas.status",
        "cobrancas.descricao"
      )
      .where({ "cobrancas.id": idCobranca })
      .first();
    return res.status(200).json(normalizeCharges([charge]));
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const registerCharges = async (req, res) => {
  const { valor, data_vencimento, status, descricao } = req.body;
  const { idCliente } = req.params;

  try {
    const clientExists = await knex("clientes")
      .where({ id: idCliente })
      .first();

    if (!clientExists) {
      return res.status(400).json({
        mensagem: "Cliente não encontrado.",
      });
    }

    await chargesRegistrationSchema.validate(req.body);

    const charges = await knex("cobrancas")
      .insert({
        cliente_id: idCliente,
        valor,
        data_vencimento: new Date(data_vencimento),
        status,
        descricao,
      })
      .returning("*");

    if (!charges) {
      return res
        .status(500)
        .json({ mensagem: "Não foi possível cadastrar a cobrança." });
    }

    return res
      .status(201)
      .json({ mensagem: "Cobrança cadastrada com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const updateCharges = async (req, res) => {
  const { valor, data_vencimento, status, descricao } = req.body;

  const { idCobranca } = req.params;

  try {
    await chargesUpdateSchema.validate(req.body);

    const chargesExists = await knex("cobrancas")
      .where({ id: idCobranca })
      .first();

    if (!chargesExists) {
      return res.status(404).json({ mensagem: "Cobrança não encontrada." });
    }

    let updatedCharges = await knex("cobrancas")
      .where({ id: idCobranca })
      .update({
        valor,
        data_vencimento,
        status,
        descricao,
      });

    if (!updatedCharges) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível atualizar a cobrança." });
    }
    return res
      .status(200)
      .json({ mensagem: "Cobrança foi atualizada com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deleteCharges = async (req, res) => {
  const { idCobranca } = req.params;

  try {
    const chargesExists = await knex("cobrancas")
      .where({ id: idCobranca })
      .first();

    if (!chargesExists) {
      return res.status(404).json({ mensagem: "Cobrança não encontrada." });
    }

    if (
      chargesExists.status === "Paga" ||
      chargesExists.data_vencimento < Date.now()
    ) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível excluir a cobrança." });
    }

    const deletedCharges = await knex("cobrancas")
      .del()
      .where({ id: idCobranca });

    if (!deletedCharges) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível excluir a cobrança." });
    }

    return res.status(200).json({ mensagem: "Cobrança excluída com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  showCharges,
  getCharges,
  detailCharges,
  registerCharges,
  updateCharges,
  deleteCharges,
};
