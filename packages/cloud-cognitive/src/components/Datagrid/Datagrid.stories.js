/**
 * Copyright IBM Corp. 2022, 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useEffect } from 'react';
// TODO: import action to handle events if required.
// import { action } from '@storybook/addon-actions';
import namor from 'namor';

import {
  getStoryTitle,
  prepareStory,
} from '../../global/js/utils/story-helper';

import { Datagrid, useDatagrid } from '.';
import mdx from './Datagrid.mdx';

import styles from './_storybook-styles.scss';

export default {
  title: getStoryTitle(Datagrid.displayName),
  component: Datagrid,
  // TODO: Define argTypes for props not represented by standard JS types.
  // argTypes: {
  //   egProp: { control: 'color' },
  // },
  parameters: {
    styles,
    docs: {
      page: mdx,
    },
  },
};

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    someone1: namor.generate({ words: 1, numbers: 0 }),
    someone2: namor.generate({ words: 1, numbers: 0 }),
    someone3: namor.generate({ words: 1, numbers: 0 }),
    someone4: namor.generate({ words: 1, numbers: 0 }),
    someone5: namor.generate({ words: 1, numbers: 0 }),
    someone6: namor.generate({ words: 1, numbers: 0 }),
    someone7: namor.generate({ words: 1, numbers: 0 }),
    someone8: namor.generate({ words: 1, numbers: 0 }),
    someone9: namor.generate({ words: 1, numbers: 0 }),
    someone10: namor.generate({ words: 1, numbers: 0 }),
    someone11: namor.generate({ words: 1, numbers: 0 }),
    someone12: namor.generate({ words: 1, numbers: 0 }),
    someone13: namor.generate({ words: 1, numbers: 0 }),
    someone14: namor.generate({ words: 1, numbers: 0 }),
    someone15: namor.generate({ words: 1, numbers: 0 }),
    someone16: namor.generate({ words: 1, numbers: 0 }),
    someone17: namor.generate({ words: 1, numbers: 0 }),
    someone18: namor.generate({ words: 1, numbers: 0 }),
    someone19: namor.generate({ words: 1, numbers: 0 }),
    someone20: namor.generate({ words: 1, numbers: 0 }),
      status:
        statusChance > 0.66
          ? 'relationship'
          : statusChance > 0.33
            ? 'complicated'
            : 'single',
  };
};

const makeData = (...lens) => {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map(() => ({
      ...newPerson(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}

const defaultHeader = [
  {
    Header: 'Row Index',
    accessor: (row, i) => i,
    sticky: "left",
    id: 'rowIndex', // id is required when accessor is a function.
  },
  {
    Header: 'First Name',
    accessor: 'firstName',
    sticky: "left",
  },
  {
    Header: 'Last Name',
    accessor: 'lastName',
  },
  {
    Header: 'Age',
    accessor: 'age',
    width: 50,
  },
  {
    Header: 'Visits',
    accessor: 'visits',
    width: 60,
  },
  {
    Header: 'Someone 1',
    accessor: 'someone1',
  },
  {
    Header: 'Someone 2',
    accessor: 'someone2',
  },
  {
    Header: 'Someone 3',
    accessor: 'someone3',
  },
  {
    Header: 'Someone 4',
    accessor: 'someone4',
  },
  {
    Header: 'Someone 5',
    accessor: 'someone5',
  },
  {
    Header: 'Someone 6',
    accessor: 'someone6',
  },
  {
    Header: 'Someone 7',
    accessor: 'someone7',
  },
  {
    Header: 'Someone 8',
    accessor: 'someone8',
  },
  {
    Header: 'Someone 9',
    accessor: 'someone9',
  },
  {
    Header: 'Someone 10',
    accessor: 'someone10',
  },
];

/**
* TODO: Declare template(s) for one or more scenarios.
*/


const BasicUsage = () => {
  const columns = React.useMemo(() => defaultHeader, []);
  const [data] = useState(makeData(10));
  const datagridState = useDatagrid(
    {
      columns,
      data,
    },
  );

  return <Datagrid {...datagridState} />;
};

const InitialLoad = () => {
  const columns = React.useMemo(() => defaultHeader, []);
  const [data, setData] = useState(makeData(0));

  const [isFetching, setIsFetching] = useState(false);
  const fetchData = () => new Promise((resolve) => {
    setIsFetching(true);
    setTimeout(() => {
      setData(data.concat(makeData(30, 5, 2)));
      resolve();
    }, 1000);
  }).then(() => setIsFetching(false) );

  useEffect(() => {
    fetchData();
  }, []);

  const datagridState = useDatagrid(
    {
      columns,
      data,
      isFetching,
    },
  );

  return <Datagrid {...datagridState} />;
};

export const dataGridBasicUsage = prepareStory(BasicUsage, {
  args: {},
});
 
export const dataGridInitialLoad = prepareStory(InitialLoad, {
  args: {},
});
