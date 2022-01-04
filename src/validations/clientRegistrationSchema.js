const yup = require("./yup");

const clientRegistrationSchema = yup.object().shape({
  nome_cliente: yup.string().required("O campo 'Nome' é obrigatório."),
  email_cliente: yup
    .string()
    .email("Informe um e-mail válido.")
    .required("O campo 'E-mail' é obrigatório."),
  cpf_cliente: yup
    .string()
    .min(14, "Deve ser informado um CPF válido.")
    .required("O campo 'CPF' é obrigatório."),
  telefone_cliente: yup.string().required("O campo 'Telefone' é obrigatório."),
  cep: yup.string().nullable(),
  logradouro: yup.string().nullable(),
  complemento: yup.string().nullable(),
  bairro: yup.string().nullable(),
  cidade: yup.string().nullable(),
  estado: yup.string().nullable(),
});

module.exports = clientRegistrationSchema;
