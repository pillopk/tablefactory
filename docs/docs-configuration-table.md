[back to summary](summary.md)



##Table Configuration
------------------------------------------------------------------------
The configuration object is required for '*create()*' method, 
see [getting started](getting-started.md) for further information.
The values specified in this script are the defaults.

```javascript
{
    referenceField: null,
    columns: [],
    noWarn: false,
    data: {},
    selection:  {},
    layout: {},
    css: {},
    icons: {},
    labels: {}
}
```

###referenceField
(string) Is the object field used to identify a single row in the rows data, 
must be unique across entire dataset and is required for any type of selection.

###columns
(array) Is the object array where every item represent a column of the table. 
See [column configuration](docs-column-configuration.md) for further specification.

###noWarn
(boolean) Suppress all warnings (no errors) displayed on console


###data
(object) See [data configuration](data-configuration) section for further specification.

###selection
(object) See [selection modes](selection-modes) section for further specification.

###layout
(object) See [table layout](table-layout) section for further specification.

###css
(object) See [css styles](css-styles) section for further specification.

###icons
(object) See [icons styles](icons-styles) section for further specification.

###labels
(object) See [text labels](text-labels) section for further specification.





##Data Configuration
------------------------------------------------------------------------
The 'data' section of options manage the rows data
The values specified in this script are the defaults.

```javascript
{
    paged: false,
    size: 20,
    readerFn: null,
    readOnCreation: true,
    sort: {
        field: null,
        direction: null
    })
}
```

###paged
(boolean) When true table is paginated, and paginations buttons appear in table footer.

###size
(integer) Indicate the number of rows per page when paginated

###readerFn
(function) Is the function called by factory to retrieve rows data, in creation, paging, sorting and refresh. 
See [Data-Reader](docs-data-reader.md#datareader) for further specification.

###readOnCreation
(boolean) When true function '*readerFn*' will be called immediately after table creation.
Otherwise must be call [factory.refreshData()](docs-factory-reference.md#refreshData) manually. 

###sort.field
(string) Name of object field to order. Used to specify initial sorting, 
will be update if sorting is changed through sort icons in column headers.

###sort.direction
(string) Can be valorized with 'asc' or 'desc', indicates the direction of sorting.




##Selection Modes
------------------------------------------------------------------------
The 'selection' section of options manage the selection system
The values specified in this script are the defaults.

```javascript
{
    hasSelections: true,
    isSelectionsMulti: false,
    hasChecks: false,
    isChecksMulti: false,
    selectionsLinked: false,
    clearOnPaging: false,
    clearOnSorting: false
}
```


###hasSelections
When true the rows will be selectable (single selection). 
See [Options-Css](#css-styles) to change selection style.

###isSelectionsMulti
When true can be select multiple rows.

###hasChecks
When true a clickable checkbox will appear to the left of every row (single selection). 
See [Options-Css](#css-styles) to change check icon style.

###isChecksMulti
When true can be checked multiple rows.

###selectionsLinked
When true, a single click on table rows will affect both selection and checkbox. 

###clearOnPaging
Current selection will be cleared after paging.

###clearOnSorting
Current selection will be cleared after sorting.




##Table Layout
------------------------------------------------------------------------
The 'layout' section of options manage the grid layout
The values specified in this script are the defaults.

```javascript
{
    width: "100%",
    height: null,
    showHeader: true,
    showFooter: true,
    showClearCommand: true,
    showRefreshCommand: true,
    showTotals: true,
    showSelections: true,
    showCheckAll: true
}
```

Is possible hide or show every element of the grid with respective boolean field, 
'*width*' and '*height*' must be string with size specified in css format. 
The '*height*' property is applied only to rows part of table, header and footer are excluded.  




##Css Styles
------------------------------------------------------------------------
The 'css' section of options manage the style class used in table construction
The values specified in this script are the defaults.

```javascript
{
    header: "table table-bordered",
    body: "table table-bordered table-striped",
    bodySelectable: "table-hover",
    footer: "table table-bordered",
    selection: "info"
}
```

###header
Classes applied to a table contains headers of component.

###body
Classes applied to a table contains data rows of component.

###bodySelectable
Classes applied to a table contains data rows of component if somehow selectable.

###footer
Classes applied to a table contains footers of component.

###selection
Classes applied to TR element of a row when selected.




##Icons Styles
------------------------------------------------------------------------
The 'icons' section of options manage the icons (default Bootstrap Glyph Icons)
The values specified in this script are the defaults.

```javascript
{
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
}
```

These classes represent all icons contained in table rendering:

*checkTrue / checkFalse*: represent the state of selection checkboxes.

*pagerFirst / pagerPrev / pagerNext / pagerLast*: represent buttons icons of pagination feature.

*erase / refresh*: represent the command button in the left footer section.

*orderAsc / orderDesc / orderNone*: represent command icons in the column header for sorting feature.

*cmdConfirm / cmdCancel*: represent the button icons of the popup modal for "go to page" feature.




##Text Labels
------------------------------------------------------------------------
The 'labels' section of options contains all text label used in table
The values specified in this script are the defaults.

```javascript
{
    pageOfPages: "{0} of {1}",
    totalRecords: "{0} total records",
    totalRecordsPaged: "View {0} - {1} of {2} total records",
    noRecords: "no records",
    tooltipErase: "Clear selection",
    tooltipRefresh: "Clear sort and reload data",
    goToPage: "Type the desired page number"
}
```

The numbers present in curly braces are replaces for table values.




------------------------------------------------------------------------

[back to top](#table-configurations) - [back to summary](summary.md)
