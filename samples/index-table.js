var app = angular.module("testApp", ["ngSanitize", "ngTableFactory", "ngTableFactoryDirectives"]);

app.controller("indexController", ["$scope", "TableFactoryUtility", "TableFactoryHtml", "$http",
    function (scope, ut, h, http) {
        scope.loading = true;

        var countries;

        scope.tableOptions = {
            referenceField: "code",
            columns: [
                { field: "code", caption: "<i class='glyphicon glyphicon-tag'></i>", halign: "center", align: "center", width: "60px", tooltip: "Country Code", formatter: codeFormatter },
                { field: "name", caption: "Country", sortable: true },
                { field: "capital", width: "200px", sortable: true },
                { field: "region", width: "200px", sortable: true, formatter: continentFormatter },
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

        function dataReader(request, responseFn) {
            if (ut.isNoU(countries)) {
                http.get("data/countries.json").then(
                    function (result) {
                        countries = result.data;
                        responseFn(countries, countries.length);

                        var part = filterData(request);
                        responseFn(part, countries.length);

                        scope.loading = false;
                    },
                    function (error) {
                        console.error(error);
                        scope.loading = false;
                    });
                return;
            } else {
                var part = filterData(request);
                responseFn(part, countries.length);
            }
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


    }]);