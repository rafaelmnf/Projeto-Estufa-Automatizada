const express = require("express");
const cors = require("cors");
const cron = require('node-cron');
const climaController = require("./src/controllers/climaController");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

cron.schedule('* * * * *', () => {
  console.log('🕐 Coletando dados do clima (a cada minuto)...');
  climaController.coletarEGravar();
});

app.use(express.json());

const authRoutes = require("./src/routes/auth");
const estufaRoutes = require("./src/routes/estufa");
const previsaoRoutes = require("./src/routes/previsao");
const plantasRoutes = require("./src/routes/plantas");

app.use("/", authRoutes);
app.use("/estufa", estufaRoutes);
app.use("/", previsaoRoutes);
app.use("/", plantasRoutes);

app.listen(PORT, () => console.log(`API on :${PORT}`));
