const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const uri = 'mongodb+srv://saniyahakim22:MIFNY0otBoR40WGi@test-pro-db.k4zb7.mongodb.net/noteApp?retryWrites=true&w=majority';

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  });

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Define the Note schema
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model('Note', noteSchema);

// API for user login/signup
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let user = await User.findOne({ username });
  
  if (!user) {
    user = new User({ username, password });
    await user.save();
    return res.status(201).json({ message: 'User registered successfully', user });
  }
  
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  
  res.json({ message: 'Login successful', user });
});

// API to get all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

// API to add a new note
app.post('/notes', async (req, res) => {
  try {
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content,
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add a new note.' });
  }
});

// API to update a note
app.put('/notes/:id', async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the note.' });
  }
});

// API to delete a note
app.delete('/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the note.' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
