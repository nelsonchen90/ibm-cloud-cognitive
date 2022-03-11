/*
* Licensed Materials - Property of IBM
* 5724-Q36
* (c) Copyright IBM Corp. 2020
* US Government Users Restricted Rights - Use, duplication or disclosure
* restricted by GSA ADP Schedule Contract with IBM Corp.
*/
import useRowExpander from './useRowExpander';

const useNestedRows = (hooks) => {
  useRowExpander(hooks);
  const marginLeft = 32;

  const getRowProps = (props, { row }) => [
    props,
    { className: row.depth > 0 ? 'carbon-nested-row' : '' },
  ];
  const getRowStyles = (props, { row }) => [
    props,
    {
      style: {
        marginLeft: `${row.depth > 0 ? marginLeft : 0}px`,
        paddingLeft: `${row.depth > 1 ? marginLeft * (row.depth - 1) : 0}px`,
        maxWidth: `calc(100% - ${marginLeft * row.depth}px)`,
      },
    },
  ];
  const getCellProps = (props, { cell, instance }) => {
    // reduce the "first cell"s width to compensate added (left) margin
    const isFirstCell = instance.columns.findIndex((c) => c.id === cell.column.id) === 0;
    return [
      props,
      {
        style: {
          marginRight: isFirstCell ? `-${marginLeft * cell.row.depth}px` : '',
        },
      },
    ];
  };

  hooks.getRowProps.push(getRowProps);
  hooks.getRowProps.push(getRowStyles);
  hooks.getCellProps.push(getCellProps);
};

export default useNestedRows;
