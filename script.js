document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('loginContainer');
  const notesContainer = document.getElementById('notesContainer');
  const loginButton = document.getElementById('loginButton');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  const addNoteButton = document.getElementById('addNote');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const notesList = document.getElementById('notesList');

  // Simulate login process
  loginButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (username && password) {
      localStorage.setItem('loggedIn', 'true');
      loginContainer.style.display = 'none';
      notesContainer.style.display = 'block';
      fetchNotes();
    } else {
      alert('Please enter a valid username and password.');
    }
  });

  // Check login status
  if (localStorage.getItem('loggedIn') === 'true') {
    loginContainer.style.display = 'none';
    notesContainer.style.display = 'block';
    fetchNotes();
  }

  // Fetch all notes from the server
  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/notes');
      if (!response.ok) {
        throw new Error(`Error fetching notes: ${response.statusText}`);
      }
      const notes = await response.json();
      renderNotes(notes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      alert('Failed to fetch notes. Please check if the backend is running.');
    }
  };

  // Render notes to the DOM
  const renderNotes = (notes) => {
    notesList.innerHTML = '';
    notes.forEach((note) => {
      const noteCard = document.createElement('div');
      noteCard.classList.add('note-card');
      noteCard.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <button class="edit-button" onclick="editNote('${note._id}', '${note.title}', '${note.content}')">Edit</button>
        <button class="delete-button" onclick="deleteNote('${note._id}')">Delete</button>
      `;
      notesList.appendChild(noteCard);
    });
  };

  // Add a new note
  addNoteButton.addEventListener('click', async () => {
    const title = titleInput.value;
    const content = contentInput.value;

    if (title && content) {
      try {
        const response = await fetch('http://localhost:5000/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content }),
        });

        if (!response.ok) {
          throw new Error(`Error adding note: ${response.statusText}`);
        }

        titleInput.value = '';
        contentInput.value = '';
        fetchNotes();
      } catch (error) {
        console.error('Failed to add note:', error);
        alert('Failed to add note. Please try again.');
      }
    } else {
      alert('Please enter a title and content!');
    }
  });

  // Delete a note
  window.deleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting note: ${response.statusText}`);
      }

      fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  // Edit a note
  window.editNote = async (id, oldTitle, oldContent) => {
    const newTitle = prompt('Edit Title:', oldTitle);
    const newContent = prompt('Edit Content:', oldContent);

    if (newTitle !== null && newContent !== null) {
      try {
        const response = await fetch(`http://localhost:5000/notes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        });

        if (!response.ok) {
          throw new Error(`Error editing note: ${response.statusText}`);
        }

        fetchNotes();
      } catch (error) {
        console.error('Failed to edit note:', error);
        alert('Failed to edit note. Please try again.');
      }
    }
  };
});
