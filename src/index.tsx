import React, { useEffect, useRef } from 'react';
import MaterialTable, {
  MaterialTableProps,
  Column,
  Components,
  Localization,
  Icons,
  Options,
  MTableEditField,
  MTableCell,
  MTableBodyRow,
  EditCellColumnDef,
} from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {
  Formik,
  Field,
  FormikErrors,
  FieldAttributes,
  FieldMetaProps,
  FieldInputProps,
} from 'formik';
import {
  CircularProgress,
  makeStyles,
  DialogContentText,
  Grid,
  GridProps,
} from '@material-ui/core';

const useStyles = makeStyles({
  field: {
    padding: 8,
  },
});

interface IColumn<Data extends object> extends Column<Data> {
  gridProps?: Partial<GridProps>;
}

interface IData extends Object {
  tableData?: {};
}

interface IFormikWrapperProps<RowData extends IData>
  extends MaterialTableProps<RowData> {
  validate?: (value: RowData) => void | object | Promise<FormikErrors<RowData>>;
  validationSchema?: any | (() => any);
  localization?: IWrapperLocalization;
  columns: IColumn<RowData>[];
}

interface IWrapperLocalization extends Localization {
  deleteHeader?: string;
  deleteAction?: string;
}

function FormikWrapper<RowData extends IData>(
  props: IFormikWrapperProps<RowData>
) {
  const { localization, components, validate, validationSchema } = props;

  const dialogLocalization = {
    addTooltip:
      localization && localization.body
        ? localization.body.addTooltip || 'Add Row'
        : 'Add Row',
    editTooltip:
      localization && localization.body
        ? localization.body.editTooltip || 'Edit Row'
        : 'Edit Row',
    deleteHeader: localization
      ? localization.deleteHeader || 'Delete Row'
      : 'Delete Row',
    deleteAction: localization
      ? localization.deleteAction || 'Delete'
      : 'Delete',
  };

  const editField = components?.EditField || MTableEditField;
  const displayField = components?.Cell || MTableCell;
  return (
    <MaterialTable
      {...props}
      components={{
        ...components,
        EditRow: editProps => (
          <FormikDialog
            {...editProps}
            dateTimePickerLocalization={
              localization?.body?.dateTimePickerLocalization
            }
            editField={editField}
            displayField={displayField}
            dialogLocalization={dialogLocalization}
            validate={validate}
            validationSchema={validationSchema}
          />
        ),
      }}
    />
  );
}

interface IFormikDialogProps<RowData extends IData> {
  children?: JSX.Element;
  validate?: (
    values: RowData
  ) => void | object | Promise<FormikErrors<RowData>>;
  validationSchema?: any | (() => any);
  dialogLocalization: {
    addTooltip: string;
    editTooltip: string;
    deleteHeader: string;
    deleteAction: string;
  };
  editField: (props: any) => React.ReactElement<any>;
  displayField: (props: any) => React.ReactElement<any>;
  columns: IColumn<RowData>[];
  data?: RowData;
  components: Components;
  icons: Icons;
  mode: 'add' | 'update' | 'delete';
  localization: {
    saveTooltip: string;
    cancelTooltip: string;
    deleteText: string;
  };
  options: Options<RowData>;
  isTreeData: boolean;
  detailPanel: undefined;
  onEditingCanceled: (
    mode: 'add' | 'update' | 'delete',
    rowData?: RowData
  ) => Promise<void>;
  onEditingApproved: (
    mode: 'add' | 'update' | 'delete',
    newDate: RowData,
    oldData: RowData | undefined
  ) => Promise<void>;
  getFieldValue: (rowData: RowData, columnDef: unknown) => string | number;
  dateTimePickerLocalization?: IWrapperLocalization;
}

function FormikDialog<RowData extends IData>({
  children,
  onEditingCanceled,
  validate,
  onEditingApproved,
  validationSchema,
  mode,
  editField: EditCell,
  displayField: DisplayCell,
  dialogLocalization,
  dateTimePickerLocalization,
  ...props
}: IFormikDialogProps<RowData>) {
  const { localization, data, columns } = props;

  const classes = useStyles();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const initialValues = React.useMemo(
    () => (data ? { ...data } : ({} as RowData)),
    [data]
  );

  const closeDialog = () => {
    onEditingCanceled(mode, data);
  };

  let title;
  switch (mode) {
    case 'add':
      title = dialogLocalization.addTooltip;
      break;
    case 'update':
      title = dialogLocalization.editTooltip;
      break;
    case 'delete':
      title = dialogLocalization.deleteHeader;
      break;
  }
  const getEditCell = (
    column: IColumn<RowData>,
    field: FieldInputProps<RowData>,
    meta: FieldMetaProps<RowData>,
    setValues: (rowData: RowData) => void
  ) => {
    if (!canEdit(column, mode, data)) {
      if (column.render && data) {
        return column.render(data, 'row');
      } else {
        return <div>{field.value}</div>;
      }
    }
    const onChange = (newValue: string | number | boolean) =>
      field.onChange({
        target: {
          value: newValue,
          checked: newValue,
          name: field.name,
        },
      });
    const onRowDataChange = (newRowData: Partial<RowData>) => {
      if (data) {
        setValues({
          ...data,
          ...newRowData,
        });
      }
    };
    const errorProps: {
      helperText?: string;
      error: boolean;
    } = {
      helperText: meta.touched ? meta.error : '',
      error: Boolean(meta.touched && meta.error !== undefined),
    };
    if (column.editComponent) {
      return column.editComponent({
        rowData: data || ({} as RowData),
        value: field.value,
        onChange,
        onRowDataChange,
        columnDef: (column as any) as EditCellColumnDef,
        ...errorProps,
      });
    } else {
      return (
        <EditCell
          {...field}
          {...errorProps}
          locale={dateTimePickerLocalization}
          fullWidth={true}
          id={column.field}
          columnDef={column}
          onChange={onChange}
          rowData={data}
        />
      );
    }
  };
  return (
    <>
      <Dialog onClose={closeDialog} open={true} fullWidth={true}>
        <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          validate={validate}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            delete values.tableData;
            await onEditingApproved(mode, values, data);
            if (mounted && mounted.current) {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, handleSubmit, setValues }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container={true}>
                  {mode !== 'delete' &&
                    columns
                      .filter(column => isColumnVisible(column, mode))
                      .map(column => (
                        <Field key={column.field} name={column.field}>
                          {({ field, meta }: FieldAttributes<any>) => {
                            return (
                              <Grid
                                className={classes.field}
                                item={true}
                                xs={12}
                                {...column.gridProps}
                              >
                                <label htmlFor={column.field as string}>
                                  {column.title}
                                </label>
                                <br />
                                {getEditCell(column, field, meta, setValues)}
                              </Grid>
                            );
                          }}
                        </Field>
                      ))}
                </Grid>
                {mode === 'delete' && (
                  <DialogContentText>
                    {localization.deleteText}
                  </DialogContentText>
                )}
                <DialogActions>
                  {isSubmitting ? (
                    <CircularProgress size={25} />
                  ) : (
                    <>
                      <Button onClick={closeDialog} color="primary">
                        {localization.cancelTooltip}
                      </Button>
                      <Button
                        color="primary"
                        autoFocus={true}
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {mode !== 'delete'
                          ? localization.saveTooltip
                          : dialogLocalization.deleteAction}
                      </Button>
                    </>
                  )}
                </DialogActions>
              </DialogContent>
            </form>
          )}
        </Formik>
      </Dialog>
      {data && (
        <MTableBodyRow {...props} onToggleDetailPanel={() => {}}>
          {children}
        </MTableBodyRow>
      )}
    </>
  );
}

function canEdit<RowData extends object>(
  column: IColumn<RowData>,
  mode?: 'add' | 'update' | 'delete',
  data?: RowData
): boolean {
  if (typeof column.editable === 'string') {
    switch (mode) {
      case 'add':
        return column.editable === 'always' || column.editable === 'onAdd';
      case 'update':
        return column.editable === 'always' || column.editable === 'onUpdate';
    }
  } else if (column.editable && data) {
    return column.editable(column, data);
  }
  return true;
}

function isColumnVisible<RowData extends object>(
  column: IColumn<RowData>,
  mode?: 'add' | 'update' | 'delete'
) {
  if (mode === 'add') {
    return column.hidden !== true && canEdit(column, mode);
  }
  return column.hidden !== true;
}

export default FormikWrapper;

export { IFormikWrapperProps, IColumn };
