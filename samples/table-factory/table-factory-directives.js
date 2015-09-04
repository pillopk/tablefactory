angular.module("ngTableFactoryDirectives", ["ngSanitize", "ngTableFactory"])

    .directive("ngDataTableFactory", [
        "TableFactory", "TableFactoryUtility", "TableFactoryHtml",
        function (tableFactory, ut, h) {

            return {
                restrict: "EA",
                require: "ngModel",
                scope: {
                    options: "=?"
                },
                template: "<div></div>",
                link: link
            };

            function link(scope, element, attrs, formModel) {
                var table = null;

                scope.$watch(function () { return scope.options; }, function () {
                    if (ut.isNoU(scope.options)) return;
                    if (ut.isNotNoU(table)) table.destroy();
                    initializeTable();
                });

                function initializeTable() {
                    table = tableFactory.create($(element), scope.options);

                    table.eventRegister("row-clicked", function () {
                        updateModel();
                    });

                    table.eventRegister("clear-selection", function () {
                        updateModel();
                    });

                    table.eventRegister("rows-created", function () {
                        updateView();
                    });

                    function updateModel() {
                        var selection = angular.copy(table.getSelection());
                        formModel.$setViewValue(selection);
                        ut.safeApply(scope);
                    }

                    function updateView() {
                        if (ut.isNoU(formModel.$viewValue)) return;

                        var selected = [];
                        var checked = [];

                        if (ut.isArrayNotEmpty(formModel.$viewValue.selected)) selected = formModel.$viewValue.selected;
                        if (ut.isArrayNotEmpty(formModel.$viewValue.checked)) checked = formModel.$viewValue.checked;

                        table.setSelection(selected, checked);
                    }

                    formModel.$render = updateView;
                }
            }

        }
    ])

    .directive("ngDropdownSelector", [
        "TableFactory", "TableFactoryUtility", "TableFactoryHtml",
        function (tableFactory, ut, h) {

            return {
                restrict: "EA",
                require: "ngModel",
                scope: {
                    items: "=",
                    single: "=?",
                    displayField: "@",
                    valueField: "@",
                    additionals: "=?"
                },
                template: template(),
                link: link
            };

            function template() {
                return "" +
                    "<div class='dropdown'>" +
                    "   <div class='form-group dropdown-toggle' data-toggle='dropdown'>" +
                    "       <div class='input-group' style='cursor: pointer;'>" +
                    "           <div class='form-control' style='display: inline-table;'>" +
                    "               <span ng-repeat='item in selectedItems'>" +
                    "                   <label ng-hide='single === true' class='label' style='margin: 0 5px 0 0; cursor: pointer;' ng-click='labelClicked($event, item)'" +
                    "                       ng-class='{ \"label-danger\": isOver, \"label-primary\": !isOver }'" +
                    "                       ng-mouseover='isOver = true' ng-mouseout='isOver = false'>{{item[displayField]}}</label>" +
                    "                   <span ng-show='single === true'>{{item[displayField]}}</span>" +
                    "               </span>" +
                    "           </div>" +
                    "           <div class='input-group-addon'><span class='caret'></span></div>" +
                    "       </div>" +
                    "   </div>" +
                    "   <div class='dropdown-menu' style='padding: 0; width: 100%;'></div>" +
                    "</div>";
            }

            function link(scope, element, attrs, formModel) {
                var hasData = false;
                var tableElement = $(element).find(".dropdown-menu");

                var options = {
                    referenceField: ut.isNoUoE(scope.valueField) ? "id" : scope.valueField,
                    layout: {
                        showHeader: false,
                        showFooter: false,
                        showCheckAll: false,
                        height: "240px"
                    },
                    columns: [
                        { field: ut.isNoUoE(scope.displayField) ? "name" : scope.displayField }
                    ],
                    selection: {
                        canSelect: true,
                        canSelectMulti: (scope.single !== true),
                        canCheck: (scope.single !== true),
                        canCheckMulti: (scope.single !== true),
                        selectionsLinked: true
                    },
                    data: {
                        paged: false,
                        readerFn: function (request, responseFn) {
                            if (ut.isArrayNotEmpty(scope.items)) responseFn(scope.items, scope.items.length);
                            else responseFn([], 0);
                        }
                    }
                };

                if (ut.isArrayNotEmpty(scope.additionals)) {
                    ut.each(scope.additionals, function (additional) {
                        options.columns.push({
                            field: additional.field,
                            width: ut.isNoUoE(additional.width) ? "140px" : additional.width
                        });
                    });
                }

                scope.selectedItems = [];

                var table = tableFactory.create(tableElement, options);

                table.eventRegister("row-selected", function (row) {
                    if (scope.single === true) scope.selectedItems = [row];
                    else scope.selectedItems.push(row);

                    formModel.$setViewValue(ut.extract(scope.selectedItems, scope.valueField));
                    ut.safeApply(scope);

                    if (scope.single === true)
                        $(element).find(".dropdown-toggle").dropdown("toggle");
                });

                if (scope.single !== true) {
                    table.eventRegister("row-unselected", function (row) {
                        removeRow(row);
                        formModel.$setViewValue(ut.extract(scope.selectedItems, scope.valueField));
                        ut.safeApply(scope);
                    });
                }

                table.eventRegister("clear-selection", function () {
                    scope.selectedItems = [];
                    formModel.$setViewValue([]);
                    ut.safeApply(scope);
                });

                table.eventRegister("rows-created", function () {
                    updateView();
                });

                scope.labelClicked = function (evt, row) {
                    evt.stopPropagation();
                    removeRow(row);
                    table.setRowSelection(row[options.referenceField], false, false);
                    formModel.$setViewValue(ut.extract(scope.selectedItems, scope.valueField));
                };

                function updateView() {
                    if (ut.isArray(formModel.$viewValue) === false) return;

                    var selectedValues = [];
                    scope.selectedItems = [];

                    ut.each(formModel.$viewValue, function (value) {
                        var item = ut.find(scope.items, function (item) {
                            return item[scope.valueField] === value;
                        });
                        if (ut.isNotNoU(item)) {
                            selectedValues.push(value);
                            scope.selectedItems.push(item);
                        }
                    });
                    table.setSelection(selectedValues, selectedValues);
                }

                function removeRow(row) {
                    var temp = [];
                    for (var i = 0; i < scope.selectedItems.length; i++) {
                        if (scope.selectedItems[i][options.referenceField] !== row[options.referenceField])
                            temp.push(scope.selectedItems[i]);
                    }
                    scope.selectedItems = temp;
                }

                scope.$watchCollection("items", function () {
                    if (hasData === false) {
                        hasData = true;
                        table.refreshData(false);
                    } else {
                        table.refreshData(true);
                    }
                });

                formModel.$render = updateView;
            }

        }
    ])

    .directive("ngModalSelector", [
        "TableFactory", "TableFactoryUtility", "TableFactoryHtml",
        function (tableFactory, ut, h) {

            return {
                restrict: "EA",
                require: "ngModel",
                scope: {
                    items: "=",
                    show: "=",
                    single: "=?",
                    title: "=?",
                    displayField: "@",
                    valueField: "@",
                    additionals: "=?"
                },
                template: template(),
                link: link
            };

            function template() {
                return "" +
                    "<div class='modal' tabindex='-1' role='dialog'>" +
                    "<div class='modal-dialog'>" +
                    "<div class='modal-content'>" +
                    "<div ng-show='title' class='modal-header'>" +
                    "<div>{{title}}</div>" +
                    "</div>" +
                    "<div class='modal-body'>" +
                    "<div class='table-container'></div>" +
                    "</div>" +
                    "<div class='modal-footer'>" +
                    "<button class='btn btn-primary pull-left' ng-click='selectionClear()'>" +
                    "<i class='glyphicon glyphicon-erase'></i>" +
                    "</button>" +
                    "<button class='btn btn-default' ng-click='modalCancel()'>" +
                    "<i class='glyphicon glyphicon-remove'></i>" +
                    "</button>" +
                    "<button class='btn btn-primary' ng-click='modalConfirm()'>" +
                    "<i class='glyphicon glyphicon-ok'></i>" +
                    "</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
            }

            function link(scope, element, attrs, formModel) {
                var hasData = false;
                var tableElement = $(element).find(".table-container");

                var options = {
                    referenceField: ut.isNoUoE(scope.valueField) ? "id" : scope.valueField,
                    layout: {
                        showHeader: false,
                        showFooter: false,
                        showCheckAll: false,
                        height: "240px"
                    },
                    columns: [
                        { field: ut.isNoUoE(scope.displayField) ? "name" : scope.displayField }
                    ],
                    selection: {
                        canSelect: true,
                        canSelectMulti: (scope.single !== true),
                        canCheck: (scope.single !== true),
                        canCheckMulti: (scope.single !== true),
                        selectionsLinked: true
                    },
                    data: {
                        paged: false,
                        readerFn: function (request, responseFn) {
                            if (ut.isArrayNotEmpty(scope.items)) responseFn(scope.items, scope.items.length);
                            else responseFn([], 0);
                        }
                    }
                };

                if (ut.isArrayNotEmpty(scope.additionals)) {
                    ut.each(scope.additionals, function (additional) {
                        options.columns.push({
                            field: additional.field,
                            width: ut.isNoUoE(additional.width) ? "140px" : additional.width
                        });
                    });
                }

                var table = tableFactory.create(tableElement, options);

                table.eventRegister("rows-created", function () {
                    updateView();
                });

                function updateView() {
                    if (ut.isNoU(formModel.$viewValue)) return;

                    var selection = formModel.$viewValue;
                    if (ut.isArrayNullOrEmpty(formModel.$viewValue)) selection = [];
                    table.setSelection(selection, selection);
                }

                scope.$watchCollection("items", function () {
                    if (hasData === false) {
                        hasData = true;
                        table.refreshData(false);
                    } else {
                        table.refreshData(true);
                    }
                });

                // MODAL MANAGEMENT
                // --------------------------------------------------------

                var $modal = $(element).find(".modal");

                $modal.modal({
                    backdrop: "static",
                    keyboard: false,
                    show: false
                });

                scope.modalCancel = function () {
                    scope.show = false;
                }

                scope.modalConfirm = function () {
                    scope.show = false;
                    var selection = table.getSelection();
                    formModel.$setViewValue(selection.selected);
                    table.clearSelection();
                }

                scope.selectionClear = function () {
                    table.clearSelection();
                }

                scope.$watch(function () { return scope.show; }, function () {
                    if (scope.show === true) {
                        updateView();
                        $modal.modal("show");
                    } else {
                        $modal.modal("hide");
                    }
                });
            }

        }
    ]);
