'use strict';

const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const passport = require('passport');

const { Job } = require('./models');
const { User } = require('./users/models');

const { router: localStrategy, jwtStrategy } = require('./auth');
passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

// GET request for job
router.get('/', (req, res) => {
    Job.find()
        .populate('user')
        .then(jobs => {
            res.json(jobs.map(job => {
                return {
                    id: job._id,
                    company: job.company,
                    user: job.user ? job.user.username : 'unknown',
                    description: job.description,
                    messenger: job.messenger,
                    comment: job.comment,
                    pickup: job.pickup,
                    dropoff: job.dropoff
                }
            }))
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong' })
        })
});

// GET request for job by id
router.get('/:id', (req, res) => {
    Job.findById(req.params.id)
        .populate('user')
        .then(job => {
            res.json({
                id: job._id,
                company: job.company,
                user: job.user ? job.user.username : 'unknown',
                description: job.description,
                messenger: job.messenger,
                comment: job.comment,
                pickup: job.pickup,
                dropoff: job.dropoff
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Something went wrong' })
        })
});

// POST for jobs
router.post('/', jwtAuth, (req, res) => {
    const requiredFields = ["company", "description", "pickup", "dropoff"];
    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    User
        .findById(req.body.user_id)
        .then(user => {
            if (user) {
                Job
                    .create({
                        user: ObjectID(req.body.user_id),
                        company: req.body.company,
                        description: req.body.description,
                        messenger: req.body.messenger,
                        pickup: req.body.pickup,
                        dropoff: req.body.dropoff,
                        comment: req.body.comment
                    })
                    .then(job => {
                        user.jobs.push(job._id);
                        user.save();
                        res.status(201).json({
                            id: job.id,
                            company: job.company,
                            user: user.username,
                            description: job.description,
                            messenger: job.messenger,
                            comment: job.comment,
                            pickup: job.pickup,
                            dropoff: job.dropoff
                        })
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ message: 'Something went wrong' });
                    });
            }
            else {
                const message = 'User not found';
                console.error(message);
                return res.status(400).send(message);
            }
        })

        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Something went wrong' });
        });
});

// PUT request for jobs
router.put('/:id', jwtAuth, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({ message: `ID's do not match` });
    }

    const toUpdate = {};
    const updateableFields = ["company", "description", "pickup", "dropoff", "messenger", "comment"];
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Job
        .findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
        .then(updatedJob => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});

router.delete('/:id', jwtAuth, (req, res) => {
    Job
        .findByIdAndRemove(req.params.id)
        .then(job => res.status(204).end())
        .catch(err => res.status(500).json({ message: "Internal server error" }));
});

module.exports = router;