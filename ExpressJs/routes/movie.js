import express from 'express';
import { Genre } from "./film.js";
import {movieSchemaJoi,Movie} from "../models/modelmovie.js"

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find()
            .populate('genre', '_id genre') 
            .sort("title");
        res.send(movies);
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des films: ' + error.message);
    }
});

router.post("/", async (req, res) => {
    const validationResult = movieSchemaJoi.validate(req.body);
    if (validationResult.error) {
        return res.status(400).send(validationResult.error.details[0].message);
    }
    
    
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Genre Invalide');

        let movie = new Movie({ 
            title: req.body.title,
            genre: req.body.genreId,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });
        
        await movie.save();
        await movie.populate('genre', '_id genre');
        res.status(201).send(movie);

        res.status(500).send('Erreur lors de la création du film: ' + error.message);
    
});

export default router;