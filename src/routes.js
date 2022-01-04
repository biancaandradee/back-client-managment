const express = require("express");
const routes = express();
const swaggerUi = require("swagger-ui-express");

const loginFilter = require("./filters/loginFilter");
const auth = require("./controllers/auth");
const user = require("./controllers/users");
const client = require("./controllers/clients");
const charges = require("./controllers/charges");
const infos = require("./controllers/infos");

routes.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(require("./swagger.json"))
);

routes.post("/usuario", user.registerUser);

routes.post("/login", auth.login);

routes.use(loginFilter);

routes.get("/perfil", user.getUser);
routes.put("/perfil", user.updateUser);
routes.delete("/perfil", user.deleteUser);

routes.get("/clientes", client.showClients);
routes.get("/clientes/:id", client.getClient);
routes.post("/clientes", client.registerClient);
routes.put("/clientes/:id", client.updateClient);
routes.delete("/clientes/:id", client.deleteClient);

routes.get("/cobrancas", charges.showCharges);
routes.get("/cobrancas/:idCliente", charges.detailCharges);
routes.post("/cobrancas/:idCliente", charges.registerCharges);
routes.put("/cobrancas/:idCobranca", charges.updateCharges);
routes.delete("/cobrancas/:idCobranca", charges.deleteCharges);

routes.get("/cobranca/:idCobranca", charges.getCharges);

routes.get("/info-cobrancas", infos.chargesInfo);
routes.get("/info-clientes", infos.clientsInfo);

module.exports = routes;
