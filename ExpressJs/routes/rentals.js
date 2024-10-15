import express from 'express';
import mongoose from 'mongoose';
import { Rental, validateRental } from '../models/rental.js';
import { Movie } from '../models/modelmovie.js';
import { Client } from '../models/client.js';

const router = express.Router();

// GET toutes les locations
router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.find().sort('-dateOut');
        res.send(rentals);
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des locations: ' + error.message);
    }
});

// GET une location spécifique par ID
router.get('/:id', async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).send('Location non trouvée.');
        res.send(rental);
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération de la location: ' + error.message);
    }
});

// POST une nouvelle location
router.post('/', async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
      const client = await Client.findById(req.body.customerId);
      if (!client) return res.status(400).send('Client invalide.');

      const movie = await Movie.findById(req.body.movieId);
      if (!movie) return res.status(400).send('Film invalide.');

      if (movie.numberInStock === 0) return res.status(400).send('Film non disponible en stock.');

      let rental = new Rental({ 
          customer: {
              _id: client._id,
              name: client.nom,
              phone: client.phone
          },
          movie: {
              _id: movie._id,
              title: movie.title,
              dailyRentalRate: movie.dailyRentalRate,
              numberInStock : movie.numberInStock
          }
      });

      rental = await rental.save();

      movie.numberInStock--;
      await movie.save();

      res.send({
        rental: rental,
        movie: {
            _id: movie._id,
            title: movie.title,
            numberInStock: movie.numberInStock
        }
    });
  } catch (error) {
      res.status(500).send('Erreur lors de la création de la location: ' + error.message);
  }
});

// PUT pour mettre à jour une location (par exemple, pour le retour du film)
router.put('/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).send('Location non trouvée.');

        if (rental.dateReturned) return res.status(400).send('Location déjà retournée.');

        rental.dateReturned = new Date();
        const rentalDays = (rental.dateReturned - rental.dateOut) / (1000 * 60 * 60 * 24);
        rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

        await rental.save({ session });

        const movie = await Movie.findById(rental.movie._id);
        movie.numberInStock++;
        await movie.save({ session });

        await session.commitTransaction();
        res.send(rental);
    } catch (error) {
        await session.abortTransaction();
        res.status(500).send('Erreur lors de la mise à jour de la location: ' + error.message);
    } finally {
        session.endSession();
    }
});

export default router;