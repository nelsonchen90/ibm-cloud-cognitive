/*
* Licensed Materials - Property of IBM
* 5724-Q36
* (c) Copyright IBM Corp. 2020, 2021
* US Government Users Restricted Rights - Use, duplication or disclosure
* restricted by GSA ADP Schedule Contract with IBM Corp.
*/
// @flow
import React from 'react';
import cx from 'classnames';
import { DataTable } from 'carbon-components-react';
import { selectionColumnId } from '../common-column-ids';

const HeaderRow = (datagridState) => (
  <TableRow className="datagrid-head">
    {datagridState.headers
      .filter(({ isVisible }) => isVisible)
      .map((header) => {
        if (header.id === selectionColumnId) {
          // render directly without the wrapper TableHeader
          return header.render('Header', { key: header.id });
        }
        return (
          <TableHeader
            {...header.getHeaderProps()}
            className={cx(
              {
                resizableColumn: header.getResizerProps,
                isResizing: header.isResizing,
                sortableColumn: header.canSort,
                isSorted: header.isSorted,
              },
              header.getHeaderProps().className
            )}
            key={header.id}
          >
            {header.render('Header')}
            {header.getResizerProps && (
              <div {...header.getResizerProps()} className="resizer" />
            )}
          </TableHeader>
        );
      })}
  </TableRow>
);

const {
  TableHeader,
  TableRow,
} = DataTable;

const useHeaderRow = (hooks) => {
  const useInstance = (instance) => {
    Object.assign(instance, { HeaderRow });
  };
  hooks.useInstance.push(useInstance);
};

export default useHeaderRow;
