import express from 'express';
import { User, ValidateUser} from "../models/user.js";
import lodash from "lodash"

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.post("/", async (req, res) => {
    const { error } = ValidateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send("Utilisateur déjà enregistré");

    user = new User(lodash.pick(req.body,['name','email','password']));

    await user.save();
    res.status(201).send(lodash.pick(user,['_id','name','email']));
});

export default router;