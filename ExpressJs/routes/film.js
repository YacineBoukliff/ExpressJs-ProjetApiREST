import express from 'express';
import Joi from "joi"
const router = express.Router()
export default router


const genres = [
    {id : 1, genre: "Action"},
    {id : 2, genre: "Horreur"},
    {id : 3, genre: "Thriller"},
]

router.get('/', (req,res) => {
    res.send("Bonjour Api Film")
})

router.get('/', (req,res) => {
    res.send(genres)
})

router.get('/:id', (req,res) => {
    const parsedId = parseInt(req.params.id)
    if(isNaN(parsedId)) return res.status(400).send("Ce n'est pas un nombre")
    const IdGenre = genres.find((genre) => genre.id === parsedId)
if(!IdGenre) return res.status(400).send("Cet ID n'existe pas ")
    res.send(IdGenre)
})


router.post("/", (req,res) => {
    const nouveaugenre = {
        id : genres.length + 1 , 
        genre : req.body.genre
    }

    const schema = Joi.object({
        genre: Joi.string().min(3).max(20).regex(/.*[a-zA-Z].*/).trim().required()
        .messages({
                'string.pattern.base': 'Le genre doit contenir au moins une lettre',
                'string.min': 'Le genre doit avoir au moins {#limit} caractères',
                'string.max': 'Le genre ne doit pas dépasser {#limit} caractères',
                'any.required': 'Le genre est requis'
            })
    });
    
    const ResultatValidation = schema.validate(req.body);
    if (ResultatValidation.error) return res.status(400).send(ResultatValidation.error.details[0].message);
    

    genres.push(nouveaugenre)
    res.send(genres)
})


router.put("/:id", (req,res) => {

    const parsedId = parseInt(req.params.id)
    if(isNaN(parsedId)) return res.status(400).send("Ce n'est pas un nombre")
    const IdGenre = genres.find((genre) => genre.id === parsedId)
if(!IdGenre) return res.status(400).send("Cet ID n'existe pas ")

    const schema = Joi.object({
        genre: Joi.string().min(3).max(20).regex(/.*[a-zA-Z].*/).trim().required()
        .messages({
                'string.pattern.base': 'Le genre doit contenir au moins une lettre',
                'string.min': 'Le genre doit avoir au moins {#limit} caractères',
                'string.max': 'Le genre ne doit pas dépasser {#limit} caractères',
                'any.required': 'Le genre est requis'
            })
    });
    
    const ResultatValidation = schema.validate(req.body);
    if (ResultatValidation.error) return res.status(400).send(ResultatValidation.error.details[0].message);
    
    IdGenre.genre = req.body.genre
    res.send(IdGenre)
})

router.delete("/api/film/:id",(req,res) => {
    const parsedId = parseInt(req.params.id)
    if(isNaN(parsedId)) return res.status(400).send("Ce n'est pas un nombre")
    const IdGenre = genres.find((genre) => genre.id === parsedId)
    if(!IdGenre) return res.status(400).send("Cet ID n'existe pas ")

        const index = genres.indexOf(IdGenre)
        genres.splice(index,1)
        res.send(IdGenre)


})