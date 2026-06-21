const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});


const PORT = process.env.PORT || 8000;


const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});