const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
const {
    Pool
} = require('pg');
const {
    Router
} = require('express');

// connect to postgresql database
const connectionString = process.env.DATABASE_URL || 'postgres://tagoxcylurkztj:9f7af1b00a3ecb48b792d76c1971677718970defcc249e6a290dc42521fe0ad0@ec2-54-161-208-31.compute-1.amazonaws.com:5432/d89fjrt9svo1m7';
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

// identfy the public directory for static files
app.use(express.static(path.join(__dirname, 'public')));

// identify the views directory for templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'))
app.get('/parks', getAllParks)

app.get('/allparks', (req, res) => {
    pool.query('SELECT * from parks', (error, results) => {
        if (error) {
            throw error
        }
        res.render('pages/index', {
            rows: results.rows
        });
    })
});


// start the server listening
app.listen(PORT, () => console.log(`Listening on ${PORT}`))

function getAllParks(request, response) {

    pool.query('SELECT * from parks', (error, results) => {
        if (error) {
            throw error
        }

        response.status(200).json(results.rows)
    })
}