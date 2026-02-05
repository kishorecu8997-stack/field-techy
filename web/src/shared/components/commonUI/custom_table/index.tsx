import React, { useEffect, useMemo, useState } from "react";
import Pagination from "./TablePagination";

export interface Column<T> {
  key: keyof T | string;
  label: string | React.ReactNode;
  align?: "left" | "center" | "right";
  dataCellAlign?: "left" | "center" | "right";
  renderCell?: (row: T, index: number) => React.ReactNode;
}

export interface CustomTableProps<T> {
  columns: Column<T>[];
  initialPageSize?: number;
  api?: (params: {
    page: number;
    pageSize: number;
    filters?: { [key: string]: string };
  }) => Promise<{ data: T[]; total: number }>;
  data?: T[];
  externalFilters?: { [key: string]: string };
  showPagination?: boolean;
}

/**
 * @file CustomTable.tsx
 * @description Reusable, responsive data table with smart sticky header and pagination that never hides.
 */
export function CustomTable<T>({
  columns,
  initialPageSize = 10,
  api,
  data,
  externalFilters,
  showPagination = true,
}: CustomTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [serverData, setServerData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- Fetch (Server Pagination) ----------
  useEffect(() => {
    const fetchData = async () => {
      if (!api) return;
      try {
        setLoading(true);
        setError(null);
        const res = await api({
          page: currentPage,
          pageSize,
          filters: externalFilters,
        });
        setServerData(res.data);
        setTotal(res.total);
      } catch {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api, currentPage, pageSize, externalFilters]);

  // ---------- Data Helpers ----------
  const allData = api ? serverData : (data ?? []);
  const totalCount = api ? total : allData.length;

  const paginatedData = useMemo(() => {
    if (api) return allData;
    const start = (currentPage - 1) * pageSize;
    return allData.slice(start, start + pageSize);
  }, [allData, currentPage, pageSize, api]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when size changes
  };

  // ---------- Utils ----------
  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  // ---------- Render ----------
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col flex-1 shadow overflow-hidden bg-white dark:bg-gray-900">
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          {loading && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-300">
              Loading...
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-red-500">{error}</div>
          )}

          {!loading && !error && (
            <>
              <div className="hidden md:block w-full">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-sm sticky top-0 z-10">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={String(col.key)}
                          className={`py-2 px-4 text-sm whitespace-nowrap ${getAlignClass(
                            col.align,
                          )} text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-800`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((row, i) => (
                        <tr
                          key={i}
                          className="border-t border-gray-200 text-sm dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                        >
                          {columns.map((col) => (
                            <td
                              key={String(col.key)}
                              className={`py-2 px-4 text-sm ${getAlignClass(
                                col.dataCellAlign,
                              )} text-gray-800 dark:text-gray-100`}
                            >
                              {col.renderCell
                                ? col.renderCell(row, i)
                                : (row as any)[col.key]}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-6 text-gray-500 dark:text-gray-300"
                        >
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="grid md:hidden gap-4 p-3">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, i) => (
                    <div
                      key={i}
                      className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-600"
                    >
                      <div className="space-y-2">
                        {columns.map((col) => {
                          const isAction = col.key === "action";
                          return isAction ? (
                            <div
                              key={String(col.key)}
                              className="flex justify-end"
                            >
                              {col.renderCell
                                ? col.renderCell(row, i)
                                : (row as any)[col.key]}
                            </div>
                          ) : (
                            <div
                              key={String(col.key)}
                              className="flex gap-4 items-start"
                            >
                              <span className="font-medium text-gray-700 dark:text-cyan-300">
                                {col.label}:
                              </span>
                              <span className="text-gray-800 dark:text-gray-100 text-left">
                                {col.renderCell
                                  ? col.renderCell(row, i)
                                  : (row as any)[col.key]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center rounded-lg p-4 shadow bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-600 py-10">
                    No Data Found
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ✅ Always-visible Pagination Footer */}
        {showPagination && (
          <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-sm z-20">
            <Pagination
              total={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomTable;
