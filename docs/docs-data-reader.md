[back to summary](summary.md)

##Data Reader
------------------------------------------------------------------------
The data reader function specified in '*data.readerFn*' of the options
is the function used by the table to retrieve rows data when 
creating, sorting, paging or refreshing the grid. 

```javascript
function dataReader(request, responseFn) { }
```

###request
Parameter '*request*' is an object with the data needs of the grid, object format is:

```javascript
{
    page: null,
    size: null,
    sortField: null,
    sortDir: null
}
```

####page
If '*data.paged*' is true contains the actual page number, otherwise null.

####size
If '*data.paged*' is true contains the number of rows per page, otherwise null.

####sortField
(string) Name of object field to order to.

####sortDir
(string) Direction of sorting, value can be 'asc' or 'desc' only.


###responseFn
Parameter '*responseFn*' is a function to call when data is retrieved to pass it to a table.
The function has two parameters: '*rows*' that must contain an array (empty eventually) 
and '*total*' that contain the total number of entire dataset rows (no rows per page).
The total number of rows value is used to calculate paging.

##Sample
This is a tipical sample of '*readerFn*' function

```javascript
function dataReader(request, responseFn) {
    var url = "urlToApi";
    url += "?page=" + request.page;
    url += "&size=" + request.size;
    url += "&sField=" + request.sortField;
    url += "&sOrd=" + request.sortDir;
    
    $http.get(url).then(function(results) {
        responseFn(results.data.rowsArray, results.data.totalRows);
    });
}
```


------------------------------------------------------------------------

[back to top](#data-reader) - [back to summary](summary.md)
