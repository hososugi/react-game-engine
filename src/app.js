const express = require('express');
const path = require('path');
const app = express();

// Serve static files (like JavaScript) from the 'public' directory
app.use(express.static('public'));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});