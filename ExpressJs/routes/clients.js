import express from 'express';
import mongoose from "mongoose";
import Joi from "joi";

const router = express.Router();


const SchemaClient = Joi.object({
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

const Client = mongoose.model('Client', ClientSchema);

router.get('/', async (req, res) => {
    const clients = await Client.find().sort("nom");
    res.send(clients);
});

router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("ID invalide");
    }

    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).send("Cet ID n'existe pas");
    res.send(client);
});


router.post("/", async (req, res) => {
    const validationResult = SchemaClient.validate(req.body);
    if (validationResult.error) {
        return res.status(400).send(validationResult.error.details[0].message);
    }
    

    let client = new Client({
         nom: req.body.nom,
         phone: req.body.phone,
        isGold :req.body.isGold});
    await client.save();
    res.status(201).send(client);
});


router.put("/:id", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("ID invalide");
    }
    const validationResult = SchemaClient.validate(req.body);
    if (validationResult.error) {
        return res.status(400).send(validationResult.error.details[0].message);
    }    
    try {
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            { nom: req.body.nom },
            { phone: req.body.phone,},
            { new: true, runValidators: true }
        );
        if (!client) return res.status(404).send("Genre non trouvé");
        res.send(client);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Une erreur est survenue lors de la mise à jour");
    }
});

router.delete("/:id", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("ID invalide");
    }
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).send("client non trouvé");
        res.send({ message: "client supprimé avec succès", client });
    } catch (error) {
        res.status(500).send(`Une erreur est survenue lors de la suppression: ${error.message}`);
    }
});


export default router;