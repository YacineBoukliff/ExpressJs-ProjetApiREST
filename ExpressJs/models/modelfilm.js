import mongoose from "mongoose";
import Joi from "joi";

export const genreSchema = Joi.object({
    genre: Joi.string().min(3).max(30).regex(/.*[a-zA-Z].*/).trim().required()
        .messages({
            'string.pattern.base': 'Le genre doit contenir au moins une lettre',
            'string.min': 'Le genre doit avoir au moins {#limit} caractères',
            'string.max': 'Le genre ne doit pas dépasser {#limit} caractères',
            'any.required': 'Le genre est requis'
        })
});

export const FilmSchema = new mongoose.Schema({
    genre: {
        type: String,
        required: [true, 'Le genre est requis'],
        minlength: [3, 'Le genre doit avoir au moins 3 caractères'],
        maxlength: [30, 'Le genre ne doit pas dépasser 30 caractères'],
        trim: true,
        validate: {
            validator: v => /.*[a-zA-Z].*/.test(v),
            message: "Le genre doit contenir au moins une lettre"
        }
    }
});