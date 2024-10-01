import express from 'express';
import film from "../routes/film.js"

const app = express()

app.use("/api/film/", film)

app.use(express.json())

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Demarre sur le port : ${port}`)
})