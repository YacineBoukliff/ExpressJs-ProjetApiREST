import express from 'express';
import mongoose from 'mongoose';
import { Rental, validateRental } from '../models/rental.js';
import { Movie } from '../models/modelmovie.js';
import { Client } from '../models/client.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const client = await Client.findById(req.body.customerId);
  if (!client) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: client._id,
      name: client.nom,
      phone: client.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await rental.save();

    movie.numberInStock--;
    await movie.save();

    await session.commitTransaction();
    session.endSession();
  
    res.send(rental);
  }
  catch(ex) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send('Something failed.');
  }
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

export default router;