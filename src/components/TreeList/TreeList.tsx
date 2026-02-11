import { featureTextFormatters } from "../../config";
import type { TreeFeature } from "../../types";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { timeAgo } from "../../helpers";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
} from "@mui/material";

type Order = "asc" | "desc";
type OrderBy = "name" | "size" | "planted";

export default function TreeList({
  trees = [],
  onSelectTree,
  setHovered,
}: {
  trees: TreeFeature[];
  onSelectTree?: (tree: TreeFeature) => void;
  setHovered: Dispatch<SetStateAction<TreeFeature>>;
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("size");

  const sortedTrees = useMemo(() => {
    const treesArray = [...trees];
    return treesArray.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (orderBy) {
        case "name":
          aValue = a.properties.COMMON_NAME;
          bValue = b.properties.COMMON_NAME;
          break;
        case "size":
          aValue = a.properties.DIAM || 0;
          bValue = b.properties.DIAM || 0;
          break;
        case "planted":
          aValue = a.properties.PLANTED_DATE ?? 0;
          bValue = b.properties.PLANTED_DATE ?? 0;
          break;
        default:
          aValue = a.properties.COMMON_NAME;
          bValue = b.properties.COMMON_NAME;
      }

      const comparison =
        typeof aValue === "string"
          ? aValue.localeCompare(String(bValue))
          : aValue - (bValue as number);

      return order === "asc" ? comparison : -comparison;
    });
  }, [trees, order, orderBy]);

  const paginatedTrees = useMemo(() => {
    return sortedTrees.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [sortedTrees, page, rowsPerPage]);

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden bg-white/60 rounded-2xl">
      <TableContainer className="flex-1 min-h-0 overflow-auto scrollbar-hide">
        <Table
          stickyHeader
          size="small"
          sx={{
            borderCollapse: "separate",
            borderSpacing: "0",
            "& .MuiTableCell-root": {
              border: 0,
              padding: "12px 16px",
            },
          }}
        >
          <TableHead>
            <TableRow>
              {(
                [
                  { id: "name", label: "Species" },
                  { id: "size", label: "Size" },
                  { id: "planted", label: "Planted" },
                ] as const
              ).map((column) => (
                <TableCell key={column.id} className="border-none px-4 py-3">
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleSort(column.id)}
                    className="[&_.MuiTableSortLabel-icon]:text-[14px]"
                  >
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        orderBy === column.id
                          ? "text-slate-800"
                          : "text-slate-400"
                      }`}
                    >
                      {column.label}
                    </span>
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTrees.map((tree) => (
              <TableRow
                key={tree.id}
                onClick={() => onSelectTree?.(tree)}
                onMouseOver={() => setHovered(tree)}
                onMouseOut={() => setHovered(null)}
                className="cursor-pointer group"
                sx={{
                  backgroundColor: "transparent",
                  "& .MuiTableCell-root": {
                    backgroundColor: "transparent",
                    transition: "background-color 0.2s ease-in-out",
                  },
                  "&:hover .MuiTableCell-root": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  },
                  "& .MuiTableCell-root:first-of-type": {
                    borderTopLeftRadius: "16px",
                    borderBottomLeftRadius: "16px",
                  },
                  "& .MuiTableCell-root:last-of-type": {
                    borderTopRightRadius: "16px",
                    borderBottomRightRadius: "16px",
                  },
                }}
              >
                <TableCell>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-black transition-colors">
                    {tree.properties.COMMON_NAME}
                  </span>
                </TableCell>
                <TableCell className="border-none px-4 py-3 transition-colors duration-200 group-hover:bg-black/5">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500 transition-colors">
                    {featureTextFormatters.DIAM(tree.properties.DIAM)}
                  </span>
                </TableCell>
                <TableCell className="border-none px-4 py-3 transition-colors duration-200 group-hover:bg-black/5">
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-600 transition-colors">
                    {tree.properties.PLANTED_DATE
                      ? featureTextFormatters.PLANTED_DATE(
                          tree.properties.PLANTED_DATE,
                        )
                      : "-"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {sortedTrees.length > rowsPerPage && (
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={sortedTrees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="border-t border-black/5"
          sx={{
            "& .MuiTablePagination-toolbar": {
              minHeight: "48px",
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input, & .MuiTablePagination-displayedRows":
              {
                fontSize: "11px",
                fontWeight: 600,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              },
          }}
        />
      )}

      {!trees.length && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
          <span className="material-symbols-outlined text-4xl mb-2">park</span>
          <p className="text-xs font-medium">No matching trees in view</p>
        </div>
      )}
    </div>
  );
}
