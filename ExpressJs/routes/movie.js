import express from 'express';
import { Genre } from "./film.js";
import { movieSchemaJoi, Movie } from "../models/modelmovie.js";

const router = express.Router();

// GET tous les films
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().populate('genre', '_id genre').sort("title");
        res.send(movies);
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des films: ' + error.message);
    }
});

// GET un film spécifique par ID
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('genre', '_id genre');
        if (!movie) return res.status(404).send('Film non trouvé.');
        res.send(movie);
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération du film: ' + error.message);
    }
});

// POST un nouveau film
router.post("/", async (req, res) => {
    const { error } = movieSchemaJoi.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    try {
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Genre Invalide');

        let movie = new Movie({ 
            title: req.body.title,
            genre: req.body.genreId,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });
        
        movie = await movie.save();
        await movie.populate('genre', '_id genre');
        res.status(201).send(movie);
    } catch (error) {
        res.status(500).send('Erreur lors de la création du film: ' + error.message);
    }
});

// PUT pour mettre à jour un film
router.put('/:id', async (req, res) => {
    const { error } = movieSchemaJoi.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Genre Invalide');

        const movie = await Movie.findByIdAndUpdate(req.params.id, 
            { 
                title: req.body.title,
                genre: req.body.genreId,
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            }, 
            { new: true }
        );

        if (!movie) return res.status(404).send('Film non trouvé.');

        res.send(movie);
    } catch (error) {
        res.status(500).send('Erreur lors de la mise à jour du film: ' + error.message);
    }
});

// DELETE un film
router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndRemove(req.params.id);
        if (!movie) return res.status(404).send('Film non trouvé.');
        res.send(movie);
    } catch (error) {
        res.status(500).send('Erreur lors de la suppression du film: ' + error.message);
    }
});

export default router;