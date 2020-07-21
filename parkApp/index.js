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

//get info for navigation
const navData = getNavData();

function getNavData() {
    var result = {};
    pool.query('SELECT * from amenities', (error, results) => {
        if (error) {
            throw error
        }
        result = results.rows;

    })
    return result;
}

// identfy the public directory for static files
app.use(express.static(path.join(__dirname, 'public')));

// identify the views directory for templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//home page
app.get('/', (req, res) => {
    pool.query('SELECT * from parks', (error, results) => {
        if (error) {
            throw error
        }
        console.log(navData);
        res.render('pages/index', {
            rows: results.rows
        });
    })
});

// park details
app.get('/details', getPark);

function getPark(req, response) {
    const parkId = req.query.parkid;

    getParkDetails(parkId, function (error, result) {
        if (error || result == null || result.length != 1) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            const park = result[0];
            response.render('pages/details', {
                park: park
            });
            //response.status(200).json(park);
        }
    });
}

//query db to get park details by id
function getParkDetails(parkId, callback) {
    console.log("getting park from db with id: " + parkId);

    const park = "SELECT * FROM parks WHERE parkid = $1::int";
    const amenities = "SELECT * FROM amenities INNER JOIN parkAmenities ON amenities.amenityid = parkAmenities.amenityid WHERE parkAmenities.parkid = $1::int";
    const params = [parkId];

    pool.query([park], params, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }
        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));
        // (The first parameter is the error variable, so we will pass null.)
        callback(null, result.rows);
    });

} // end of getParkDetails



app.get('/parks', getNavDataPage)

function getNavDataPage(request, response) {
    response.status(200).json(navData);
}

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