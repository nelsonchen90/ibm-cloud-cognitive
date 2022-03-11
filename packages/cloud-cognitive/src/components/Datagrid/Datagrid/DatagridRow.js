/*
* Licensed Materials - Property of IBM
* 5724-Q36
* (c) Copyright IBM Corp. 2020
* US Government Users Restricted Rights - Use, duplication or disclosure
* restricted by GSA ADP Schedule Contract with IBM Corp.
*/
// @flow
import React from 'react';
import { DataTable, SkeletonText } from 'carbon-components-react';
import { selectionColumnId } from '../common-column-ids';

const {
  TableRow,
  TableCell,
} = DataTable;

// eslint-disable-next-line react/prop-types
const DatagridRow = (datagridState) => {
  const { row } = datagridState;
  return (
    <TableRow className="datagrid-carbon-row" {...row.getRowProps()} key={row.id}>
      {row.cells.map((cell) => {
        const cellProps = cell.getCellProps();
        const { children, ...restProps } = cellProps;
        const content = children || (
          <>
            { !row.isSkeleton && cell.render('Cell')}
            { row.isSkeleton && <SkeletonText />}
          </>
        );
        if (cell && cell.column && cell.column.id === selectionColumnId) {
          // directly render component without the wrapping TableCell
          return cell.render('Cell', { key: cell.column.id });
        }
        return (
          <TableCell className="cell" {...restProps} key={cell.column.id}>
            {content}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default DatagridRow;
