import dns from "dns"
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");


import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/DB/index.js";



const PORT = process.env.PORT ;
 let server;
connectDB();
  server = app.listen(PORT,() => {
  console.log(`Server is running on port ${PORT}`);
});




// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Graceful shutdown on SIGTERM (Docker/K8s sends this)
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});