const yup = require("./yup");

const chargesRegistrationSchema = yup.object().shape({
  valor: yup.number().required("O campo 'Valor' é obrigatório."),
  data_vencimento: yup
    .string()
    .required("O campo 'Data de Vencimento' é obrigatório."),
  status: yup.string().required("O campo 'Status' é obrigatório."),
  descricao: yup.string().required("O campo 'Descrição' é obrigatório."),
});

module.exports = chargesRegistrationSchema;
