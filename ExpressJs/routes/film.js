import express from 'express';
import mongoose from "mongoose";
import Joi from "joi";

const router = express.Router();

const genreSchema = Joi.object({
    genre: Joi.string().min(3).max(20).regex(/.*[a-zA-Z].*/).trim().required()
        .messages({
            'string.pattern.base': 'Le genre doit contenir au moins une lettre',
            'string.min': 'Le genre doit avoir au moins {#limit} caractères',
            'string.max': 'Le genre ne doit pas dépasser {#limit} caractères',
            'any.required': 'Le genre est requis'
        })
});

const FilmSchema = new mongoose.Schema({
    genre: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        trim: true,
        validate: {
            validator: v => v.length > 3,
            message: "Vous devez mettre un genre de film"
        }
    }
});

const Genre = mongoose.model('Genre', FilmSchema);

const validateGenre = (req, res, next) => {
    const { error } = genreSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next();
};

const validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("ID invalide");
    }
    next();
};

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort("genre");
    res.send(genres);
});

router.get('/:id', validateId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Cet ID n'existe pas");
    res.send(genre);
});

router.post("/", validateGenre, async (req, res) => {
    let genre = new Genre({ genre: req.body.genre });
    await genre.save();
    res.status(201).send(genre);
});

router.put("/:id", [validateId, validateGenre], async (req, res) => {
    try {
        const genre = await Genre.findByIdAndUpdate(
            req.params.id,
            { genre: req.body.genre },
            { new: true, runValidators: true }
        );
        if (!genre) return res.status(404).send("Genre non trouvé");
        res.send(genre);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(error.message);
        }
        res.status(500).send("Une erreur est survenue lors de la mise à jour");
    }
});

router.delete("/:id", validateId, async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) return res.status(404).send("Genre non trouvé");
        res.send({ message: "Genre supprimé avec succès", genre });
    } catch (error) {
        res.status(500).send(`Une erreur est survenue lors de la suppression: ${error.message}`);
    }
});

export default router;