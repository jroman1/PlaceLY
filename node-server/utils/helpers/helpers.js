(function() {
    var register = function(Handlebars) {
        console.log("utils\/helpers\/helpers.js loaded...");
        /************* BEGIN HELPERS *************/
        var helpers = {
            // put all of your helpers inside this object
            foo: function() {
                return "FOO";
            },
            bar: function() {
                return "BAR";
            }
        };
        /************* END HELPERS *************/

        if (Handlebars && typeof Handlebars.registerHelper === "function") {
            // register helpers
            for (var prop in helpers) {
                Handlebars.registerHelper(prop, helpers[prop]);
            }
        } else {
            // just return helpers object if we can't register helpers here
            return helpers;
        }
    };

    // client
    if (typeof window !== "undefined") {
        register(Handlebars);
    }
    // server
    else {
        exports.register = register;
        exports.helpers = register(null);
    }

})();
