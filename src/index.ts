import express from "express";
import { config } from "./config/env.js";
import webhookRoutes from "./routes/webhookRoutes.js";

const app = express();

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});

app.use(express.json());
app.use("/webhook", webhookRoutes);

try {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
} catch (e) {
  console.error("Error starting server", e);
  process.exit(1);
}
