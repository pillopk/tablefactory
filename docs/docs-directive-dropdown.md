[back to summary](summary.md)

##Dropdown Selector Directive
------------------------------------------------------------------------
Dropdown selector is a bootstrap dropdown implementation with single or multiple selection through table factory.
Html syntax is:

```html
<ng-dropdown-selector items="=" single="=?" display-field="@" value-field="@" additionals="=?" ng-model="=">
```

###items
(Array of Object) Items attribute is the data source of data table in the dropdown


###single
(Boolean) When true the selection is single row, otherwise multiple (default true)


###display-field
(string) Property name of object in items array with value to display in dropdown


###value-field
(string) Property name of object in items array with value to return through ng-model directive


###additionals
(Array of Object) Objects array of type { field:'', width:'' } to show additional column in the table dropdown.
Property 'field' is the property name of items array, 'width' is the width of the column, in css string.

###ng-model
The angular proprietary directive ng-model is used to save dropdown selection 
 

------------------------------------------------------------------------

[back to top](#dropdown-selector-directive) - [back to summary](summary.md)
