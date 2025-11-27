const express = require("express")
const bodyParser = require("body-parser")
const register = require("./api/register")
const cors = require("cors")
const login = require("./api/login")
const beats = require("./api/beats")
const shows = require("./api/shows")

const app = express()
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://beatstore-lilac.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/api/register", register)
app.post("/api/login", login)
app.use("/api/beats", beats)
app.use("/api/shows", shows)

app.post("/api/epayco/confirm", (req, res) => {
  console.log("Confirmación de ePayco recibida:", req.body);

  res.send("ok");
})

app.listen(5000, () => console.log("Backend en http://localhost:5000"))

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log("Backend corriendo en el puerto " + PORT);
// });
