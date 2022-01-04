const knex = require("../db/connection");
const jwt = require("jsonwebtoken");

const loginFilter = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ mensagem: "Um token de autenticação válido deve ser enviado." });
  }

  try {
    const token = authorization.replace("Bearer ", "").trim();

    const { id } = jwt.verify(token, process.env.JWT_HASH);

    const userExists = await knex("usuarios").where({ id }).first();

    if (!userExists) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    const { senha, ...user } = userExists;

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }
};

module.exports = loginFilter;
