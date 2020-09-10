# Material Table Formik with Dialogs

This package is a simple wrapper for [material-table](https://github.com/mbrn/material-table).

It displays dialogs instead of the inline edit for the Add, Update and Delete actions.

Additionally, it allows the validation with [Formik](https://github.com/jaredpalmer/formik) and [YUP](https://github.com/jquense/yup) for these actions as well.

## Now with Grid Support

Add [Material-ui Grid Props](https://material-ui.com/api/grid/) with gridProps to the columns to order the edit fields within the dialog.

``` 
gridProps: { xs: 12, md: 6 }
```

## Screenshot

![Example Display](screenshot.png)

## Requirement

To use material-table-formik, you must use react@16.8.0 or greater which includes hooks.

## Installation

This package is distributed via [npm](https://www.npmjs.com/package/material-table-formik).

``` 
$ yarn add material-table-formik
# or
$ npm install --save material-table-formik
```

## Getting Started

Simply exchange the material table import:

``` 
import MaterialTable from "material-table";
```

with

``` 
import MaterialTable from "material-table-formik";
```

This will display the edit/update/delete action in a separate dialog instead inline.

## Props

In addition to the material table props, it also accepts these optional props:

  Name | Type | Description |
|---|---|---|
| validate | (value: RowData) => void \| object \| Promise<FormikErrors<RowData>>; | The Formik validation to be applied to each field |
| validationSchema |  any \| (() => any) | The YUP validation schema |
| localization | deleteHeader?: string <br> deleteAction?: string | The added localizations for the dialog |
  

## Author

* [Dominik Engel](https://github.com/Domino987)

This project follows the all-contributors specification. Contributions of any kind welcome!

Built with [TSDX](https://github.com/jaredpalmer/tsdx)
