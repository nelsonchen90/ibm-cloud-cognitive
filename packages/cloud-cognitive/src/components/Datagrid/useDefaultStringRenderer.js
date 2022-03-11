/*
* Licensed Materials - Property of IBM
* 5724-Q36
* (c) Copyright IBM Corp. 2020
* US Government Users Restricted Rights - Use, duplication or disclosure
* restricted by GSA ADP Schedule Contract with IBM Corp.
*/
import React from 'react';

const useDefaultStringRenderer = (hooks) => {

  const StringRenderer = (tableProps) => (
    <div className="defaultStringRenderer" title={tableProps.value}>
      {tableProps.value}
    </div>
  );

  const HeaderRenderer = (header) => (
    <div className="defaultStringRenderer" title={typeof header === 'string' ? header : ''}>
      {header}
    </div>
  );

  const visibleColumns = (columns) => {
    const columnsWithDefaultCells = columns.map((column) => ({
      Cell: StringRenderer,
      ...column,
      Header: column.HeaderRenderer || HeaderRenderer(column.Header),
    }));
    return [...columnsWithDefaultCells];
  };
  hooks.visibleColumns.push(visibleColumns);
};

export default useDefaultStringRenderer;
