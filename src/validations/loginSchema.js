const yup = require("./yup");

const loginSchema = yup.object().shape({
  email_usuario: yup.string().email().required(),
  senha: yup.string().required(),
});

module.exports = loginSchema;
