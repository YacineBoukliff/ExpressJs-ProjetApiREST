import mongoose from "mongoose";
import Joi from "joi";
import passwordComplexity from 'joi-password-complexity';

export const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom est requis'],
        minlength: [3, 'Le nom doit avoir au moins 3 caractères'],
        maxlength: [50, 'Le nom ne doit pas dépasser 50 caractères'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        minlength: [5, 'L\'email doit avoir au moins 5 caractères'],
        maxlength: [50, 'L\'email ne doit pas dépasser 50 caractères'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [5, 'Le mot de passe doit avoir au moins 5 caractères'],
        maxlength: [255, 'Le mot de passe ne doit pas dépasser 255 caractères'],
        trim: true
    }
}));


export function ValidateUser(user) {

    const passwordComplexityOptions = {
        min: 5,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
       
    };

    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: passwordComplexity(passwordComplexityOptions).required()
    });

    return schema.validate(user);
}