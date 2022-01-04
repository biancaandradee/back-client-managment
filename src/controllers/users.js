const knex = require("../db/connection");
const bcrypt = require("bcrypt");
const userRegistrationSchema = require("../validations/userRegistrationSchema");
const userUpdateSchema = require("../validations/userUpdateSchema");

const registerUser = async (req, res) => {
  const { nome_usuario, email_usuario, senha } = req.body;

  try {
    await userRegistrationSchema.validate(req.body);

    const userExists = await knex("usuarios").where({ email_usuario }).first();

    if (userExists) {
      return res.status(400).json({
        mensagem: "E-mail informado já cadastrado.",
      });
    }

    const encryptedPassword = await bcrypt.hash(senha, 10);

    const user = await knex("usuarios")
      .insert({
        nome_usuario,
        email_usuario,
        senha: encryptedPassword,
      })
      .returning("*");

    if (!user) {
      return res
        .status(500)
        .json({ mensagem: "Não foi possível cadastrar o usuário." });
    }

    return res
      .status(201)
      .json({ mensagem: "Usuário cadastrado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const getUser = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateUser = async (req, res) => {
  const { nome_usuario, email_usuario, cpf_usuario, telefone_usuario } =
    req.body;
  let { senha } = req.body;
  const { id } = req.user;

  if (!nome_usuario || !email_usuario) {
    return res.status(404).json({
      mensagem: "É necessário informar ao menos um campo para atualização.",
    });
  }

  try {
    await userUpdateSchema.validate(req.body);

    const userExists = await knex("usuarios").where({ id }).first();

    if (!userExists) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    if (senha) {
      senha = await bcrypt.hash(senha, 10);
    }

    if (email_usuario !== req.user.email_usuario) {
      const emailUserExists = await knex("usuarios")
        .where({ email_usuario })
        .first();

      if (emailUserExists) {
        return res.status(400).json({
          mensagem: "E-mail informado já cadastrado.",
        });
      }
    }

    if (cpf_usuario) {
      if (cpf_usuario !== req.user.cpf_usuario) {
        const cpfUserExists = await knex("usuarios")
          .where({ cpf_usuario })
          .first();

        if (cpfUserExists) {
          return res.status(400).json({
            mensagem: "CPF informado já cadastrado.",
          });
        }
      }
    }

    const updatedUser = await knex("usuarios")
      .where({ id })
      .update({
        nome_usuario,
        email_usuario,
        senha: senha ? senha : undefined,
        cpf_usuario,
        telefone_usuario,
      });

    if (!updatedUser) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível atualizar o usuário." });
    }

    return res
      .status(200)
      .json({ mensagem: "Usuário foi atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.user;

  try {
    const userExists = await knex("usuarios").where({ id }).first();

    if (!userExists) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    const deletedUser = await knex("usuarios").del().where({ id });

    if (!deletedUser) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível excluir o usuário." });
    }

    return res.status(200).json({ mensagem: "Usuário excluído com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  registerUser,
  getUser,
  updateUser,
  deleteUser,
};
