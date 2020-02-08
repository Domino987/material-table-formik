# Material Table Formik with Dialogs

This package is a simple wrapper for [material-table](https://github.com/mbrn/material-table).

It dispalys dialogs instead of the inline edit for the Add, Update and Delete actions.

Additionally, it allows the validation with [Formik](https://github.com/jaredpalmer/formik) and [YUP](https://github.com/jquense/yup) for these actions as well.

## Props

In addition to the material table props, it also acceepts these optional props:

  Name | Type | Description |
|---|---|---|
| validate | (value: RowData) => void \| object \| Promise<FormikErrors<RowData>>; | The Formik validation to be applied to each field |
| validationSchema |  any \| (() => any) | The YUP validation schema |
| localization | deleteHeader?: string <br> deleteAction?: string | The added localisations for the dialog |
  

## Author

* [Dominik Engel](https://github.com/Domino987)

