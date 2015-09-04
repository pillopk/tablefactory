[back to summary](summary.md)

##Factory Reference
------------------------------------------------------------------------
When a table is created with '*factory.create(options)*' method, an object is returned:

- [identities](#identities)
- [clearSelection()](#clearSelection)
- [setSelection(newSelectedArray, newCheckedArray)](#setSelection)
- [setRowSelection(refValue, selected, checked)](#setRowSelection)
- [destroyTable()](#destroyTable)
- [eventRegister(eventName, executeFn)](#eventRegister)
- [eventRemoveById(eventId)](#eventRemoveById)
- [refreshData(clear)](#refreshData)
- [refreshRowByRef(refValue)](#refreshRowByRef)
- [getSelection()](#getSelection)
- [getSelectionRecords()](#getSelectionRecords)


###identities
Is an object that contains ID attributes of various part of table.  
The '###' part of names will be replaced with a progressive unique number 
to permit multiple instances on same page.

```javascript
{
    container: "datatable-container-###"
    thead: "datatable-thead-###"
    tbody: "datatable-tbody-###"
    tfooter: "datatable-tfooter-###"
    pager: "datatable-pager-###"
    selection: "datatable-selection-###"
    pageLabel: "datatable-page-label-###"
    records: "datatable-records-###"
}
```



###clearSelection
```javascript
function clearSelection()
```
This method remove all selection present in all page (if paged) on the table. 


###setSelection
```javascript
(void) function setSelection(newSelectedArray, newCheckedArray)
```
With this function is possible to select or check rows in actual page but in other page also.
The parameters are two array of value from '*referenceField*' field of the rows.


###setRowSelection
```javascript
(boolean) function setRowSelection(refValue, selected, checked)
```
With this function the row specified by its reference value ('*refValue*') is selected 
or checked according with function parameters.
If '*selected*' or '*checked*' are null relative actual selection will be mantained.
Return value indicates if table selection was modified.


###destroyTable
```javascript
(void) function destroyTable()
```
This function will remove table entirely from DOM.


###eventRegister
```javascript
(number) function eventRegister(eventName, executeFn)
```
This function register an event of the table, '*executeFn*' function parameter
will be executed on event fire.
Parameter of '*executeFn*' function vary on event type.
The returned number can be used to remove registration.
See [Table Events](docs-table-events.md) for events reference.


###eventRemoveById
```javascript
(void) function eventRegister(eventId)
```
Remove specific event from registration with the ID 
returned by '*eventRegister()*' function.


###refreshData
```javascript
(void) function refreshData(clear)
```
Reload current rows data. When parameter '*clear*' 
is true a [clearSelection()](#clearSelection) will be performed.


###refreshRowByRef
```javascript
(boolean) function refreshRowByRef(refValue)
```
With this function the row specified by its reference value ('*refValue*') 
will be redrawed, without rebuild whole table.
Return value indicates if row was redrawed, false when '*refValue*' was not found.


###getSelection
```javascript
(object) function getSelection()
```
Return an object with properties '*selected*' and '*checked*' both contains
array of '*referenceField*' values of the selected/checked rows.


###getSelectionRecords
```javascript
(object) function getSelectionRecords()
```
Return an object with properties '*selected*' and '*checked*' both contains
array of row object of the selected/checked rows.


------------------------------------------------------------------------

[back to top](#factory-reference) - [back to summary](summary.md)
