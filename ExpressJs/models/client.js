import mongoose from "mongoose";
import Joi from "joi";

export const SchemaClient = Joi.object({
    nom: Joi.string().min(3).max(30).regex(/.*[a-zA-Z].*/).trim().required()
        .messages({
            'string.pattern.base': 'Le nom doit contenir au moins une lettre',
            'string.min': 'Le nom doit avoir au moins {#limit} caractères',
            'string.max': 'Le nom ne doit pas dépasser {#limit} caractères',
            'any.required': 'Le nom est requis'
        }),

    isGold: Joi.boolean().default(false),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required()
        .messages({
            'string.length': 'Le numéro de téléphone doit avoir exactement {#limit} chiffres',
            'string.pattern.base': 'Le numéro de téléphone ne doit contenir que des chiffres',
            'any.required': 'Le numéro de téléphone est requis'
        })
});

 const ClientSchema = mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est requis'],
        minlength: [3, 'Le nom doit avoir au moins 3 caractères'],
        maxlength: [30, 'Le nom ne doit pas dépasser 30 caractères'],
        trim: true,
        validate: {
            validator: v => /.*[a-zA-Z].*/.test(v),
            message: "Le nom doit contenir au moins une lettre"
        }
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: [true, 'Le numéro de téléphone est requis'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} n'est pas un numéro de téléphone valide! Il doit contenir exactement 10 chiffres.`
        }
    }
});

export const Client = mongoose.model('Client', ClientSchema);


