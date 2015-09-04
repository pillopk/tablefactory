
##Getting Started
------------------------------------------------------------------------
TableFactory is an angular module to create tables, to add to your project
simply add '*ngTableFactory*' to angular dependancies.
Require '*angular-sanitize.js*'.

```javascript
var app = angular.module("testApp", ["ngSanitize", "ngTableFactory"]);
```

To create a new table call the '*create()*' method of the factory 
table structure will be created and control object returned.
The method must be call with valid htmlElement and 
an [options](docs-configuration-table.md) object.

```javascript
var element = $("#test");

var options = {
	referenceField: "friendId",
	columns: [
		{ field: "FirstName", caption: "Name", sortable: true },
		{ field: "LastName", caption: "Last Name", sortable: true },
		{ field: "Age", halign: "center", align: "center", width: "200px" },
		{ field: "MarriageDate", caption: "Married", align: "center", width: "100px", formatter: marriedFormatter }
	],
	selection: {
        hasSelections: true
    },
	data: {
	    readerFn: dataReader
	}
};

var table = tableFactory.create(element, options);
```

The '*referenceField*' options field is required to identify uniquely data row, 
note that is not required to be specified as column.
The returning object contains all methods to control the table, 
see [factory reference](docs-factory-reference.md) to full list.

The [configuration of column](docs-configuration-column.md) 'Married' 
has [formatter](docs-configuration-column.md#formatter) specified, 
it's useful to create a custom content to a value, here an example:

```javascript
function marriedFormatter(value) {
    return value === null
		? "<span class='glyphicon glyphicon-unchecked'></span>" 
		: "<span class='glyphicon glyphicon-check'></span>":
}
```

The [options.data.readerFn](docs-data-reader.md) contains the function 
to retrieve data, it will be called on creating, paging, sorting 
or refreshing table. When data is retrieved must be passed to table 
with '*responseFn*' function. Here an example using http api:

```javascript
function dataReader(request, responseFn) {
    var url = "<urlToApi>";
    url += "?page=" + request.page;
    url += "&size=" + request.size;
    url += "&sField=" + request.sortField;
    url += "&sOrd=" + request.sortDir;
    
    $http.get(url).then(function(results) {
        responseFn(results.data.rowsArray, results.data.totalRows);
    });
}
```

TableFactory raise various events that can be registered for custom operation.
See [events reference](docs-table-events.md) for the complete list.
Here an examlple:

```javascript
factory.eventRegister("row-selected", function (row) {
    console.log(row.FirstName + " " + row.LastName + " selected");
});

factory.eventRegister("row-unselected", function (row) {
    console.log(row.FirstName + " " + row.LastName + " unselected");
});
```


------------------------------------------------------------------------

[back to top](#getting-started)
