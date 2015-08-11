placely.controller('MainCtrl', function($scope, DataSource, $http) {
    $scope.input = '';
    $scope.listings = [];
    $scope.listing = {};
    $scope.currentEditID = 0;
    $scope.isEdit = true;
    $scope.editColor = "info";

    // READ DATA
    var getData = function() {
        var req = {
            method: 'GET',
            url: '/get-data',
            headers: {
                'Content-Type': 'application/json'
            },
            data: 'user-id-needed'
        };

        $http(req).success(function(data, status, headers, config) {
            $scope.listings = data;

        });
    };

    // SAVE LISTING
    $scope.saveListing = function(currentListing) {
        currentListing.isEditable = false;
        // prep the request object
        var req = {
            method: 'POST',
            url: '/save-data',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                listing: currentListing
            }
        };
        // make the request
        $http(req).success(function(data, status, headers, config) {
            getData(); // refresh in from the server data
        }).error(function(data, status, headers, config) {
            console.log("error says, ", arguments);
        });
    };

    // UPDATE LISTING
    $scope.updateListing = function(currentListing) {
        currentListing.isEditable = false;
        // prep the request object
        var req = {
            method: 'POST',
            url: '/update-listing',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                listing: currentListing
            }
        };
        // make the request
        $http(req).success(function(data, status, headers, config) {
            getData(); // refresh in from the server data
        }).error(function(data, status, headers, config) {
            console.log("error says, ", arguments);
        });
    };

    // DELETE LISTING
    $scope.removeListing = function(currentListing) {
        var req = {
            method: 'POST',
            url: '/delete-data',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                listing: currentListing
            }
        };

        $http(req).success(function(data, status, headers, config) {
            console.log("LISTING DELETED!");
            getData(); // refresh in from the server data
        }).error(function(data, status, headers, config) {
            console.log("error says, ", arguments);
        });

    };

    // TOGGLE EDIT - track currently edited item
    $scope.toggleEdits = function(listing) {
        // One way to track specific thing's focus is to give it an internal
        // variable and tell it that it is being edited. None of its other sibling
        // elements would have that tracking value set - they would all be false,
        // while the current element would have had its value set to true.
        listing.isEditable = !listing.isEditable;
    };

    // SET / GET LOCAL STORAGE AFTER LOG IN
    $scope.checkLocalStorage = function(){
            // Check for localStorage and login
            var supports_html5_storage = function() {
                try {
                    return 'localStorage' in window && window['localStorage'] !== null;
                } catch (e) {
                    return false;
                }
            };
            var checkLocalStorage = function() {
                if (supports_html5_storage()) {
                    console.log("YOU SUPPORT LOCAL EFFING STORAGE!");
                    if(localStorage.getItem("placely")){

                    }
                }
            };
            checkLocalStorage();
    };

    // AN INIT CALL TO FETCH INITIAL DATA FROM SERVER
    getData();

}); // --- closes MainCtrl
