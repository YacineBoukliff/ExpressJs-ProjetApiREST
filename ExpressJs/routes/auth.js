import express from 'express';
import {User} from "../models/user.js";
import bcrypt from "bcrypt"
import Joi from "joi";
import passwordComplexity from 'joi-password-complexity';

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("Email ou Mot de passe incorrect");

  const motdepassevalide = await bcrypt.compare(req.body.password,user.password)
  if(!motdepassevalide) return res.status(400).send("Email ou Mot de passe incorrect");
  res.send(true)
});

 function validate(req) {
    const passwordComplexityOptions = {
        min: 5,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
    };

    const schema = Joi.object({
        email: Joi.string().min(5).max(50).required().email(),
        password: passwordComplexity(passwordComplexityOptions).required()
    });

    return schema.validate(req);
}

export default router;

