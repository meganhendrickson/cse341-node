const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
const app = express();

// identfy the public directory for static files
app.use(express.static(path.join(__dirname, 'public')));

// identify the views directory for templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// rules for handling '/getRate'
app.get('/getRate', calcRate);

// start the server listening
app.listen(port, function () {
    console.log('Node app is running on port', port);
});

function calcRate(request, response) {
    const type = request.query.type;
    const weight = Number(request.query.weight);

    const rate = calculateRate(type, weight);
    const params = {
        type: type,
        weight: weight,
        rate: rate
    };
    response.render('pages/getRate', params);
}

function calculateRate(type, weight) {
    var cost = 0;

    if (type === "stamped") {
        if (weight <= 0) {
            cost = "Error! Please check weight.";
        } else if (weight <= 1) {
            cost = "$0.55";
        } else if (1 < weight <= 2) {
            cost = "$0.70";
        } else if (2 < weight <= 3) {
            cost = "$0.85";
        } else if (3 < weight <= 3.5) {
            cost = "$1.00"
        } else if (weight > 3.5) {
            cost = "Letter weight is too high please select large envelope as type."
        }
    } else if (type === "metered") {
        if (weight <= 0) {
            cost = "Error! Please check weight.";
        } else if (0 < weight <= 1) {
            cost = "$0.50";
        } else if (1 < weight <= 2) {
            cost = "$0.65";
        } else if (2 < weight <= 3) {
            cost = "$0.80";
        } else if (3 < weight <= 3.5) {
            cost = "$0.95"
        } else if (weight > 3.5) {
            cost = "Letter weight is too high please select large envelope as type."
        }
    } else if (type === "flats") {
        if (weight <= 0) {
            cost = "Error! Please check weight.";
        } else if (0 < weight <= 1) {
            cost = "$1.00";
        } else if (1 < weight <= 2) {
            cost = "$1.20";
        } else if (2 < weight <= 3) {
            cost = "$1.40";
        } else if (3 < weight <= 4) {
            cost = "$1.60";
        } else if (4 < weight <= 5) {
            cost = "$1.80";
        } else if (5 < weight <= 6) {
            cost = "$2.00";
        } else if (6 < weight <= 7) {
            cost = "$2.20";
        } else if (7 < weight <= 8) {
            cost = "$2.40";
        } else if (8 < weight <= 9) {
            cost = "$2.60";
        } else if (9 < weight <= 10) {
            cost = "$2.80";
        } else if (10 < weight <= 11) {
            cost = "$3.00";
        } else if (11 < weight <= 12) {
            cost = "$3.20";
        } else if (12 < weight <= 13) {
            cost = "$3.40";
        } else if (weight > 13) {
            cost = "Envelope weight is too high. Please select package as type."
        }
    } else if (type === "package") {
        if (weight <= 0) {
            cost = "Error! Please check weight.";
        } else if (0 < weight <= 4) {
            cost = "$3.80";
        } else if (4 < weight <= 8) {
            cost = "$4.60";
        } else if (8 < weight <= 13) {
            cost = "$5.90";
        } else if (weight > 13) {
            cost = "Package weight is too high."
        }
    }

    return cost;
}