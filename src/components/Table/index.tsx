import * as React from "react";
import { DataGrid, GridToolbar, GridToolbarExport } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import "./styles.scss";
import PaginationCustom from "../Pagination";
import { Pagination, Space, Table } from "antd";
import {
  GridToolbarContainer,
  GridToolbarContainerProps,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridCsvExportOptions,
  GridExportMenuItemProps,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  GridApi,
  selectedGridRowsSelector,
  GridPrintGetRowsToExportParams,
  GridRowId,
} from "@mui/x-data-grid";
const DataTable = ({
  rows,
  columns,
  totalPages,
  totalItems = 0,
  handleOnChange,
  current,
  pageSize,
}: any) => {
  const csvOptions: GridCsvExportOptions = {
    fileName: "customerDataBase",
    delimiter: ";",
    utf8WithBom: true,
  };
  const excelOptions = {
    recruitmentDay: { numFmt: "dd/mm/yyyy" },
    // set this column in green
    incomes: { font: { argb: "FF00FF00" } },
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport
          csvOptions={{
            fileName: "customerDataBase",
            delimiter: ";",
            utf8WithBom: true,
          }}
          excelOptions={{
            columnsStyles: {
              // replace the dd.mm.yyyy default date format
              recruitmentDay: { numFmt: "dd/mm/yyyy" },
              // set this column in green
              incomes: { font: { argb: "FF00FF00" } },
            },
          }}
          printOptions
        />
      </GridToolbarContainer>
    );
  }
  const getSelectedRowsToExport = ({
    apiRef,
  }: GridPrintGetRowsToExportParams): GridRowId[] => {
    const selectedRowIds = selectedGridRowsSelector(apiRef);
    if (selectedRowIds.size > 0) {
      return Array.from(selectedRowIds.keys());
    }

    return gridFilteredSortedRowIdsSelector(apiRef);
  };
  return (
    <Paper
      className="data-table text-2xl"
      sx={{
        fontSize: "24px",
      }}
    >
      <div className="data-table_container text-2xl">
        <DataGrid
          className="text-xl"
          rows={rows}
          columns={columns}
          getRowId={(row) => row.stt}
          loading={!rows.length}
          slots={{ toolbar: GridToolbar }}
          // slots={{ toolbar: CustomToolbar }}
          checkboxSelection
          slotProps={{ toolbar: { csvOptions, excelOptions } }}
          autoHeight
          density="comfortable"
          rowHeight={60}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          // disableDensitySelector={true}
          // disableColumnMenu={true}
          // hideFooterPagination
        />
      </div>
      {/* <div className="data-table__pagination">
        <p className="data-table__total-item">{`Tổng cộng: ${totalItems}`}</p>
        <Pagination
          current={current + 1}
          pageSize={pageSize}
          total={totalItems}
          onChange={handleOnChange}
        />
      </div> */}
    </Paper>
  );
};

export default DataTable;

