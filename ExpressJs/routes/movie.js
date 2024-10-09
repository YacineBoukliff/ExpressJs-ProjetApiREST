import express from 'express';
import mongoose from "mongoose";
import Joi from "joi";
import { Genre } from "./film.js";

const router = express.Router();

const movieSchemaJoi = Joi.object({
    title: Joi.string().min(3).max(50).trim().required()
        .messages({
            'string.min': 'Le titre doit avoir au moins {#limit} caractères',
            'string.max': 'Le titre ne doit pas dépasser {#limit} caractères',
            'any.required': 'Le titre est requis'
        }),
    genreId: Joi.string().required().messages({
        'any.required': 'L\'ID du genre est requis'
    }),
    numberInStock: Joi.number().min(0).max(50).required()
        .messages({
            'number.min': 'Le nombre en stock doit être au moins {#limit}',
            'number.max': 'Le nombre en stock ne doit pas dépasser {#limit}',
            'any.required': 'Le nombre en stock est requis'
        }),
    dailyRentalRate: Joi.number().min(0).max(50).required()
        .messages({
            'number.min': 'Le taux de location quotidien doit être au moins {#limit}',
            'number.max': 'Le taux de location quotidien ne doit pas dépasser {#limit}',
            'any.required': 'Le taux de location quotidien est requis'
        })
});

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 50,
        required: true 
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0, 
        max: 50,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0, 
        max: 50,
        required: true
    }
});

const Movie = mongoose.model('Movie', MovieSchema);


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

export default router;