[back to summary](summary.md)

##Modal Selector Directive
------------------------------------------------------------------------
Modal selector is a bootstrap modal implementation with single or multiple selection through table factory.
Html syntax is:

```html
<ng-modal-selector show="=" items="=" single="=?" title="=?" display-field="@" value-field="@" additionals="=?" ng-model="=">
```


###show
(Boolean) Boolean object used to control the modal, when value is true the modal is shown


###items
(Array of Object) Items attribute is the data source of data table in the modal


###single
(Boolean) When true the selection is single row, otherwise multiple (default true)


###title
(String) Title of the modal window


###display-field
(string) Property name of object in items array with value to display in modal


###value-field
(string) Property name of object in items array with value to return through ng-model directive


###additionals
(Array of Object) Objects array of type { field:'', width:'' } to show additional column in the table modal.
Property 'field' is the property name of items array, 'width' is the width of the column, in css string.


###ng-model
The angular proprietary directive ng-model is used to save modal selection 



------------------------------------------------------------------------

[back to top](#modal-selector-directive) - [back to summary](summary.md)
