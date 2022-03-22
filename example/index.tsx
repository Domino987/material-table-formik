import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Table from '../.';
import * as Yup from 'yup';
import { TextField } from '@mui/material';

const AddSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  surname: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  birthYear: Yup.number().required('Required'),
});

const App = () => {
  const [data, setData] = React.useState([
    {
      name: 'Engel',
      surname: 'Dominik',
      birthYear: 1994,
      birthYear1: 1994,
      birthCity: 63,
    },
  ]);
  return (
    <div>
      <Table
        validationSchema={AddSchema}
        columns={[
          {
            title: 'Name',
            field: 'name',
            editable: 'always',
            gridProps: { xs: 6 },
            editComponent: props => (
              <TextField
                variant="standard"
                type="text"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                error={props.error}
                placeholder={props.columnDef.title}
              />
            ),
          },
          {
            title: 'First Name',
            field: 'surname',
            editable: 'onUpdate',
            gridProps: { xs: 6 },
          },
          {
            title: 'Birth Year',
            field: 'birthYear',
            type: 'numeric',
          },
          {
            title: 'Birth Year',
            field: 'birthYear1',
            type: 'date',
          },
          {
            title: 'Brith City',
            field: 'birthCity',
            lookup: { 34: 'Aachen', 63: 'Berlin' },
          },
        ]}
        data={data}
        title="Demo Title"
        editable={{
          onRowAdd: newData =>
            new Promise<void>((resolve, reject) => {
              setTimeout(() => {
                setData(prevData => [...prevData, newData]);
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise<void>((resolve, reject) => {
              setTimeout(() => {
                setData(prevData => [
                  ...prevData.filter(x => x !== oldData),
                  newData,
                ]);
                resolve();
              }, 1000);
            }),
          onRowDelete: oldData =>
            new Promise<void>((resolve, reject) => {
              setTimeout(() => {
                setData(prevData => [...prevData.filter(x => x !== oldData)]);
                resolve();
              }, 1000);
            }),
        }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
