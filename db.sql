/* DATABASE_URL='postgres://tagoxcylurkztj:9f7af1b00a3ecb48b792d76c1971677718970defcc249e6a290dc42521fe0ad0@ec2-54-161-208-31.compute-1.amazonaws.com:5432/d89fjrt9svo1m7' */

CREATE TABLE parks (
	parkId serial PRIMARY KEY NOT NULL UNIQUE,
	parkName varchar(255) NOT NULL,
	parkAddress varchar(255) NOT NULL,
	parkImage varchar(255) NOT NULL
);

CREATE TABLE amenities (
    amenityId serial PRIMARY KEY NOT NULL UNIQUE,
    amenityDescr varchar(255) NOT NULL
);

CREATE TABLE parkAmenities (
    parkAmenityId serial PRIMARY KEY NOT NULL UNIQUE,
    parkId int references parks(parkId) NOT NULL,
    amenityId int references amenities(amenityId)
);

CREATE TABLE reviews (
    reviewId serial PRIMARY KEY NOT NULL UNIQUE,
    parkId int references parks(parkId) NOT NULL,
    reviewText varchar(255) NOT NULL,
);

INSERT INTO amenities (amenityDescr)
VALUES ('Baby Swings'),
('Bandshell'),
('Baseball Feilds'),
('Basketball Court'),
('Frisbee Golf'),
('Fishing'),
('Open Space'),
('Picnic Shelter'),
('Playground'),
('Tennis Court'),
('Sand Volleyball'),
('Sandbox'),
('Swingset'),
('Spray and Play'),
('Walking/Biking Trails');

INSERT INTO parks (parkName, parkAddress, parkImage)
VALUES 
('Ashland Meadows Park', 'NW Park Meadows Dr', 'ashlandmeadows.jpg'),
('Ankeny Dog Park', 'Corner of SW Ankeny Rd and SW Goodwin St', 'dogpark.jpg'),
('Boulder Brook Park', '3333 NW Boulder Point Place', 'boulderbrook.jpg'),
('Briarwood Park', '2701 NE Oak Dr.', 'briarwood.jpg'),
('Crestbruck Park','1001 NE Crestmoor Place','crestbruck.jpg'),
('Dean Park','1720 SW Abilene Road','dean.jpg'),
('Deer Creek Park','1601 NE Chambers Parkway','deercreek.jpeg'),
('Estates Park','2020 SW Cascade Falls Dr.','estates.jpg'),
('Georgetown Park','2625 NW Ash Dr.','georgetown.jpg');