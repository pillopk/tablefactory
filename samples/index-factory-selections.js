var app = angular.module("testApp", ["ngSanitize", "ngTableFactory", "ngTableFactoryDirectives"]);

app.controller("indexController", [
    "$scope", "$http", "TableFactoryUtility", "TableFactory", function (scope, http, ut, tableFactory) {
        scope.loading = true;

        var countries;
        var table;

        scope.selection = {
            canSelect: false,
            canSelectMulti: false,
            canCheck: false,
            canCheckMulti: false,
            selectionsLinked: false
        };
        
        http.get("data/countries.json").then(
            function(result) {
                countries = result.data;
                scope.loading = false;
            },
            function(error) {
                console.error(error);
                scope.loading = false;
            });

        scope.generateTable = function () {
            if (ut.isNotNoU(table)) table.destroyTable();
            scope.selectedIndexes = [];

            table = tableFactory.create($("#tableContainer"), {
                referenceField: "code",
                columns: [
                    { field: "code", caption: "<i class='glyphicon glyphicon-tag'></i>", halign: "center", align: "center", width: "60px", tooltip: "Country Code", formatter: codeFormatter },
                    { field: "name", caption: "Country", sortable: true },
                    { field: "capital", width: "200px", sortable: true },
                    { field: "region", width: "200px", sortable: true, formatter: continentFormatter },
                    { field: "subregion", width: "200px", sortable: true }
                ],
                selection: angular.copy(scope.selection),
                data: {
                    paged: true,
                    size: 10,
                    readerFn: function (request, responseFn) {
                        var part = filterData(request);
                        responseFn(part, countries.length);
                    }
                }
            });

            table.eventRegister("row-clicked", function () {
                scope.selectedIndexes = table.getSelection();
                ut.safeApply(scope);
            });

            function codeFormatter(value, record) {
                var css = regionCss(record.region);
                return ut.printf("<label class='label {1}'>{0}</span>", value, css);
            }

            function continentFormatter(value) {
                if (ut.isNoUoE(value)) return "";

                return ut.printf("<label class='label {1}'>{0}</span>", value, regionCss(value));
            }

            function regionCss(region) {
                switch (region.trim().toLowerCase()) {
                    case "europe": return "label-primary";
                    case "americas": return "label-info";
                    case "asia": return "label-success";
                    case "africa": return "label-warning";
                    case "oceania": return "label-danger";
                }
                return "label-default";
            }


            // UTILITY
            // --------------------------------------------------------------------------

            function filterData(request) {
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

                return part;
            }

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

        };
    }
]);