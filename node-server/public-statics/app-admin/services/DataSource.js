// PRESENTLY THIS FILE IS NOT BEING USED, see DataService.js with runs from the node server instead.
placely.service('DataSource', function () {
    var dataBase = [];
    var id = 1;
    return {
        create: function (newListing) {
            if (newListing) {
                dataBase.push(newListing);
            } else {
                return;
            }
        },
        read: function () {
            console.log("cs DataSource.read() says:", dataBase);
            return dataBase;
        },
        getById: function (id) {
            var itemId = parseInt(id);
            var foundListing = _.findWhere(dataBase, { 'id': itemId });
            return foundListing;
        },
        update: function (listing) {
            // NB: indexOf() can match values in an index, saving you the hassle of tracking by id
            var foundIndex = dataBase.indexOf(listing);
            console.log("foundIndex = " + foundIndex);
            dataBase[(dataBase.indexOf(listing))] = listing; // use indexOf() to get your index reference
        },
        remove: function (listing) {
            //var removeIndex = dataBase.indexOf(model);
            console.log("remove says", listing, "TARGET LISTING TO REMOVE:", dataBase.indexOf(listing));
            dataBase.splice((dataBase.indexOf(listing)), 1); // (remove index at...starting here, this many indices from there)
            id--;
        }
    }; // --- closes return
});
