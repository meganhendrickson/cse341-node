const express = require('express');
const path = require('path');
const util = require('util')
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

// start the server listening
app.listen(PORT, () => console.log(`Listening on ${PORT}`))

// identfy the public directory for static files
app.use(express.static(path.join(__dirname, 'public')));

// identify the views directory for templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//get info for navigation
// const navData = getNavData();
// console.log("After navData" + util.inspect(navData, false, null, false));

// function getNavData() {
//     var result = {};
//     try {
//         res = pool.query('SELECT * from amenities');
//         console.log("Inner getNavData" + util.inspect(res, false, null, false));
//         result = res.rows;
//         return result;
//     } catch (err) {
//         return null;
//     }
// }

//home page
app.get('/', (request, response) => {

    var amenities = request.query.amenity;
    if (amenities == null) {
        console.log("Defaults " + util.inspect(request, false, null, false));
        pool.query('SELECT * from parks')
            .then(data => buildIndex([], data.rows, response))
            .catch(err => response.status(500).json({
                success: false,
                result: request,
                error: err
            }));
    } else {
        if (!Array.isArray(amenities)) {
            amenities = [amenities];
        }
        console.log("Amens amens " + util.inspect(amenities, false, null, false));

        var params = [];
        for (var i = 1; i <= amenities.length; i++) {
            params.push('$' + i + "::int");
        }
        var queryStartText = 'SELECT parks.parkid, parks.parkname, parks.parkimage FROM parks INNER JOIN parkamenities ON parks.parkid = parkamenities.parkid WHERE parkamenities.amenityid IN ('
        var queryMidText = queryStartText + params.join(', ') + ')';
        var queryEndText = queryMidText + "group by parks.parkid having count( * ) = " + "$" + (params.length + 1) + "::int";
        console.log("query:" + queryEndText);
        //probably should not do this but it makes things easier for now
        amenities.push(amenities.length);
        console.log("params:" + amenities);
        const parkAmens = {
            text: queryEndText,
            values: amenities
        }
        pool.query(parkAmens)
            .then(data => buildIndex(amenities, data.rows, response))
            .catch(err => response.status(500).json({
                success: false,
                amenities: amenities,
                error: err,
                stack: err.stack
            }));
    }
});

function buildIndex(amenities, parks, response) {
    console.log("Outer parks length " + util.inspect(parks.length, false, null, false));
    //have to remove the length that we added for the params
    amenities.pop();
    var selected = [];
    for (var i = 0; i < amenities.length; i++) {
        selected.push(parseInt(amenities[i], 10));
    }

    //Wish we could remove having to query for amenities but it works for now
    pool.query('SELECT * from amenities')
        .then(data => {
            console.log("Inner parks length " + util.inspect(parks.length, false, null, false));
            console.log("Inner amens length " + util.inspect(data.rows.length, false, null, false));
            console.log("Inner selected " + util.inspect(selected, false, null, false));
            console.log("Inner amenities " + util.inspect(amenities, false, null, false));
            response.render('pages/index', {
                rows: parks,
                selected: selected,
                amens: data.rows
            });
        }).catch(err => response.status(500).json({
            success: false,
            result: parks,
            error: err
        }));
}

// park details page
app.get('/details', getPark);

function getPark(req, response) {
    const parkId = req.query.parkid;

    getParkDetails(parkId, function (error, result) {
        if (error || result == null) {
            response.status(500).json({
                success: false,
                result: result,
                error: error
            });
        } else {
            //const park = result[0];
            response.render('pages/details', {
                park: result
            });
            //response.status(200).json(result);
        }
    });
}

//query db to get park details by id
function getParkDetails(parkId, callback) {
    console.log("getting park from db with id: " + parkId);
    const parkQuery = {
        text: "SELECT * FROM parks WHERE parkid = $1::int",
        values: [parkId]
    }
    pool
        .query(parkQuery)
        .then(res => addAmen(parkId, res.rows[0], callback))
        .catch(e => callback(e, null));
}

//query db to get park amenities by park ID add to park details
function addAmen(parkId, park, callback) {
    const amQuery = {
        text: "SELECT amenitydescr FROM amenities INNER JOIN parkAmenities ON amenities.amenityid = parkAmenities.amenityid WHERE parkAmenities.parkid = $1::int",
        values: [parkId]
    }
    console.log("adAmen park from db with id: " + parkId);
    console.log("park pre amen " + util.inspect(park, false, null, false));
    pool
        .query(amQuery)
        .then(res => {
            console.log(util.inspect(res.rows, false, null, false));
            var amens = [];
            for (i = 0; i < res.rows.length; i++) {
                amens.push(res.rows[i].amenitydescr);
            }
            park.amens = amens;
            console.log("Inner then" + util.inspect(park, false, null, false));
            callback(null, park);
        })
        .catch(e => callback(e, null))
}

//query database for all parks for homepage
function getAllParks(request, response) {
    pool.query('SELECT * from parks', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}