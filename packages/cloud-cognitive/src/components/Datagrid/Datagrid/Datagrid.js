/*
* Licensed Materials - Property of IBM
* 5724-Q36
* (c) Copyright IBM Corp. 2020 - 2021
* US Government Users Restricted Rights - Use, duplication or disclosure
* restricted by GSA ADP Schedule Contract with IBM Corp.
*/
import React from 'react';
import { DataTable } from 'carbon-components-react';
import cx from 'classnames';
import DatagridHead from './DatagridHead';
import DatagridBody from './DatagridBody';
import DatagridToolbar from './DatagridToolbar';

const {
  TableContainer,
  Table,
} = DataTable;

const Datagrid = (datagridState) => {
  const {
    getTableProps,
    rootRef,
    withVirtualScroll,
    DatagridPagination,
    isFetching,
    tableId,
    CustomizeColumnsModal,
    leftPanel,
    fullHeightDatagrid,
    verticalAlign = 'center',
    variableRowHeight,
  } = datagridState;

  const rows = (DatagridPagination && datagridState.page) || datagridState.rows;

  const dataGrid = (
    <>
      <TableContainer className={cx('datagrid', (withVirtualScroll || fullHeightDatagrid) ? 'datagrid-full-height' : '')}>
        <Table
          {...getTableProps()}
          className={cx(
            DatagridPagination ? 'datagrid-with-pagination' : '',
            withVirtualScroll ? '' : 'datagrid-table-simple',
            `vertical-align-${verticalAlign}`,
            { 'variable-row-height': variableRowHeight },
            getTableProps().className
          )}
        >
          <DatagridHead {...datagridState} />
          <DatagridBody {...datagridState} rows={rows} />
        </Table>
      </TableContainer>
      { rows.length > 0 && !isFetching && DatagridPagination && DatagridPagination(datagridState) }
      { CustomizeColumnsModal && <CustomizeColumnsModal instance={datagridState} />}
    </>
  );

  return (
    <div id={tableId} ref={rootRef} className={withVirtualScroll ? 'datagridWrap' : 'datagridWrap-simple'}>
      <DatagridToolbar {...datagridState} />
      { leftPanel
      && (
        <div className="datagrid displayFlex">
          { leftPanel && leftPanel.isOpen && <div className="datagridLeftPanel">{leftPanel.panelContent}</div>}
          <div className="datagridWithPanel">
            {dataGrid}
          </div>
        </div>
      )}
      {leftPanel === undefined && dataGrid}
    </div>
  );
};

export default Datagrid;
