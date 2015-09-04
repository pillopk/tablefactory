angular.module("ngTableFactory", [])

    .factory("TableFactory", [
        "TableFactoryUtility", "TableFactoryHtml", "TableFactoryEvents", function (ut, h, eventsfactory) {
            console.info("ngTableFactory factory");

            return {
                create: function (element, config) {
                    return new TableFactory(element, config);
                }
            };

            function TableFactory(element, config) {
                var events = eventsfactory.create();
                var factory;
                var container;
                var options;
                var selectedRef;
                var referenceMap;

                var eventNames = {
                    created: "table-created",
                    dataRequest: "data-request",
                    rowsCreated: "rows-created",
                    rowClicked: "row-clicked",
                    rowChecked: "row-checked",
                    rowUnchecked: "row-unchecked",
                    rowSelected: "row-selected",
                    rowUnselected: "row-unselected",
                    clearSelection: "clear-selection",
                    reloadData: "data-reload",
                    pageChanged: "page-changed",
                    columnSort: "column-sort",
                    checkAll: "check-all"
                }

                var identity = {
                    container: ut.uniqueId("datatable-container-"),
                    thead: ut.uniqueId("datatable-thead-"),
                    tbody: ut.uniqueId("datatable-tbody-"),
                    tfooter: ut.uniqueId("datatable-tfooter-"),
                    pager: ut.uniqueId("datatable-pager-"),
                    selection: ut.uniqueId("datatable-selection-"),
                    pageLabel: ut.uniqueId("datatable-page-label-"),
                    popupGoTo: ut.uniqueId("popup-go-to-"),
                    records: ut.uniqueId("datatable-records-")
                };

                var css = {
                    checkCell: "width: 32px; text-align: center; font-size: 14px; font-weight: lighter; padding: 0 !important",
                    buttonActive: "padding: 0; margin: 0 3px; font-size: 18px; cursor: pointer;",
                    buttonDisabled: "padding: 0; margin: 0 3px; font-size: 18px; color: #bbbbbb;"
                };

                function resetVariables() {
                    events = eventsfactory.create();
                    factory = null;
                    container = null;
                    options = null;

                    referenceMap = new referenceClass();

                    selectedRef = {
                        selected: [],
                        checked: []
                    };
                }

                function referenceClass() {
                    this.indexes = {};
                    this.values = {};
                    this.toRef = function (rowIndex) { return this.indexes[rowIndex]; };
                    this.toIndex = function (refValue) { return this.values[refValue]; };
                }

                resetVariables();

                function create(htmlContainer, gridOptions) {
                    if ($(htmlContainer).length < 1) {
                        console.error("DatagridFactory > initialize > Container must be valid html element");
                        return;
                    }

                    options = ut.defaults(gridOptions, {
                        referenceField: null,
                        columns: [],
                        noWarn: false,
                        createdFn: null,
                        data: ut.defaults(gridOptions.data, {
                            paged: false,
                            size: 20,
                            readerFn: null,
                            readOnCreation: true,
                            total: null,
                            rows: [],
                            sort: ut.defaults(gridOptions.data.sort, {
                                field: null,
                                index: null,
                                direction: null
                            })
                        }),
                        selection: ut.defaults(gridOptions.selection, {
                            canSelect: true,
                            canSelectMulti: false,
                            canCheck: false,
                            canCheckMulti: false,
                            selectionsLinked: false,
                            clearOnPaging: false,
                            clearOnSorting: false
                        }),
                        layout: ut.defaults(gridOptions.layout, {
                            width: "100%",
                            height: null,
                            showHeader: true,
                            showFooter: true,
                            showClearCommand: true,
                            showRefreshCommand: true,
                            showTotals: true,
                            showSelections: true,
                            showCheckAll: true
                        }),
                        css: ut.defaults(gridOptions.css, {
                            header: "table table-bordered",
                            body: "table table-bordered table-striped",
                            bodySelectable: "table-hover",
                            footer: "table table-bordered",
                            selection: "info"
                        }),
                        icons: ut.defaults(gridOptions.icons, {
                            checkTrue: "glyphicon glyphicon-check text-info",
                            checkFalse: "glyphicon glyphicon-unchecked text-muted",
                            pagerFirst: "glyphicon glyphicon-fast-backward",
                            pagerPrev: "glyphicon glyphicon-step-backward",
                            pagerNext: "glyphicon glyphicon-step-forward",
                            pagerLast: "glyphicon glyphicon-fast-forward",
                            refresh: "glyphicon glyphicon-refresh",
                            erase: "glyphicon glyphicon-erase",
                            orderAsc: "glyphicon glyphicon-sort-by-attributes",
                            orderDesc: "glyphicon glyphicon-sort-by-attributes-alt",
                            orderNone: "glyphicon glyphicon-sort",
                            cmdConfirm: "glyphicon glyphicon-ok",
                            cmdCancel: "glyphicon glyphicon-remove"
                        }),
                        labels: ut.defaults(gridOptions.labels, {
                            pageOfPages: "{0} of {1}",
                            totalRecords: "{0} total records",
                            totalRecordsPaged: "View {0} - {1} of {2} total records",
                            noRecords: "no records",
                            tooltipErase: "Clear selection",
                            tooltipRefresh: "Clear sort and reload data",
                            goToPage: "Type the desired page number"
                        })
                    });

                    options.noWarn = (options.noWarn === true);

                    options.selection.canSelect = (options.selection.canSelect === true);
                    options.selection.canSelectMulti = (options.selection.canSelectMulti === true);
                    options.selection.canCheck = (options.selection.canCheck === true);
                    options.selection.canCheckMulti = (options.selection.canCheckMulti === true);
                    options.selection.selectionsLinked = (options.selection.selectionsLinked === true);
                    options.selection.clearOnPaging = (options.selection.clearOnPaging !== false);
                    options.selection.clearOnSorting = (options.selection.clearOnSorting !== false);

                    options.layout.showHeader = (options.layout.showHeader === true);
                    options.layout.showFooter = (options.layout.showFooter === true);
                    options.layout.height = ut.isValidCssSize(options.layout.height) ? options.layout.height : null;
                    options.layout.width = ut.isValidCssSize(options.layout.width) ? options.layout.width : null;
                    options.layout.showClearCommand = (options.layout.showClearCommand === true);
                    options.layout.showRefreshCommand = (options.layout.showRefreshCommand === true);
                    options.layout.showSelections = (options.layout.showSelections === true);
                    options.layout.showTotals = (options.layout.showTotals === true);

                    options.data.paged = (options.data.paged === true);
                    options.data.size = ut.castAsNumeric(options.data.size);

                    options.data.sort.field = ut.isNotNoUoE(options.data.sort.field) ? options.data.sort.field : null;
                    options.data.sort.index = ut.castAsNumeric(options.data.sort.index);
                    options.data.sort.direction = ut.contains(["asc", "desc"], options.data.sort.direction) ? options.data.sort.direction : null;

                    if (options.noWarn && ut.isNoUoE(options.referenceField) && (options.selection.canSelect || options.selection.canCheck)) {
                        console.warn("DatagridFactory > Create > 'Without specified (options).referenceField' all selections will be disabled");
                        options.selection = {
                            canSelect: false,
                            canCheck: false
                        }
                    }

                    if (ut.isArrayNullOrEmpty(options.columns)) {
                        console.error("DatagridFactory > Create > '(options).columns' must contain a valid array of columns");
                        return;
                    }

                    options.columns = ut.map(options.columns, function (header) {
                        return ut.defaults(header, {
                            caption: null,
                            field: null,
                            halign: "left",
                            align: "left",
                            multiline: false,
                            noCellContainer: false,
                            formatter: null
                        });
                    });

                    ut.each(options.columns, function (column) {
                        if (ut.isNoUoE(column.caption)) column.caption = ut.titleFromCamelCase(column.field);
                        if (ut.contains(["left", "center", "right"], column.halign) === false) column.halign = "left";
                        if (ut.contains(["left", "center", "right"], column.align) === false) column.align = "left";
                        column.multiline = (column.multiline !== true);
                        column.multiline = (column.multiline !== true);

                        if (ut.isNotNoU(column.formatter) && (ut.isFunction(column.formatter) === false)) {
                            column.formatter = function () { return ""; };
                            console.error("DatagridFactory > Create > Column > Column formatter must be a valid function.");
                        }
                    });

                    if (options.noWarn && ((options.selection.canSelect && options.selection.canCheck) === false) && options.selection.selectionsLinked) {
                        console.warn("DatagridFactory > Create > '(options).selection.linked' has no sense if '(options).selection.canSelect' and '(options).selection.canCheck' aren't both true");
                    }

                    if (options.noWarn && (!options.layout.showFooter && options.data.paged)) {
                        console.warn("DatagridFactory > Create > '(options).data.paged' has no sense if '(options).layout.showFooter' is false");
                    }

                    container = htmlContainer;
                    buildTable();
                    buildFooter();
                    updateTotalRecords();
                    updateSelection();
                    buildColumns();
                    events.raiseEvent(eventNames.created);
                    if (options.data.readOnCreation === true) readAsyncData();
                    if (ut.isFunction(options.created)) options.created.call(this, factory);
                };

                function readAsyncData() {
                    if (ut.isFunction(options.data.readerFn) === false) {
                        console.error("DatagridFactory > ReadAsyncData > '(options).data.readerFn' function must be set before request data");
                        return;
                    }

                    options.data.page = ut.isNoUoZ(options.data.page) ? 1 : options.data.page;
                    options.data.size = ut.isNoUoZ(options.data.size) ? 20 : options.data.size;

                    var page = options.data.paged ? options.data.page : null;
                    var size = options.data.paged ? options.data.size : null;

                    var request = {
                        page: page,
                        size: size,
                        sortField: options.data.sort.field,
                        sortDir: options.data.sort.direction
                    };

                    var response = function (rows, total) {
                        if ((ut.isArray(rows) === false) || (ut.castAsNumeric(total) === null)) {
                            console.error("DatagridFactory > ReadAsyncData > '(options).data.readerFn' response function must be called with parameters 'row' as array of data and 'total' as number of total records");
                            return;
                        }

                        options.data.total = total;
                        options.data.rows = rows;
                        updateTotalRecords();
                        createRow();
                        restoreSelection();
                    }

                    events.raiseEvent(eventNames.dataRequest);
                    options.data.readerFn.call(this, request, response);
                }

                function createRow() {
                    buildRows();
                    createTooltip();
                    updatePager();
                    events.raiseEvent(eventNames.rowsCreated);
                }

                function extractSelection(onlyReference) {
                    if (ut.isNoUoE(options.referenceField)) {
                        console.error("DatagridFactory > ExtractSelection > '(options).referenceField' must be set.");
                        return null;
                    }

                    if (onlyReference === true) return angular.copy(selectedRef);

                    var result = {
                        selected: [],
                        checked: []
                    };

                    ut.each(selectedRef.selected, function (rowValue) {
                        var record = options.data.rows[referenceMap.toIndex(rowValue)];
                        result.selected.push(onlyReference === true ? record[options.referenceField] : record);
                    });

                    ut.each(selectedRef.checked, function (rowValue) {
                        var record = options.data.rows[referenceMap.toIndex(rowValue)];
                        result.checked.push(onlyReference === true ? record[options.referenceField] : record);
                    });

                    return result;
                }

                // BUILDERS
                // -----------------------------------------------------------------------

                // SUPPORT FUNCTION TO GET JQUERY ELEMENT
                function J(id) { return $(ut.printf("#{0}", id)); }

                function buildTable() {
                    $(container).empty();

                    var structure = h.div().id(identity.container);

                    if (options.layout.showHeader) {
                        structure.content(
                            h.div().content(
                                h.table().class(options.css.header).styles("margin: 0 !important;").content(
                                    h.thead().id(identity.thead)
                                )
                            )
                        );
                    }

                    structure.content(
                        h.div()
                        .styleIf(ut.isNotNoUoE(options.layout.height), "height", options.layout.height)
                        .styleIfElse(ut.isNotNoU(options.layout.height), "overflow-y", "scroll", "hidden")
                        .styles("position: relative;")
                        .content(
                            h.div().styles("position: relative;").content(
                                h.table()
                                .class(options.css.body)
                                .classIf(options.selection.canSelect || options.selection.canCheck, options.css.bodySelectable)
                                .styles("margin: 0 !important;border: none !important;")
                                .content(
                                    h.tbody().id(identity.tbody)
                                )
                            ))
                    );

                    if (options.layout.showFooter) {
                        structure.content(
                            h.div().content(
                                h.table().class(options.css.footer).styles("margin: 0 !important;").content(
                                    h.tfoot().id(identity.tfooter)
                                )
                            ));
                    }


                    $(container).html(structure.build());
                }

                function buildColumns() {
                    if (!options.layout.showHeader) return;

                    var $head = J(identity.thead);
                    $head.empty();

                    var tr = h.tr();

                    if (options.selection.canCheck) {
                        tr.content(
                            h.th()
                            .styles(css.checkCell)
                            .styles("border-bottom: none;")
                            .content(
                                (options.selection.canCheckMulti && options.layout.showCheckAll) ? createCheck(false) : ""
                            )
                        );
                    }

                    ut.each(options.columns, function (header, headerIndex) {
                        var headerContent = [];

                        if (header.sortable === true) {
                            headerContent.push(
                                h.a()
                                .attr("data-sort", headerIndex)
                                .style(header.halign === "right" ? "left" : "right", "4px")
                                .styles("position: absolute; vertical-align: middle; cursor: pointer;")
                                .content(
                                    h.i().attr("data-sort-icon", headerIndex).class(options.icons.orderNone)
                                ));
                        }

                        headerContent.push(
                            h.div().styles("overflow: hidden;").content(header.caption)
                        );

                        tr.content(
                            h.th()
                            .attr("data-field", header.field)
                            .styleIf(ut.isNotNoUoE(header.width), "width", header.width)
                            .styleIf(ut.isNotNoUoE(header.halign), "text-align", header.halign)
                            .style("width", (ut.isNoUoE(header.width) ? "auto" : header.width))
                            .styles("position: relative; font-weight: bold; border-bottom: none;")
                            .content(headerContent)
                        );
                    });

                    if (ut.isNotNoU(options.layout.height)) {
                        tr.content(
                            h.th().styles("width: 16px !important; border-bottom: none;").content()
                        );
                    }

                    $head.html(tr.build());
                    $head.find("tr a[data-sort]").click(sortClicked);
                }

                function buildRows() {
                    var $body = J(identity.tbody);

                    $body.find("tr").unbind();
                    $body.empty();
                    referenceMap.indexes = {};
                    referenceMap.values = {};

                    if (options.data.rows.length === 0) return;

                    for (var rdx = 0; rdx < options.data.rows.length; rdx++) {
                        referenceMap.indexes[rdx] = options.data.rows[rdx][options.referenceField];
                        referenceMap.values[options.data.rows[rdx][options.referenceField]] = rdx;

                        var tr = buildRow(options.data.rows[rdx], rdx, rdx === (options.data.rows.length - 1));
                        $body.append(tr.build());
                    }

                    if (options.selection.canSelect) {
                        $body.find("tr").click(rowClicked);
                    }

                    if (options.selection.canCheck) {
                        $body.find("tr i[data-check]").click(checkClicked);
                        if (options.selection.canCheckMulti && options.layout.showCheckAll) {
                            var $head = J(identity.thead);
                            $head.find("tr i[data-check]").click(checkAllClicked);
                        }
                    }
                }

                function buildRow(rowData, rowIndex, isLast) {
                    var tr = h.tr().attr("row-id", rowIndex);

                    if (options.selection.canCheck) {
                        tr.content(
                            h.td()
                            .styleIf(rowIndex === 0 && options.layout.showHeader, "border-top", "none !important")
                            .styleIf(isLast && options.layout.showFooter, "border-bottom", "none !important")
                            .styles(css.checkCell)
                            .content(createCheck(false))
                        );
                    }


                    for (var cdx = 0; cdx < options.columns.length; cdx++) {
                        var column = options.columns[cdx];

                        var value;
                        if (ut.isFunction(column.formatter)) {
                            value = column.formatter(rowData[column.field], rowData, { rowIndex: rowIndex, colIndex: cdx, column: column });
                        } else {
                            value = ut.isNoU(rowData[column.field]) ? "" : ut.printf("{0}", rowData[column.field]);
                            value = ut.escape(value);
                            value = ut.replace(value, "\n", "<br/>");
                        }

                        var content = value;
                        if (column.noCellContainer !== true) {
                            content = h.div()
                                .style("overflow-x", "hidden")
                                .style("text-overflow", "ellipsis")
                                .styleIf(column.multiline === false, "white-space", "nowrap")
                                .styleIf(column.multiline === false, "overflow-y", "hidden")
                                .styleIf(column.multiline === false, "height", "20px")
                                .styleIf(ut.isNotNoUoE(column.align), "text-align", column.align)
                                .content(value);
                        }

                        tr.content(
                            h.td()
                            .style("position", "relative")
                            .styleIf(column.noCellContainer !== true, "vertical-align", "bottom !important;")
                            .styleIf(column.noCellContainer === true, "padding", "0 !important")
                            .styleIf(rowIndex === 0 && options.layout.showHeader, "border-top", "none !important")
                            .styleIf(isLast && options.layout.showFooter, "border-bottom", "none !important")
                            .style("width", (ut.isNoUoE(column.width) ? "auto" : column.width))
                            .content(content)
                        );
                    }

                    return tr;
                }

                function redrawRow(refValue) {
                    var rowIndex = referenceMap.toIndex(refValue);
                    if (ut.isNoU(rowIndex)) return false;

                    var tr = buildRow(options.data.rows[rowIndex], rowIndex, rowIndex === (options.data.rows.length - 1));

                    var selectorTr = ut.printf("#{0} [row-id='{1}']", identity.tbody, rowIndex);
                    var $tr = $(selectorTr);

                    $tr.find("i[data-check]").unbind();
                    $tr.unbind();
                    $tr.replaceWith(tr.build());

                    $tr = $(selectorTr);
                    if (options.selection.canSelect) {
                        $tr.click(rowClicked);
                    }

                    if (options.selection.canCheck) {
                        $tr.find("i[data-check]").click(checkClicked);
                    }

                    if (ut.contains(selectedRef.selected, refValue)) setRowSelect(rowIndex, true);
                    if (ut.contains(selectedRef.checked, refValue)) setRowCheck(rowIndex, true);

                    return true;
                }

                function buildFooter() {
                    if (!options.layout.showFooter) return;

                    var $footer = J(identity.tfooter);
                    $footer.empty();

                    var tr = h.tr();
                    var commands = [];

                    if (options.layout.showClearCommand || options.layout.showRefreshCommand) {
                        if ((options.selection.canSelect || options.selection.canCheck) && options.layout.showClearCommand) {
                            commands.push(
                                h.a().styles(css.buttonActive).attr("data-command", "erase").content(h.i().class(options.icons.erase)).styles("margin-right: 10px;")
                            );
                        }

                        if (options.layout.showRefreshCommand) {
                            commands.push(
                                h.a().styles(css.buttonActive).attr("data-command", "refresh").content(h.i().class(options.icons.refresh))
                            );
                        }

                        if (commands.length > 0) {
                            tr.content(
                                h.th()
                                .styles("width: 15%; text-align: left; border: none; vertical-align: middle; padding: 3px 0 0 10px;")
                                .content(commands)
                            );
                        }
                    }

                    if ((options.selection.canSelect || options.selection.canCheck) && options.layout.showSelections) {
                        tr.content(
                            h.th().id(identity.selection)
                            .styles("width: 15%; text-align: left; border: none; vertical-align: middle; padding: 3px 0 0 10px;")
                            .content(commands)
                        );
                    }

                    tr.content(
                        h.th().id(identity.pager).styles("height: 37px; position: relative;")
                        .styles("text-align: center; border: none; vertical-align: middle; padding: 3px 0 0 0")
                    );

                    if (options.layout.showTotals) {
                        tr.content(
                            h.th().id(identity.records)
                            .styles("width: 30%; text-align: right; border: none; vertical-align: middle; padding: 3px 10px 0 0")
                            .content()
                        );
                    }

                    $footer.html(tr.build());

                    if ((options.selection.canSelect || options.selection.canCheck) && options.layout.showClearCommand) {
                        $(ut.printf("#{0} th a[data-command='erase']", identity.tfooter)).tooltip({
                            title: options.labels.tooltipErase,
                            container: "body",
                            placement: "top",
                            trigger: "hover"
                        });
                        $(ut.printf("#{0} th a[data-command='erase']", identity.tfooter)).click(commandEraseClicked);
                    }

                    if (options.layout.showRefreshCommand) {
                        $(ut.printf("#{0} th a[data-command='refresh']", identity.tfooter)).tooltip({
                            title: options.labels.tooltipRefresh,
                            container: "body",
                            placement: "top",
                            trigger: "hover"
                        });
                        $(ut.printf("#{0} th a[data-command='refresh']", identity.tfooter)).click(commandRefreshClicked);
                    }

                    updatePager();
                }

                function createTooltip() {
                    for (var cdx = 0; cdx < options.columns.length; cdx++) {
                        var column = options.columns[cdx];

                        if (ut.isNotNoUoE(column.tooltip)) {
                            var selector = ut.printf("#{0} th[data-field='{1}']", identity.thead, column.field);
                            var $cell = $(selector);

                            if ($cell.length > 0) {
                                $cell.tooltip({
                                    title: column.tooltip,
                                    container: "body",
                                    html: true,
                                    placement: "top",
                                    trigger: "hover"
                                });
                            }
                        }
                    };
                }

                function updateTotalRecords() {
                    var $records = J(identity.records);
                    if ($records.length === 0) return;

                    var text = "";
                    if (ut.isNoUoZ(options.data.total)) text = options.labels.noRecords;
                    else {
                        if (options.data.paged) {
                            var start = (options.data.page - 1) * options.data.size;
                            var end = start + options.data.size;
                            text = ut.printf(options.labels.totalRecordsPaged, start, end, options.data.total);
                        } else
                            text = ut.printf(options.labels.totalRecords, options.data.total);
                    }

                    var html = h.label().styles("font-weight: normal; margin: 0;").content(text);
                    $records.html(html.build());
                }

                function updatePager() {
                    if (!options.layout.showFooter) return;
                    if (!options.data.paged) return;

                    var $pager = J(identity.pager);
                    if ($pager.length === 0) return;

                    $pager.find("a").unbind();
                    $pager.empty();

                    var page = options.data.page;

                    var total = parseInt(options.data.total / options.data.size);
                    if ((options.data.total / options.data.size) > parseInt(options.data.total / options.data.size)) total++;

                    var stylesFirst = page > 1 ? css.buttonActive : css.buttonDisabled;
                    var stylesPrev = page > 1 ? css.buttonActive : css.buttonDisabled;
                    var stylesNext = page < total ? css.buttonActive : css.buttonDisabled;
                    var stylesLast = page < total ? css.buttonActive : css.buttonDisabled;

                    var goToPopup = h.div();
                    var pageNumber = h.span().content("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

                    if (total > 0) {
                        pageNumber = h.a().id(identity.pageLabel).content(
                            h.label()
                            .styles("padding: 0; margin: 0; min-width: 80px; font-weight: normal; cursor: pointer; vertical-align: text-bottom;")
                            .content(ut.printf(options.labels.pageOfPages, page, total))
                        );
                        goToPopup = h.div()
                            .id(identity.popupGoTo)
                            .style("display", "none")
                            .styles("position: absolute; z-index: 2000; top: -64px; left: 50%; width: 300px; margin-left: -150px; height: 64px; border: solid 1px #999999; background-color: #eeeeee; padding: 5px; text-align: left;")
                            .content(
                                h.div().content(
                                    h.label().content(options.labels.goToPage),
                                    h.input().type("text").styles("width: 100%; font-size: 14px; height: 26px;")
                                )
                            );
                    }

                    var html = h.div().styles("padding: 0; margin: 0;").content(
                        goToPopup,
                        h.a().attrIf((page > 1), "action", "PP").styles(stylesFirst).content(h.i().class(options.icons.pagerFirst)),
                        h.a().attrIf((page > 1), "action", "P").styles(stylesPrev).content(h.i().class(options.icons.pagerPrev)),
                        pageNumber,
                        h.a().attrIf((page < total), "action", "N").styles(stylesNext).content(h.i().class(options.icons.pagerNext)),
                        h.a().attrIf((page < total), "action", "NN").styles(stylesLast).content(h.i().class(options.icons.pagerLast))
                    );

                    $pager.html(html.build());

                    $pager.find("#" + identity.pageLabel).click(function (e) {
                        var $goto = J(identity.popupGoTo);
                        var $text = $goto.find("input");

                        $goto.fadeIn(100);
                        $text.focus();

                        $text.focusout(function () {
                            $goto.fadeOut(100);
                            $text.val("");
                            $text.unbind();
                        });

                        $text.keypress(function (evt) {
                            if (evt.keyCode === 13) {
                                $goto.fadeOut(100);
                                var result = $text.val();

                                $text.val("");
                                var page = ut.castAsNumeric(result);
                                if (ut.isNoUoZ(page) === false) {
                                    if (page < 1) page = 1;
                                    if (page > total) page = total;
                                    $text.unbind();
                                    options.data.page = page;
                                    readAsyncData();
                                }
                            }
                        });
                    });

                    $pager.find("[action]").click(commandPagerClick);
                }

                function updateSortIcon() {
                    var selectorAll = ut.printf("#{0} th i[data-sort-icon]", identity.thead);
                    $(selectorAll).removeClass(options.icons.orderAsc).removeClass(options.icons.orderDesc).addClass(options.icons.orderNone);

                    if (ut.isNotNoU(options.data.sort.index)) {
                        var selectorSingle = ut.printf("#{0} th i[data-sort-icon='{1}']", identity.thead, options.data.sort.index);
                        $(selectorSingle).addClass(options.data.sort.direction === "asc" ? options.icons.orderAsc : options.icons.orderDesc);
                    }
                }

                function updateSelection() {
                    var $selection = J(identity.selection);
                    if ($selection.length === 0) return;

                    var linked = ((options.selection.canSelect === true) && (options.selection.canCheck === true))
                        && (options.selection.canSelectMulti && options.selection.canCheckMulti)
                        && options.selection.selectionsLinked;

                    var text = "";
                    if (linked) {
                        text += ut.printf("{0}", selectedRef.checked.length);
                    } else {
                        if (options.selection.canCheck)
                            text += ut.printf("{0}", selectedRef.checked.length);
                        if (options.selection.canCheck && options.selection.canSelect)
                            text += "/";
                        if (options.selection.canSelect)
                            text += ut.printf("{0}", selectedRef.selected.length);
                    }

                    var content = h.div().styles("white-space: nowrap;").content(
                        h.i().class(options.icons.cmdConfirm).styles("margin-right: 5px"),
                        h.label().styles("font-weight: normal;").content(text)
                    );

                    $selection.html(content.build());
                }

                function createCheck(value) {
                    if (!options.selection.canCheck) return h.span().content("?");

                    var icon = (value === true) ? options.icons.checkTrue : options.icons.checkFalse;
                    return h.i().attr("data-check", (value ? "true" : "false")).styles("padding: 10px 5px !important; cursor: pointer;").class(icon);
                }

                function destroy() {
                    var $head = J(identity.thead);
                    $head.find("tr i[data-check]").unbind();
                    $head.find("tr a[data-sort]").unbind();

                    var $body = J(identity.tbody);
                    $body.find("tr").unbind();
                    $body.find("tr i[data-check]").unbind();

                    var $pager = J(identity.pager);
                    $pager.find("[action]").unbind();
                    $pager.find("#" + identity.pageLabel).unbind();

                    $(container).empty();
                    resetVariables();
                }

                // SELECTION
                // -----------------------------------------------------------------------

                function manageClick(rowIndex, type) {
                    var rowValue = options.data.rows[rowIndex][options.referenceField];

                    if (options.selection.canSelect && (type === "row")) {
                        var isSelected = ut.contains(selectedRef.selected, rowValue);
                        trySelectFromRef(rowValue, !isSelected);

                        if (options.selection.selectionsLinked && options.selection.canCheck)
                            tryCheckFromRef(rowValue, !isSelected);
                    }

                    if (options.selection.canCheck && (type === "check")) {
                        var isChecked = ut.contains(selectedRef.checked, rowValue);
                        tryCheckFromRef(rowValue, !isChecked);
                        testIfAllChecked();

                        if (options.selection.selectionsLinked && options.selection.canSelect)
                            trySelectFromRef(rowValue, !isChecked);
                    }

                    updateSelection();
                    events.raiseEvent(eventNames.rowClicked, options.data.rows[rowIndex], rowIndex);
                }

                function restoreSelection(newSelect, newCheck) {
                    if (ut.isArray(newSelect) && options.selection.canSelect) selectedRef.selected = angular.copy(newSelect);
                    if (ut.isArray(newCheck) && options.selection.canCheck) selectedRef.checked = angular.copy(newCheck);

                    if ((selectedRef.selected.length > 1) && (options.selection.canSelectMulti === false))
                        selectedRef.selected = [selectedRef.selected[0]];

                    if ((selectedRef.checked.length > 1) && (options.selection.canCheckMulti === false))
                        selectedRef.checked = [selectedRef.checked[0]];

                    setRowSelectClear();
                    ut.each(selectedRef.selected, function (selected) {
                        setRowSelect(referenceMap.toIndex(selected), true);
                    });

                    setRowCheckClear();
                    ut.each(selectedRef.checked, function (checked) {
                        setRowCheck(referenceMap.toIndex(checked), true);
                    });

                    updateSelection();
                }

                function clearSelection() {
                    setRowSelectClear();
                    setRowCheckClear();
                    selectedRef.selected = [];
                    selectedRef.checked = [];
                    updateSelection();
                    events.raiseEvent(eventNames.clearSelection);
                }

                function trySelectFromRef(refValue, select) {
                    var rowIndex = referenceMap.toIndex(refValue);
                    if (ut.isNoU(rowIndex)) return false;

                    if (ut.isNotNoU(select)) {
                        if (select === true) {
                            if (ut.contains(selectedRef.selected, refValue) === true) return false;
                            if (options.selection.canSelectMulti === false) {
                                var tempIndex = (selectedRef.selected.length > 0)
                                    ? referenceMap.toIndex(selectedRef.selected[0])
                                    : null;

                                setRowSelectClear();
                                selectedRef.selected = [];

                                if (ut.isNotNoU(tempIndex))
                                    events.raiseEvent(eventNames.rowUnselected, options.data.rows[tempIndex], tempIndex);
                            }

                            setRowSelect(rowIndex, true);
                            selectedRef.selected.push(refValue);
                            events.raiseEvent(eventNames.rowSelected, options.data.rows[rowIndex], rowIndex);
                        } else {
                            if (ut.contains(selectedRef.selected, refValue) === false) return false;
                            setRowSelect(rowIndex, false);
                            selectedRef.selected = ut.without(selectedRef.selected, refValue);
                            events.raiseEvent(eventNames.rowUnselected, options.data.rows[rowIndex], rowIndex);
                        }
                    }

                    return true;
                }

                function tryCheckFromRef(refValue, check) {
                    var rowIndex = referenceMap.toIndex(refValue);
                    if (ut.isNoU(rowIndex)) return false;

                    if (ut.isNotNoU(check)) {
                        if (check === true) {
                            if (ut.contains(selectedRef.checked, refValue) === true) return false;
                            if (options.selection.canCheckMulti === false) {
                                var tempIndex = (selectedRef.checked.length > 0)
                                    ? referenceMap.toIndex(selectedRef.checked[0])
                                    : null;

                                setRowCheckClear();
                                selectedRef.checked = [];

                                if (ut.isNotNoU(tempIndex))
                                    events.raiseEvent(eventNames.rowUnchecked, options.data.rows[tempIndex], tempIndex);
                            }

                            setRowCheck(rowIndex, true);
                            selectedRef.checked.push(refValue);
                            events.raiseEvent(eventNames.rowChecked, options.data.rows[rowIndex], rowIndex);
                        } else {
                            if (ut.contains(selectedRef.checked, refValue) === false) return false;
                            setRowCheck(rowIndex, false);
                            selectedRef.checked = ut.without(selectedRef.checked, refValue);
                            events.raiseEvent(eventNames.rowUnchecked, options.data.rows[rowIndex], rowIndex);
                        }
                    }

                    return true;
                }

                function setRowSelect(rowIndex, value) {
                    var selector = ut.printf("#{0} tr[row-id='{1}']", identity.tbody, rowIndex);

                    if (value === true) $(selector).addClass(options.css.selection);
                    else $(selector).removeClass(options.css.selection);
                }

                function setRowSelectClear() {
                    var selector = ut.printf("#{0} tr", identity.tbody);
                    $(selector).removeClass(options.css.selection);
                }

                function setRowCheck(rowIndex, value) {
                    var selector = ut.printf("#{0} tr[row-id='{1}'] i[data-check]", identity.tbody, rowIndex);

                    if (value === true) $(selector).removeClass(options.icons.checkFalse).addClass(options.icons.checkTrue);
                    else $(selector).removeClass(options.icons.checkTrue).addClass(options.icons.checkFalse);
                    $(selector).attr("data-check", value);
                }

                function setRowCheckClear() {
                    var selector = ut.printf("#{0} tr i[data-check]", identity.tbody);

                    $(selector).removeClass(options.icons.checkTrue).addClass(options.icons.checkFalse);
                    $(selector).attr("data-check", false);
                }

                function setCheckAllSelect(value) {
                    if (!options.layout.showHeader) return;
                    var selector = ut.printf("#{0} tr i[data-check]", identity.thead);

                    if (value === true) $(selector).removeClass(options.icons.checkFalse).addClass(options.icons.checkTrue);
                    else $(selector).removeClass(options.icons.checkTrue).addClass(options.icons.checkFalse);

                    $(selector).attr("data-check", value);
                }

                function testIfAllChecked() {
                    if (!options.layout.showHeader) return;
                    var selectorC = ut.printf("#{0} tr i[data-check='true']", identity.tbody);
                    var selectorT = ut.printf("#{0} tr i[data-check]", identity.tbody);

                    var checked = $(selectorC).length;
                    var total = $(selectorT).length;

                    setCheckAllSelect(checked === total);
                    return (checked === total);
                }

                // BINDINGS
                // -----------------------------------------------------------------------

                function rowClicked(e) {
                    e.stopPropagation();
                    var rowIndex = $(e.currentTarget).attr("row-id");
                    manageClick(parseInt(rowIndex), "row");
                }

                function checkClicked(e) {
                    e.stopPropagation();
                    var rowIndex = $(e.currentTarget).closest("tr").attr("row-id");
                    manageClick(parseInt(rowIndex), "check");
                }

                function checkAllClicked(e) {
                    e.stopPropagation();

                    var operation;
                    var all = testIfAllChecked();
                    var selectionAlso = (options.selection.selectionsLinked && options.selection.canSelect && options.selection.canSelectMulti);

                    if (all) {
                        setRowCheckClear();
                        selectedRef.checked = [];
                        if (selectionAlso) {
                            setRowSelectClear();
                            selectedRef.selected = [];
                        }
                        operation = false;
                    } else {
                        var selectorC = ut.printf("#{0} tr i[data-check]", identity.tbody);

                        $(selectorC).removeClass(options.icons.checkFalse).addClass(options.icons.checkTrue);
                        $(selectorC).attr("data-check", true);

                        var count = $(selectorC).length;
                        if (selectionAlso) selectedRef.selected = [];
                        selectedRef.checked = [];

                        for (var i = 0; i < count; i++) {
                            if (selectionAlso) {
                                selectedRef.selected.push(referenceMap.toRef(i));
                                setRowSelect(i, true);
                            }
                            selectedRef.checked.push(referenceMap.toRef(i));
                        }
                        operation = true;
                    }

                    setCheckAllSelect(operation);
                    updateSelection();

                    events.raiseEvent(eventNames.checkAll, operation);
                };

                function sortClicked(e) {
                    e.stopPropagation();
                    var colIndex = parseInt($(e.currentTarget).attr("data-sort"));
                    options.data.sort.field = options.columns[colIndex].field;
                    options.data.sort.index = colIndex;
                    options.data.sort.direction = (options.data.sort.direction === "asc") ? "desc" : "asc";
                    updateSortIcon();
                    if (options.selection.clearOnSorting) clearSelection();
                    readAsyncData();
                    events.raiseEvent(eventNames.columnSort, options.columns[colIndex], options.data.sort.direction);
                }

                function commandPagerClick(e) {
                    e.stopPropagation();
                    var old = options.data.page;
                    var action = $(e.currentTarget).attr("action");

                    var total = parseInt(options.data.total / options.data.size);
                    if ((options.data.total / options.data.size) > parseInt(options.data.total / options.data.size)) total++;

                    switch (action) {
                        case "PP":
                            options.data.page = 1;
                            break;
                        case "P":
                            options.data.page--;
                            break;
                        case "N":
                            options.data.page++;
                            break;
                        case "NN":
                            options.data.page = total;
                            break;
                    }

                    if (options.selection.clearOnPaging) clearSelection();
                    readAsyncData();
                    events.raiseEvent(eventNames.pageChanged, options.data.page, old);
                }

                function commandEraseClicked(e) {
                    e.stopPropagation();
                    clearSelection();
                }

                function commandRefreshClicked(e) {
                    e.stopPropagation();
                    options.data.sort.field = null;
                    options.data.sort.index = null;
                    options.data.sort.direction = null;
                    clearSelection();
                    updateSortIcon();
                    readAsyncData();
                    events.raiseEvent(eventNames.reloadData);
                }

                // CREATE TABLE and COMPOSE OBJECT
                // -----------------------------------------------------------------------

                factory = {
                    identities: angular.copy(identity),
                    clearSelection: clearSelection,
                    setSelection: restoreSelection,
                    destroyTable: destroy,
                    eventRegister: events.registerEvent,
                    eventRemoveById: events.removeByEventId,
                    refreshRowByRef: redrawRow,
                    setRowSelection: function (refValue, selected, checked) {
                        var select = ut.isNoU(selected) ? true : trySelectFromRef(refValue, selected);
                        var check = ut.isNoU(checked) ? true : tryCheckFromRef(refValue, checked);
                        return select || check;
                    },
                    refreshData: function (clear) {
                        if (clear === true) clearSelection();
                        readAsyncData();
                    },
                    getSelection: function () {
                        return extractSelection(true);
                    },
                    getSelectionRecords: function () {
                        return extractSelection(false);
                    }
                };

                create(element, config);
                return factory;

            }

        }
    ])

    //---------------------------------------------------------
    // EVENT MANAGER
    //---------------------------------------------------------
    .factory("TableFactoryEvents", [
        "TableFactoryUtility", function (ut) {

            return {
                create: function () { return new TableEventsFactory(); }
            };

            function TableEventsFactory() {
                var counter = 0;
                var events = [];

                function register(name, callFn) {
                    if (ut.isNoUoE(name)) {
                        console.error("DatagridEventFactory > Register > parameter 'name' must be a valid (non empty) property name");
                        return null;
                    }

                    if (ut.isFunction(callFn) === false) {
                        console.error("DatagridEventFactory > Register > parameter 'callFn' must be a valid function");
                        return null;
                    }

                    var newId = ++counter;

                    events.push({
                        id: newId,
                        name: name,
                        callFn: callFn
                    });

                    return newId;
                }

                function clear() {
                    events = [];
                }

                function remove(eventId) {
                    ut.each(events, function (event) {
                        if (event.id === eventId) event.delete = true;
                    });

                    events = ut.map(events, function (event) {
                        return (event.delete === true) ? null : event;
                    });
                }

                function raise(name, payload1, payload2) {
                    ut.each(events, function (event) {
                        if (event.name === name) event.callFn.call(this, payload1, payload2);
                    });
                }

                return {
                    registerEvent: register,
                    clearEvents: clear,
                    removeByEventId: remove,
                    raiseEvent: raise
                };

            }
        }
    ])

    //---------------------------------------------------------
    // HTML BUILDER
    //---------------------------------------------------------
    .factory("TableFactoryHtml", [
        "TableFactoryUtility", function (ut) {

            var attrs = [
                "id", "title", "type", "name", "href", "src", "alt", "height", "width", "unselectable",
                "for", "value", "checked", "disabled", "readonly", "rowspan", "colspan", "onclick", "value"
            ];


            var tags = [
                "div", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "li", "hr", "a", "span", "br", "i", "b", "select", "option",
                "small", "img", "label", "input", "textarea", "button", "table", "thead", "tfoot", "tbody", "tr", "th", "td"
            ];

            var selfCloseTags = ["hr", "br", "img", "input"];


            function HtmlTag(name, selfClose) {
                this.name = name;
                this.selfClose = selfClose;
                this.attrs = {};
                this.children = [];
                this.css = [];
                this.classes = [];

                this.attr = function (attrName, attrValue) {
                    if (ut.isNotNoUoE(attrValue)) this.attrs[attrName] = attrValue;
                    return this;
                };

                this.attrIf = function (condition, attrName, attrValue) {
                    if (condition !== true) return this;
                    return this.attr(attrName, attrValue);
                };

                this.role = function (value) {
                    return this.attr("data-role", value);
                };

                this.styleIf = function (condition, styleName, styleValue) {
                    if (condition !== true) return this;
                    return this.style(styleName, styleValue);
                };

                this.styleIfElse = function (condition, styleName, styleValue, styleElseValue) {
                    if (condition !== true) return this.style(styleName, styleElseValue);
                    return this.style(styleName, styleValue);
                };

                this.style = function (styleName, styleValue) {
                    if (ut.isNoUoE(styleValue)) return this;
                    this.css.push({ name: styleName, value: styleValue });
                    return this;
                };

                this.styles = function (styleString) {
                    if (ut.isNoUoE(styleString)) return this;
                    var self = this;
                    var styleList = styleString.split(";");
                    ut.each(styleList, function (style) {
                        var parts = style.split(":");
                        if (parts.length > 0) {
                            var name = (parts.length > 0) ? parts[0] : "";
                            if (ut.isNotNoUoE(name)) {
                                var value = (parts.length > 1) ? parts[1] : "";

                                name = (ut.isNoUoE(name)) ? "" : name.trim();
                                value = (ut.isNoUoE(value)) ? "" : value.trim();

                                self.css.push({ name: name, value: value });
                            }
                        }
                    });

                    return this;
                };

                this.classIf = function (condition, ifTrue, ifFalse) {
                    return this.class(condition ? ifTrue : ifFalse);
                };

                this.class = function () {
                    for (var a = 0; a < arguments.length; a++) {
                        if (ut.isNoUoE(arguments[a])) continue;
                        this.classes.push(arguments[a].toString());
                    }
                    return this;
                };

                this.content = function () {
                    for (var idx = 0; idx < arguments.length; idx++) {

                        var arg = arguments[idx];
                        if (ut.isNoU(arg)) continue;

                        if (ut.isArray(arg)) {
                            for (var j = 0; j < arg.length; j++) {
                                this.children.push(arg[j]);
                            }
                        } else {
                            this.children.push(arg);
                        }
                    }
                    return this;
                };

                this.build = function (contents) {
                    if (ut.isString(contents) === false) contents = "";

                    contents += "<" + this.name;

                    if (this.css.length > 0) {
                        var styleString = "";
                        ut.each(this.css, function (st) {
                            styleString += st.name + ": " + st.value + "; ";
                        });
                        contents += " style=\"" + styleString + "\"";
                    }

                    if (this.classes.length > 0) {
                        var classString = this.classes.join(" ");
                        contents += " class=\"" + classString + "\"";
                    }

                    ut.each(this.attrs, function (at) {
                        if (ut.isNotNoU(at.value))
                            contents += " " + at.key + "=\"" + at.value + "\"";
                    });

                    for (var key in this.attrs) {
                        contents += " " + key + "=\"" + this.attrs[key] + "\"";
                    }

                    if (this.selfClose) {
                        contents += "/>";
                    } else {
                        contents += ">";

                        for (var i = 0; i < this.children.length; i++) {
                            var child = this.children[i];

                            if (child instanceof HtmlTag) {
                                var inner = child.build();
                                contents += inner;
                            } else {
                                contents += child.toString();
                            }
                        }

                        contents += "</" + this.name + ">";
                    }

                    return contents;
                };
            }

            for (var a = 0; a < attrs.length; a++) {
                var attr = attrs[a];

                HtmlTag.prototype[attr] = (function (attrName) {
                    return function (value) {
                        return this.attr(attrName, value);
                    };
                })(attr);
            }

            function tagFunctionBuilder(tName) {
                return function () {
                    var tag = new HtmlTag(tName, ut.contains(selfCloseTags, tName));
                    return tag.content.apply(tag, arguments);
                };
            }

            var compound = {};

            for (var i = 0; i < tags.length; i++) {
                compound[tags[i]] = tagFunctionBuilder(tags[i]);
            }

            return compound;

        }
    ])

    //---------------------------------------------------------
    // UTILITY
    //---------------------------------------------------------
    .factory("TableFactoryUtility", function () {

        var self = this;
        var counter = 0;

        this.is = function (object, typeString) {
            return (Object.prototype.toString.call(object) === self.printf("[object {0}]", typeString));
        }

        this.isArray = Array.isArray || function (object) {
            return self.is(object, "Array");
        }

        //this.isObject = Array.isArray || function (object) {
        //    return self.is(object, "Object");
        //}

        this.isString = function (object) {
            return self.is(object, "String");
        }

        this.isFunction = function (object) {
            return self.is(object, "Function");
        }

        this.isNoU = function (object) {
            if (object === void 0) return true;
            if (object === null) return true;
            return false;
        };

        this.isNoUoZ = function (object) {
            if (object === void 0) return true;
            if (object === null) return true;
            if (isNaN(object)) return true;
            if (object === 0) return true;
            return false;
        };

        this.isNoUoE = function (object) {
            if (object === void 0) return true;
            if (object === null) return true;
            if (!self.is(object, "String")) return false;
            return object === "";
        };

        this.isNotNoU = function (object) {
            return !self.isNoU(object);
        };

        this.isNotNoUoE = function (object) {
            return !self.isNoUoE(object);
        };

        this.isArrayNullOrEmpty = function (object) {
            if (object === void 0) return true;
            if (object === null) return true;
            if (self.is(object, "Array") === false) return true;
            return object.length === 0;
        };

        this.isArrayNotEmpty = function (object) {
            if (object === void 0) return false;
            if (object === null) return false;
            if (self.is(object, "Array") === false) return false;
            return object.length > 0;
        };

        this.replace = function (text, oldValue, newValue) {
            if (self.isNoUoE(text)) return text;
            return text.split(oldValue.toString()).join(newValue.toString());
        };

        this.castAsNumeric = function (value) {
            if (self.isNoU(value)) return null;
            var text = value.toString();
            text = $.trim(text);
            if (text.length === 0) return null;
            var valids = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-"];
            for (var i = 0; i < text.length; i++) {
                if (valids.indexOf(text[i]) === -1) return null;
            }
            value = parseInt(value);
            return value;
        };

        this.each = function (array, cicleFn) {
            if (self.is(array, "Array") === false) return;
            if (self.is(cicleFn, "Function") === false) return;

            for (var index = 0; index < array.length; index++) {
                cicleFn.call(this, array[index], index);
            }
        };

        this.find = function (array, cicleFn) {
            if (self.is(array, "Array") === false) return null;
            if (self.is(cicleFn, "Function") === false) return null;

            for (var index = 0; index < array.length; index++) {
                var result = cicleFn.call(this, array[index], index);
                if (result === true) return array[index];
            }
            return null;
        };

        this.extract = function (array, propertyName) {
            if (self.is(array, "Array") === false) return [];
            if (self.isNoUoE(propertyName)) return [];

            var results = [];
            for (var index = 0; index < array.length; index++) {
                results.push(array[index][propertyName]);
            }
            return results;
        };

        this.contains = function (array, valueToCheck) {
            if (self.is(array, "Array") === false) return false;
            if (self.isNoU(valueToCheck)) return false;

            for (var index = 0; index < array.length; index++) {
                if (array[index] === valueToCheck) return true;
            }
            return false;
        };

        this.without = function (array, valueToCheck) {
            if (self.is(array, "Array") === false) return false;
            if (self.isNoU(valueToCheck)) return false;

            var result = [];
            for (var index = 0; index < array.length; index++) {
                if (array[index] !== valueToCheck) result.push(array[index]);
            }
            return result;
        };

        this.map = function (array, buildFn) {
            if (self.isArrayNullOrEmpty(array)) return null;

            var result = [];
            self.each(array, function (item) {
                var newItem = buildFn.call(this, item);
                if (self.isNotNoU(newItem)) result.push(newItem);
            });
            return result;
        };

        this.defaults = function (source, defaultObj) {
            if (self.isNoU(source)) source = {};
            if (self.isNoU(defaultObj)) defaultObj = {};

            for (var d_prop in defaultObj) {
                if (defaultObj.hasOwnProperty(d_prop)) {
                    if (source[d_prop] === void 0) source[d_prop] = defaultObj[d_prop];
                }
            }

            return source;
        };

        this.printf = function () {
            if (arguments.length === 0) return null;
            if (arguments.length === 1) return arguments[1];

            var text = arguments[0];

            for (var index = 1; index < arguments.length; index++) {
                var arg = arguments[index];
                var toReplace = "{" + (index - 1) + "}";
                if (self.isNoU(arg)) arg = "";
                text = text.split(toReplace).join(arg.toString());
            }

            return text;
        };

        this.uniqueId = function (prefix) {
            return self.printf("{0}{1}", prefix, counter++);
        };

        this.escape = function (stringToEscape) {
            var text = stringToEscape;
            var escapes = [
                { pre: "&", post: "&amp;" },
                { pre: "<", post: "&lt;" },
                { pre: ">", post: "&gt;" },
                { pre: "\"", post: "&quot;" },
                { pre: "'", post: "&#x27;" },
                { pre: "`", post: "&#x60;" }
            ];

            self.each(escapes, function (escape) {
                text.split(escape.pre).join(escape.post);
            });

            return text;
        }

        this.isValidCssSize = function (stringSize) {
            if (self.isNoUoE(stringSize)) return false;
            var test = stringSize.trim().toLocaleLowerCase();
            if (test === "auto") return true;
            if (test === "inherit") return true;

            var checkValue = function (suffix) {
                var splitted = test.split(suffix);
                if (splitted.length !== 2) return false;
                if (splitted[1] !== "") return false;
                return self.castAsNumeric(splitted[0]) !== null;
            };

            if (checkValue("px")) return true;
            if (checkValue("%")) return true;
            return false;
        }

        this.titleFromCamelCase = function (camelCaseString) {
            if (self.isNoUoE(camelCaseString)) return "";
            if (camelCaseString.length === 1) return camelCaseString.toUpperCase();

            var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var result = camelCaseString[0].toUpperCase();
            for (var i = 1; i < camelCaseString.length; i++) {
                if (letters.indexOf(camelCaseString[i]) === -1) result += camelCaseString[i];
                else result += self.printf(" {0}", camelCaseString[i].toUpperCase());
            }
            return result;
        }

        this.safeApply = function (actualScope, callback) {
            if (actualScope === null || actualScope === undefined) return;

            var phase = (actualScope.$root != null) ? actualScope.$root.$$phase : actualScope.$$phase;
            if (phase === "$apply" || phase === "$digest") {
                if (callback && (typeof (callback) === "function")) {
                    callback();
                }
            } else {
                actualScope.$apply();
            }

        };

        return this;

    });

