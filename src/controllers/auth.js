const knex = require("../db/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginSchema = require("../validations/loginSchema");

const login = async (req, res) => {
  const { email_usuario, senha } = req.body;

  try {
    await loginSchema.validate(req.body);

    const user = await knex("usuarios").where({ email_usuario }).first();

    if (!user) {
      return res
        .status(404)
        .json({ mensagem: "O usuário não foi encontrado." });
    }

    const correctPassword = await bcrypt.compare(senha, user.senha);

    if (!correctPassword) {
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha incorretos." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_HASH, {
      expiresIn: "8h",
    });

    const { senha: _, ...userWithoutPassword } = user;

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  login,
};
