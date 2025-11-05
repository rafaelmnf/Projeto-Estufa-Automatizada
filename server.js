const express = require("express");
const cors = require("cors");
const cron = require('node-cron');
const climaController = require("./src/controllers/climaController");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

cron.schedule('*/5 * * * *', () => {
  console.log('⏱️ Coletando dados do clima (A cada 5 minutos)...');
  climaController.coletarEGravar();
});

app.use(express.json());

const authRoutes = require("./src/routes/auth");
const estufaRoutes = require("./src/routes/estufa");

app.use("/", authRoutes);
app.use("/estufa", estufaRoutes);

app.listen(PORT, () => console.log(`API on :${PORT}`));
