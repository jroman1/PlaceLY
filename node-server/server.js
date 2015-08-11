//Pull in required files
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var exphbs = require('express-handlebars');
var url = require('url');
var bodyParser = require('body-parser');
// var parseUrlencoded = bodyParser.urlencoded({ extended: true }); // encoded:false forces use of NATIVE query string Node library
var app = express();
var dataService = require('./api/DataService');
var userService = require('./api/UserService');
var _ = require('lodash');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//console.log(dataService.ds.read());
app.use(express.static(__dirname + '/public-statics'));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'shell'
        //helpers: require('./utils/helpers/helpers.js')
}));
app.set('view engine', '.hbs');

//console.log("current directory is: " + __dirname);
console.log("userService.users.length = " + userService.users.length);

// test route
app.get('/hello', function(req, res) {
    console.log(req.body);
    res.send('<h1>YOU SAID HELLO</h1>');
});

// exphbs.handlebars.registerHelper('incrementCounter', function(index) {
//     return index + 1;
// });

// send in an array of items and the page target, returns an object for use
var _getPaginationObject = function(items, pageTarget) {
    //console.log("getPaginationObject() called! items: ", items);
    var page = pageTarget || 1;
    var per_page = 3;
    var offset = (page - 1) * per_page;
    var paginatedItems = _.drop(items, offset).slice(0, per_page);

    var pageDetails = [];
    var totalPages = Math.ceil(items.length / per_page);

    for (var i = 1; i <= totalPages; i++) {
        var currentPageFlag = false;
        if (i === page) {
            currentPageFlag = true;
        }
        // this object solves two critical pagination issues for a given page:
        // 1) provide a numeric label for each page in the collection of pages that it knows
        // 2) provide a boolean flag for each page so it can know if it is the currently viewed page or not (i===page)
        var linkItem = {
            number: i,
            isCurrentPage: currentPageFlag
        };
        pageDetails.push(linkItem);
    }
    return {
        pageNumber: page,
        per_page: per_page,
        total: items.length,
        totalNumberOfPages: Math.ceil(items.length / per_page),
        pageDetails: pageDetails,
        data: paginatedItems
    };
};

// --- VISUAL / CONTENT RENDERING ROUTES
// The .get() call makes a url request to a given address and sends along a callback f() for the response,
// which will render a given target server side page according to the url provided by the request. This is
// where server side pages get routed according to the url.
// The first argument of .render() is a path to the server side page itself, eg, home-page.hbs
// NB: the '/views' folder is an EXPRESS DEFAULT, hence we start our pathing from WITHIN that folder for .hbs assets.
// The object argument used by .render() is used to make variables available for use within the .hbs page being rendered.
// So, any module at play here could potentially provide variables in scope to any given template page.
app.get('/', function(req, res) {
    //console.log(userService.validateUser());
    res.render('index', {
        home: true,
        loggedIn: userService.user.authenticated,
        loggedOut: !userService.user.authenticated
    }); // .render() targets a .hbs file in the /views folder (default for express)
});

app.get('/login', function(req, res) {
    // so you can use an object literal argument to use with .render() and assign to its properties any
    // values, including variables in scope from other modules around the application, you might need to render
    // or bind within the .render() method's targeted .hbs file.
    res.render('client/login.hbs', {
        login: true,
        loggedIn: userService.user.authenticated,
        testVar: "variables can be rendered from the OBJECT argument sent in via res.render()",
        x: userService.testVarInUserService,
        request: req,
        response: res,
        error: userService.err,
        status: userService.status
    });

});

app.get('/admin', function(req, res) {
    if (userService.user.authenticated === true) {
        res.render('admin/listings-admin.hbs', {
            admin: true,
            loggedIn: userService.user.authenticated
        });
    } else {
        res.render('client/login.hbs'); // go to log in page if they are not logged in
    }

});

app.get('/listings', function(req, res) {
    var data = dataService.ds.read();
    var targetPage;
    var currentPageGroup;
    var action = 'default';

    if(req.query.action !== undefined){
        action = req.query.action;
    }

    if(req.query.page !== undefined){
        targetPage = (parseInt(req.query.page) || 1);
    }

    switch (action) {
        case "next":
            targetPage+=1;
            break;
        case "prev":
            targetPage-=1;
            break;
        default:
        // got to a specific page.
            break;
    }

    currentPageGroup = _getPaginationObject(data, targetPage);

    if(currentPageGroup.pageNumber !== (currentPageGroup.totalNumberOfPages +1)){
        res.render('client/listings-client.hbs', {
            pageNumber: currentPageGroup.pageNumber,
            totalPages: currentPageGroup.totalNumberOfPages,
            pages: currentPageGroup.data,
            listingPage: true,
            loggedIn: userService.user.authenticated,
            listingsLength: currentPageGroup.data.length,
            pageDetails: currentPageGroup.pageDetails
        });
    }

});

app.get('/details', function(req, res) {
    var data = dataService.ds.read();
    var currentListing = {};
    //    console.log("id: " + req.query.id);
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === req.query.id) {
            currentListing = data[i];
        }
    }

    res.render('client/details.hbs', {
        loggedIn: userService.user.authenticated,
        listing: currentListing,
        currentId: req.query.id
    });
    //console.log(">>----------> currentListing: ", currentListing);
});

// --- CRUD API
app.get('/get-data', function(req, res) {
    // res.body = dataService.ds.read();
    res.send(dataService.ds.read()); // send back the current array of data
    res.end();
});

app.post('/save-data', function(req, res) {
    dataService.ds.create(req.body.listing);
    res.end();
});

app.post('/delete-data', function(req, res) {
    dataService.ds.remove(req.body.listing);
    res.end();
});

app.post('/save-all-data', function(req, res) {
    console.log('save-data api called...POST data request:', req.body);
    dataService.ds.saveAll(req.body.listings);
    res.end();

});

app.post('/update-listing', function(req, res) {
    dataService.ds.update(req.body.listing);
    res.end();
});

// --- LOGIN
app.post('/checklogin', function(req, res) {
    console.log(req.body);
    var login = {
        username: '',
        password: ''
    };

    login.username = req.body.username;
    login.password = req.body.password;

    var authenticated = userService.validateUser(login);
    if (authenticated) {
        var user = userService.getUserInfo();
        userService.error = "Login successful...";
        var timer = setTimeout(function() {
            console.log('...');
            // PUT IN SPINNER HERE
            clearInterval(timer); // self-cancelling...
            res.redirect('/admin');
        }, 1000);

    } else {
        userService.error = "YOU SHALL NOT PASS!";
        res.redirect('/login');
        res.end();
    }

});

// --- LOGOUT
app.post('/logout', function(req, res) {
    userService.logoutUser();
    res.redirect('/login');
    //res.end();
});

// --- START SERVER
app.listen(8080, function() {
    console.log("Server is running, listening on port 8080");
});
