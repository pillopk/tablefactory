var app = angular.module("testApp", ["ngSanitize", "ngTableFactory", "ngTableFactoryDirectives"]);

app.controller("indexController", [
    "$scope", "$http", function (scope, http) {
        scope.loading = true;

        scope.popupItems = null;

        scope.additionals1 = [
            { field: "region", width: "150px" }
        ];

        scope.additionals2 = [
            { field: "capital", width: "150px" }
        ];

        scope.showSingle = function () {
            scope.modalSingleShow = true;
        };

        scope.showSingleAdd = function () {
            scope.modalSingleAddShow = true;
        };

        scope.showMulti = function () {
            scope.modalMultiShow = true;
        };

        scope.showMultiAdd = function () {
            scope.modalMultiAddShow = true;
        };

        http.get("data/countries.json").then(
            function (result) {
                scope.popupItems = result.data;
                scope.loading = false;
            },
            function (error) {
                console.error(error);
                scope.loading = false;
            });

    }
]);