import express from 'express';
import mongoose from "mongoose";
import {Client,SchemaClient} from "../models/client.js"

const router = express.Router();

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
            { 
                nom: req.body.nom,
                phone: req.body.phone,
                isGold: req.body.isGold
            },
            { new: true, runValidators: true }
        );

        if (!client) return res.status(404).send("Client non trouvé");
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