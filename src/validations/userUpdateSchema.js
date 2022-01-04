const yup = require("./yup");

const userUpdateSchema = yup.object().shape({
  nome_usuario: yup.string().required("O campo 'Nome' é obrigatório."),
  email_usuario: yup
    .string()
    .email("Informe um e-mail válido.")
    .required("O campo 'E-mail' é obrigatório."),
  senha: yup.string().test("senha", (value = "") => {
    if (value.length > 0) {
      return value.length >= 7 ? true : false;
    }
    return true;
  }),
  cpf_usuario: yup
    .string()
    .min(14, "Deve ser informado um CPF válido.")
    .nullable(),
  telefone_usuario: yup.string().nullable(),
});

module.exports = userUpdateSchema;
