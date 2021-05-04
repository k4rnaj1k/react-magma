import * as React from "react";
import { UsePaginationReturn } from "../../hooks/usePagination";
import { IndeterminateCheckboxStatus } from "../IndeterminateCheckbox";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TablePagination,
  TableProps,
  TableHeaderCellProps,
  TableRowColor,
} from "../Table";

export interface DatagridColumn extends TableHeaderCellProps {
  field: string;
  header: string;
}

export interface DatagridRow {
  id: string | number;
  color?: TableRowColor;
  isSelectableDisabled?: boolean;
  [key: string]: any;
}

/**
 * @children required
 */
export interface DatagridProps extends TableProps {
  columns: DatagridColumn[];
  rows: DatagridRow[];
  onHeaderSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRowSelect?: (
    id: string | number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSelectedRowsChange?: (newSelectedRows: (string | number)[]) => void;
  pagination: { count: number } & UsePaginationReturn;
  selectedRows: (string | number)[];
}

export const Datagrid = React.forwardRef<HTMLTableElement, DatagridProps>(
  (props, ref) => {
    const {
      columns,
      onHeaderSelect,
      onRowSelect,
      onSelectedRowsChange,
      pagination,
      rows,
      selectedRows: controlledSelectedRows,
      ...other
    } = props;
    const [selectedRows, updatedSelectedRows] = React.useState<
      (string | number)[]
    >(controlledSelectedRows || []);

    const isControlled = controlledSelectedRows ? true : false;
    const isPaginated = Boolean(pagination);

    const rowsToShow = isPaginated
      ? rows.slice(
          pagination.page * pagination.rowsPerPage,
          pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
        )
      : rows;

    React.useEffect(() => {
      if (Array.isArray(controlledSelectedRows)) {
        updatedSelectedRows(controlledSelectedRows);
      }
    }, [controlledSelectedRows]);

    const headerRowStatus =
      selectedRows.length === rows.length
        ? IndeterminateCheckboxStatus.checked
        : selectedRows.length > 0
        ? IndeterminateCheckboxStatus.indeterminate
        : IndeterminateCheckboxStatus.unchecked;

    function handleRowSelect(
      id: string | number,
      event: React.ChangeEvent<HTMLInputElement>
    ) {
      const { checked } = event.target;
      const newSelectedRows = [...selectedRows];

      checked
        ? newSelectedRows.push(id)
        : newSelectedRows.splice(newSelectedRows.indexOf(id), 1);

      handleSelectedRowsChange(newSelectedRows);

      onRowSelect &&
        typeof onRowSelect === "function" &&
        onRowSelect(id, event);
    }

    function handleHeaderSelect(event: React.ChangeEvent<HTMLInputElement>) {
      if (
        headerRowStatus === IndeterminateCheckboxStatus.indeterminate ||
        headerRowStatus === IndeterminateCheckboxStatus.checked
      ) {
        handleSelectedRowsChange([]);
      } else {
        handleSelectedRowsChange(rows.map((row) => row.id));
      }

      onHeaderSelect &&
        typeof onHeaderSelect === "function" &&
        onHeaderSelect(event);
    }

    function handleSelectedRowsChange(newSelectedRows) {
      if (isControlled) {
        onSelectedRowsChange &&
          typeof onSelectedRowsChange === "function" &&
          onSelectedRowsChange(newSelectedRows);
      } else {
        updatedSelectedRows(newSelectedRows);
      }
    }

    return (
      <>
        <Table {...other} ref={ref}>
          <TableHead>
            <TableRow
              headerRowStatus={headerRowStatus}
              onHeaderRowSelect={handleHeaderSelect}
            >
              {columns.map(({ field, header, ...other }) => (
                <TableHeaderCell key={`headercell${field}`} {...other}>
                  {header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rowsToShow.map(({ id, color, isSelectableDisabled, ...other }) => (
              <TableRow
                key={`row${id}`}
                color={color}
                isSelected={
                  selectedRows ? selectedRows.indexOf(id) > -1 : false
                }
                isSelectableDisabled={isSelectableDisabled}
                onTableRowSelect={(event) => handleRowSelect(id, event)}
              >
                {Object.keys(other).map((field) => (
                  <TableCell key={`cell${field}`}>{other[field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isPaginated && <TablePagination {...pagination} />}
      </>
    );
  }
);
