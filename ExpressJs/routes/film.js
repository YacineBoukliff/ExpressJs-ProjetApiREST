import express from 'express';
import mongoose from "mongoose";
import {genreSchema,FilmSchema} from "../models/modelfilm.js"

const router = express.Router();

export const Genre = mongoose.model('Genre', FilmSchema);

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort("genre");
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("ID invalide");
    }

    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Cet ID n'existe pas");
    res.send(genre);
});

router.post("/", async (req, res) => {
    const validationResult = genreSchema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).send(validationResult.error.details[0].message);
    }
    

    let genre = new Genre({ genre: req.body.genre });
    await genre.save();
    res.status(201).send(genre);
});

router.put("/:id", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("ID invalide");
    }
    const validationResult = genreSchema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).send(validationResult.error.details[0].message);
    }    
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

router.delete("/:id", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("ID invalide");
    }
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) return res.status(404).send("Genre non trouvé");
        res.send({ message: "Genre supprimé avec succès", genre });
    } catch (error) {
        res.status(500).send(`Une erreur est survenue lors de la suppression: ${error.message}`);
    }
});

export default router;