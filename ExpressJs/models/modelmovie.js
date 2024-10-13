import Joi from "joi";
import mongoose from "mongoose";

export const movieSchemaJoi = Joi.object({
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

export const MovieSchema = new mongoose.Schema({
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

export const Movie = mongoose.model('Movie', MovieSchema);