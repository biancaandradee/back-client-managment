const yup = require("./yup");

const userRegistrationSchema = yup.object().shape({
  nome_usuario: yup.string().required("O campo 'Nome' é obrigatório."),
  email_usuario: yup
    .string()
    .email("Preencha com um e-mail válido.")
    .required("O campo 'E-mail' é obrigatório."),
  senha: yup
    .string()
    .min(7, "A senha deve ter no mínimo 7 caracteres.")
    .required("O campo 'Senha' é obrigatório."),
});

module.exports = userRegistrationSchema;
