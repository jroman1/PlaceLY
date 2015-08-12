##What is PlaceLY
 A full stack JavaScript application developed with Node.js, Express, Handlebars and AngularJS. PlaceLY is intended to be used as a learning tool, demonstrating the fundamentals of building a full stack web application. PlaceLY uses a basic HTTP web server, server side templating, simple data persistence and a client side application for **CRUD** basics.

##Getting Started

1. Log in is basic with no validation. Just checks for 'admin' as id and 'pw' for password. See the UserService.js file.
2. Data persistence is simply caching client side data to a JavaScript array on the Node server. One could easily bring in Mongo, SQL, or even file system writes to Node. See the DataService.js module.
3. PlaceLY is not Module-fied fully, so most code sits in the main server.js file. The API functions and some curator functions should be moved into their own modules, say for routes vs strict API data curation functions.
4. PlaceLY is ugly. I merely copy / pasted Bootstrap components into position to get it going. It could be beautified any number of ways with some proper markup.
5. Client and Admin Templating: Handlebars.js is used on the server side for the creation of the non-logged in views. AngularJS has been used to create a Single Page Application for logged in administration of the site.
6. Express and Express-Handlebars are used to render server side pages and static server content.
7. The NPM module Chance.js has been used to create a sample data collection. This collection can be seen on the client side and manipulated through the administrative side of the application.

##The why
My intent for creating this application was to have some core server side activities like logging in, data saving and page serving along with some kind of **CRUD** client that you could maintain and improve toward best-practices, while perhaps swapping out frameworks and modules here and there. Kind of like the very helpful [Todo MVC project](http://todomvc.com/)...only not as pretty or slick...
