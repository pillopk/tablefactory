[back to summary](summary.md)



##Column Configuration
------------------------------------------------------------------------
The 'column' section of table options is an array that contains one object per column.
The values specified in this script are the defaults.

```javascript
{
    caption: null,
    field: null,
    halign: "left",
    align: "left",
    multiline: false,
    noCellContainer: false,
    formatter: null
}
```

###caption
(string) Is the header caption of the column, can be text or html.
If not specified a camel case caption will be extracted from field property.

###field
(string) Is the object field name to get value for this column.

###halign
(string) Specifies the alignment of the text in the column header.
If the header is aligned to right the sort icon appear on left.
Can be 'left', 'center', 'right', if unrecognized 'left' will be assumed.

###align
(string) Specifies the alignment of the text in the column cells.
Can be 'left', 'center', 'right', if unrecognized 'left' will be assumed.

###multiline
(boolean) When true permits vertical cell expansion if needed, 
otherwise the content will be truncated.

###noCellContainer
(boolean) When specified no container will be created in cells of this columns.
It can be useful to particular custom formatter.

###formatter
(function) Is a function to create custom content in column cell.

```javascript
function cellFormatter(value, record, info) {
    return "text or html";
}
```
Parameter **value** contains the value for actual cell, 
**record** contains the entire row object of actual cell.
Parameter **info** contains an object with **rowIndex**, **colIndex** values 
and **column** that contains current column object.
Function must be return a string with cell content that can be text or html.



------------------------------------------------------------------------

[back to top](#column-configuration) - [back to summary](summary.md)
