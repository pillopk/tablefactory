var app = angular.module("testApp", ["ngSanitize", "ngTableFactory", "ngTableFactoryDirectives"]);

app.controller("indexController", [
    "$scope", "$http", function(scope, http) {
        scope.loading = true;

        scope.dropItems = null;

        scope.additionals = [
            { field: "region", width: "100px" },
            { field: "subregion", width: "100px" }
        ];

        http.get("data/countries.json").then(
            function(result) {
                scope.dropItems = result.data;
                scope.loading = false;
            },
            function(error) {
                console.error(error);
                scope.loading = false;
            });

    }
]);