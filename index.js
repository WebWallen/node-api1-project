const express = require('express');
const users = require('./data/db');

const server = express();

server.use(express.json());

// Post new user to the database
server.post('/api/users', (req, res) => {
    const userData = req.body; // use info inside the request body
    // If username or bio are missing, cancel the request
    if (!userData.name || !userData.bio) {
        res 
            .status(400) // Bad Request
            .json({ errorMessage: 'Request is empty - need name and bio.' })
    } else {
        users 
            .insert(userData)
            .then(user => res.status(201).json(user)) // 201 status - created
            .catch(err => res.status(400).json({
                error: 'User not saved, please try again'
            }))
    }
})

// Return all users who exist in the database
server.get('/api/users', (req, res) => {
    users 
        .find()
        .then(users => res.send(users))
        .catch(err => res.status(500).json({ // Internal Server Error
            error: 'User info does not appear to exist'
        }))
})

// Return only the user connected to inputted id
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    users 
        .findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ // Page Not Found
                    message: 'No such user exists'
                })
            } else {
                res.json(user);
            }
        })
        .catch(err => res.status(500).json({
            error: 'User info could not be retrieved, please try again'
        }))
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    users 
        .remove(id)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: 'Cannot delete a user with no account'
                })
            } else {
                res.json(user);
            }
        })
        .catch(err => {
            res.status(500).json({
                error: 'Failed to delete user'
            })
        })
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body // Make copy to avoid changing state directly

    if (!changes.name || !changes.bio) {
        res.status(400).json({
            error: 'Cannot make changes without a name or bio'
        })
    } else {
        users 
            .update(id, changes)
            .then(user => {
                if (!user) {
                    res.status(404).json({
                        message: 'No such user exists'
                    })
                } else {
                    res.status(200).json(user);
                }
            })
            .catch(err => res.status(500).json({
                error: 'Failed to update user details'
            }))
    }
});

const port = 8000;
server.listen(port, () => console.log(`\n API running on port ${port}`))