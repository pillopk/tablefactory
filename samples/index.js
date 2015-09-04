var app = angular.module("testApp", ["ngSanitize", "ngTableFactory", "ngTableFactoryDirectives"]);

app.controller("indexController", ["$scope", "TableFactoryUtility", "TableFactoryHtml", "$http",
    function (scope, ut, h, http) {
        scope.loading = true;

        var countries = [];

        // TABLE
        // --------------------------------------------------------------------------

        var table;

        scope.tableOptions = {
            referenceField: "code",
            columns: [
                { field: "code", caption: "CD", halign: "center", align: "center", width: "60px" },
                { field: "name", caption: "Country", sortable: true },
                { field: "capital", width: "200px", sortable: true },
                { field: "region", width: "200px", sortable: true, formatter: europeFormatter },
                { field: "subregion", width: "200px", sortable: true }
            ],
            selection: {
                canSelect: true,
                canSelectMulti: false,
                canCheck: true,
                canCheckMulti: true,
                selectionsLinked: true
            },
            data: {
                paged: true,
                size: 10,
                readerFn: dataReader
            }
        };

        function europeFormatter(value) {
            if (ut.isNoUoE(value)) return "";
            if (value.trim().toLowerCase() === "europe") return "<span>{0}</span>";

            return ut.printf("<span style='{1}'>{0}</span>", value,
                (value.trim().toLowerCase() === "europe")
                ? "font-weight: bold; color: #aaaadd"
                : "font-weight: normal");
        }

        function dataReader(request, responseFn) {
            if (ut.isNoU(countries)) {
                http.get("data/countries.json").then(
                    function (result) {
                        countries = result.data;
                        scope.loading = false;
                        scope.dropItems = countries;
                        responseFn(countries, countries.length);
                    },
                    function (error) {
                        console.error(error);
                    });
                return;
            }

            var part;
            var skip = (request.size * (request.page - 1));
            var take = (countries.length - skip) < request.size ? (countries.length - skip) : request.size;
            var local;

            if (ut.isNotNoUoE(request.sortField)) {
                local = _.sortBy(countries, function (row) {
                    return row[request.sortField];
                });
                if (request.sortDir === "desc") local = local.reverse();
            } else {
                local = countries;
            }

            if (ut.isNoU(request.page)) part = local;
            else part = skipTake(local, skip, take);

            responseFn(part, local.length);
        }


        // DROPDOWN
        // --------------------------------------------------------------------------

        scope.dropItems = null;
        scope.additionals = [
            { field: "region", width: "100px" },
            { field: "subregion", width: "100px" }
        ];

        // POPUP
        // --------------------------------------------------------------------------

        scope.show = function () {
            scope.modalToggle = true;
        };

        // UTILITY
        // --------------------------------------------------------------------------

        function skipTake(array, start, count) {
            if (ut.is(array, "Array") === false) return null;

            var result = [];
            for (var i = start; i < start + count; i++) {
                result.push(array[i]);

                if (i > array.length)
                    return result;
            }

            return result;
        };


    }]);