import express from 'express';
import film from "../routes/film.js"
import clients from '../routes/clients.js'
import rentals from '../routes/rentals.js';
import movie from '../routes/movie.js'
import users from "../routes/users.js"
import mongoose from "mongoose";

const app = express()

mongoose.connect('mongodb://localhost/film')
  .then(() => {console.log("Connexion a MongoDB réussie")})
  .catch((error) => {console.error("Connexion a mongo db échoué" , error.message)});

app.use(express.json())

app.use("/api/film/", film)
app.use("/api/clients/", clients)
app.use("/api/movie/", movie)
app.use('/api/rentals', rentals);
app.use('/api/users', users);

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Demarre sur le port : ${port}`)
})