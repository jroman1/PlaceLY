// Load Chance
var Chance = require('chance');
// Load http
var http = require('http');
// Instantiate Chance so it can be used
var chance = new Chance();
var dataBase = [];

/*
DATA STRUCTURE: listing
.place
.locale
.desc
.imgSrc
*/
var dataService = {
    create: function(newListing) {
        console.log("SERVER CREATED, newListing:", newListing);
        // CHECK FOR OBJECT.ID, NOT OBJECT so that we only ever create a new listing
        if (!newListing.id) {
            //newListing.id = Math.random() * 1000 + 1;
            newListing.id = chance.guid();
            dataBase.push(newListing); // goes onto our "db" array
        } else {
            return;
        }
    },
    createDummyData: function() {
        var length = 10;
        var listing = {};

        // make http request for random images
        for (var i = 0; i < length; i++) {
            listing.place = chance.last();
            listing.locale = chance.address();
            listing.desc = chance.state();
            listing.imgSrc = 'http://lorempixel.com/400/200/city/';
            listing.id = chance.guid();
            dataBase.push(listing);
            listing = {}; // Clear object of all current properties to enable fresh values on next loop.
        }

    },
    read: function() {
        //console.log("server side DataService.read() says:", dataBase);
        return dataBase;
    },
    users: [],
    getById: function(id) {
        var currentID = parseInt(id);
        var foundListing = _.findWhere(dataBase, {
            'id': currentID
        });
        return foundListing;
    },
    update: function(listing) {
        var dbLength = dataBase.length;
        for (var i = 0; i < dbLength; i++) {
            if (dataBase[i].id === listing.id) {
                console.log("TARGET LISTING TO UPDATE:" + "[" + i + "]");
                dataBase[i] = listing; // Overwrite
            }
        }

    },
    remove: function(listing) {
        //dataBase.splice((dataBase.indexOf(listing)), 1); // (starting here at indexOf for listing, then take away this many indices from listing's index: just 1)
        var dbLength = dataBase.length;
        for (var i = 0; i < dbLength; i++) {
            if (dataBase[i].id === listing.id) {
                console.log("TARGET LISTING TO REMOVE:" + "[" + i + "]");
                dataBase.splice(i, 1); // Remove at [i]
                console.log(dataBase.length + "  IS NOW THE CURRENT DB LENGTH!");
                return; // return out now to avoid coming back through the loop and crashing due to an undefined reference
            }
        }
    },
    saveAll: function(listings) {
        dataBase = listings;
        console.log("server dataBase is now:", dataBase);
    }
};
dataService.createDummyData();
exports.ds = dataService; // you will use .ds in the module that requires dataService like so: someVar.ds.read() or someVar.ds.create(listing) etc
