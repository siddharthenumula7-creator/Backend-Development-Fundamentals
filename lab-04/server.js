const express = require("express");
const authRouter = require("./routes/auth");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({ message: "BDF Lab 4 API is running" });
});

app.use("/", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
