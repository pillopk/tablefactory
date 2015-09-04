var app = angular.module("testApp", ["ngSanitize", "ngTableFactory"]);

app.controller("indexController", [
    "$scope", "$http", "TableFactoryUtility", "TableFactory", function (scope, http, ut, tableFactory) {
        scope.loading = true;

        var countries;
        var table;

        http.get("data/countries.json").then(
            function (result) {
                countries = result.data;
                generateTable();
                scope.loading = false;
            },
            function (error) {
                console.error(error);
                scope.loading = false;
            });

        function generateTable() {
            tableFactory.create($("#container1"), {
                referenceField: "code",
                layout: {
                    height: "300px",
                    showHeader: false,
                    showFooter: false
                },
                columns: [
                    { field: "code", caption: "<i class='glyphicon glyphicon-tag'></i>", halign: "center", align: "center", width: "60px", tooltip: "Country Code", formatter: codeFormatter },
                    { field: "name", caption: "Country", sortable: true }
                ],
                selection: {
                    canSelect: false,
                    canSelectMulti: false,
                    canCheck: false,
                    canCheckMulti: false,
                    selectionsLinked: false
                },
                data: {
                    paged: false,
                    size: 20,
                    readerFn: function (request, responseFn) {
                        var part = filterData(request);
                        responseFn(part, countries.length);
                    }
                }
            });

            tableFactory.create($("#container2"), {
                referenceField: "code",
                layout: {
                    height: "300px",
                    showHeader: false,
                    showFooter: false
                },
                columns: [
                    { field: "name", caption: "Country", sortable: true },
                    { field: "capital", width: "200px", sortable: true }
                ],
                selection: {
                    canSelect: true,
                    canSelectMulti: false,
                    canCheck: false,
                    canCheckMulti: false,
                    selectionsLinked: false
                },
                data: {
                    paged: false,
                    size: 20,
                    readerFn: function (request, responseFn) {
                        var part = filterData(request);
                        responseFn(part, countries.length);
                    }
                }
            });

            tableFactory.create($("#container3"), {
                referenceField: "code",
                layout: {
                    height: "270px",
                    showHeader: false,
                    showFooter: true
                },
                columns: [
                    { field: "name", caption: "Country", sortable: true },
                    { field: "region", width: "200px", sortable: true, formatter: continentFormatter }
                ],
                selection: {
                    canSelect: true,
                    canSelectMulti: true,
                    canCheck: false,
                    canCheckMulti: false,
                    selectionsLinked: false
                },
                data: {
                    paged: true,
                    size: 20,
                    readerFn: function(request, responseFn) {
                        var part = filterData(request);
                        responseFn(part, countries.length);
                    }
                },
                labels: {
                    totalRecordsPaged: "{2} records"
                }
            });

            tableFactory.create($("#container4"), {
                referenceField: "code",
                layout: {
                    height: "270px",
                    showClearCommand: false,
                    showRefreshCommand: false,
                    showSelections: false,
                    showTotals: false,
                    showHeader: false,
                    showFooter: true
                },
                columns: [
                    { field: "name", caption: "Country", sortable: true },
                    { field: "subregion", width: "200px", sortable: true }
                ],
                selection: {
                    canSelect: false,
                    canSelectMulti: false,
                    canCheck: true,
                    canCheckMulti: false,
                    selectionsLinked: false
                },
                data: {
                    paged: true,
                    size: 20,
                    readerFn: function(request, responseFn) {
                        var part = filterData(request);
                        responseFn(part, countries.length);
                    }
                },
                labels: {
                    totalRecordsPaged: "{2} records"
                }
            });

            tableFactory.create($("#container5"), {
                referenceField: "code",
                layout: {
                    height: "240px",
                    showClearCommand: false,
                    showRefreshCommand: false,
                    showHeader: true,
                    showFooter: true
                },
                columns: [
                    { field: "code", caption: "<i class='glyphicon glyphicon-tag'></i>", halign: "center", align: "center", width: "60px", tooltip: "Country Code", formatter: codeFormatter },
                    { field: "capital", sortable: true }
                ],
                selection: {
                    canSelect: false,
                    canSelectMulti: false,
                    canCheck: true,
                    canCheckMulti: true,
                    selectionsLinked: false
                },
                data: {
                    paged: true,
                    size: 20,
                    readerFn: function(request, responseFn) {
                        var part = filterData(request);
                        responseFn(part, countries.length);
                    }
                },
                labels: {
                    totalRecordsPaged: "{2} records"
                }
            });

            tableFactory.create($("#container6"), {
                referenceField: "code",
                layout: {
                    height: "240px",
                    showTotals: false,
                    showHeader: true,
                    showFooter: true
                },
                columns: [
                    { field: "code", caption: "<i class='glyphicon glyphicon-tag'></i>", halign: "center", align: "center", width: "60px", tooltip: "Country Code", formatter: codeFormatter },
                    { field: "name", caption: "Country", sortable: true },
                    { field: "region", width: "200px", sortable: true, formatter: continentFormatter }
                ],
                selection: {
                    canSelect: true,
                    canSelectMulti: false,
                    canCheck: true,
                    canCheckMulti: false,
                    selectionsLinked: true
                },
                data: {
                    paged: true,
                    size: 20,
                    readerFn: function(request, responseFn) {
                        var part = filterData(request);
                        responseFn(part, countries.length);
                    }
                },
                labels: {
                    totalRecordsPaged: "{2} records"
                }
            });

            tableFactory.create($("#container7"), {
                referenceField: "code",
                layout: {
                    height: "270px",
                    showHeader: true,
                    showFooter: false
                },
                columns: [
                    { field: "code", caption: "<i class='glyphicon glyphicon-tag'></i>", halign: "center", align: "center", width: "60px", tooltip: "Country Code", formatter: codeFormatter },
                    { field: "region", sortable: true, formatter: continentFormatter },
                    { field: "subregion", width: "200px", sortable: true }
                ],
                selection: {
                    canSelect: true,
                    canSelectMulti: true,
                    canCheck: true,
                    canCheckMulti: true,
                    selectionsLinked: false
                },
                data: {
                    paged: false,
                    size: 20,
                    readerFn: function(request, responseFn) {
                        var part = filterData(request);
                        responseFn(part, countries.length);
                    }
                }
            });

            tableFactory.create($("#container8"), {
                referenceField: "code",
                layout: {
                    height: "270px",
                    showHeader: true,
                    showFooter: false
                },
                columns: [
                    { field: "region", width: "200px", sortable: true, formatter: continentFormatter },
                    { field: "subregion", sortable: true }
                ],
                selection: {
                    canSelect: true,
                    canSelectMulti: true,
                    canCheck: true,
                    canCheckMulti: true,
                    selectionsLinked: true
                },
                data: {
                    paged: false,
                    size: 20,
                    readerFn: function(request, responseFn) {
                        var part = filterData(request);
                        responseFn(part, countries.length);
                    }
                }
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