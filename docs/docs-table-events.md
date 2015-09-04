[back to summary](summary.md)

##Table Events
------------------------------------------------------------------------
This events names will be fired by factory during table usage.
Must be used to event registration by the 
[eventRegister()](docs-factory-reference.md#eventregister) function.

- [table-created](#table-created)
- [data-request](#data-request)
- [rows-created](#rows-created)
- [row-selected](#row-selected)
- [row-unselected](#row-unselected)
- [row-checked](#row-checked)
- [row-unchecked](#row-unchecked)
- [row-clicked](#row-clicked)
- [clear-selection](#clear-selection)
- [data-reload](#data-reload)
- [page-changed](#page-changed)
- [column-sort](#column-sort)
- [check-all](#check-all)


###table-created
Raised when table is completely created.
No parameters will be sended.


###data-request
Raised before starting a new data request executed by 
[readerFn()](docs-data-reader.md) function.
No parameters will be sended.


###rows-created
Raised after [readerFn()](docs-data-reader.md) function execution
and table rows are completely created.
No parameters will be sended.


###row-selected
Raised when a row is selected.
Two parameters will be sended:
- *record*: the data object of the row
- *index*: index of the row selected (referenced to page)


###row-unselected
Raised when a row is unselected.
Two parameters will be sended:
- *record*: the data object of the row
- *index*: index of the row selected (referenced to page)


###row-checked
Raised when a row is checked.
Two parameters will be sended:
- *record*: the data object of the row
- *index*: index of the row selected (referenced to page)


###row-unchecked
Raised when a row is unchecked.
Two parameters will be sended:
- *record*: the data object of the row
- *index*: index of the row selected (referenced to page)


###row-clicked
Raised when a row is clicked, no matter was selected, unselected, checked or unchecked.
Two parameters will be sended:
- *record*: the data object of the row
- *index*: index of the row selected (referenced to page)


###clear-selection
Raised when the selection of the table is cleared, by the table button, refresh button, 
and paging/sorting accordingly with options specified 
in [data](docs-configuration-table.md#data-configuration) section of configuration. 


###data-reload
Raised when table data is reloaded, with table button or factory method.


###page-changed
Raised when current page is changed.
Two parameters will be sended:
- *new*: new page number
- *old*: previuus page number


###column-sort
Raised when a column is sorted.
Two parameters will be sended:
- *column*: configuration object of the sorted column
- *direction*: direction of sorting, can have only 'asc' or 'desc' value.


###check-all
Raised when 'checkAll' checkbox is clicked.
One parameter will be sended:
- *operation*: When true indicates all rows selected, oterwise all unselected



------------------------------------------------------------------------

[back to top](#table-events) - [back to summary](summary.md)
