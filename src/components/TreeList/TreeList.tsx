import { featureTextFormatters } from "../../config";
import type { TreeFeature } from "../../types";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
} from "@mui/material";

type Order = "asc" | "desc";
type OrderBy = "name" | "size" | "planted" | "lastUpdated";

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
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("name");

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
          aValue = a.properties.DIAM;
          bValue = b.properties.DIAM;
          break;
        case "planted":
          aValue = a.properties.PLANTED_DATE ?? 0;
          bValue = b.properties.PLANTED_DATE ?? 0;
          break;
        case "lastUpdated":
          aValue = a.properties.LAST_VERIFY_DATE ?? 0;
          bValue = b.properties.LAST_VERIFY_DATE ?? 0;
          break;
        default:
          aValue = a.properties.COMMON_NAME;
          bValue = b.properties.COMMON_NAME;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return order === "asc" ? comparison : -comparison;
      } else {
        const comparison = (aValue as number) - (bValue as number);
        return order === "asc" ? comparison : -comparison;
      }
    });
  }, [trees, order, orderBy]);

  const paginatedTrees = useMemo(() => {
    return sortedTrees.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [sortedTrees, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0); // Reset to first page when sorting
  };

  const columns = [
    {
      id: "name" as OrderBy,
      label: "Name",
      renderCell: (item: TreeFeature) => item.properties.COMMON_NAME,
    },
    {
      id: "size" as OrderBy,
      label: "Size",
      renderCell: (item: TreeFeature) =>
        featureTextFormatters.DIAM(item.properties.DIAM),
    },
    {
      id: "planted" as OrderBy,
      label: "Planted",
      renderCell: (item: TreeFeature) =>
        featureTextFormatters.PLANTED_DATE(item.properties.PLANTED_DATE),
    },
    {
      id: "lastUpdated" as OrderBy,
      label: "Last Updated",
      renderCell: (item: TreeFeature) =>
        featureTextFormatters.LAST_VERIFY_DATE(
          item.properties.LAST_VERIFY_DATE,
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-3 bg-white p-2 rounded-2xl overflow-y-auto z-2">
      <h2 className="p-2 text-center text-sm text-gray-500 border-b border-b-gray-200">
        Visible Trees
      </h2>

      {trees.length ? (
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table
            size="small"
            sx={{ fontSize: "13px" }}
            onMouseOut={() => setHovered(null)}
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.label} sx={{ fontWeight: "bold" }}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
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
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    cursor: "pointer",
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.label} sx={{ fontSize: "13px" }}>
                      {column.renderCell(tree)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={sortedTrees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <div className="bg-gray-50 border border-gray-100 w-56 h-36 flex items-center justify-center text-gray-500 text-xs rounded-2xl">
          No matching trees in view
        </div>
      )}
    </div>
  );
}
