import React, { useEffect, useMemo, useState } from "react";
import Pagination from "./TablePagination";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";

export interface Column<T extends object> {
  key?: keyof T | string;
  label: string | React.ReactNode;
  align?: "left" | "center" | "right";
  dataCellAlign?: "left" | "center" | "right";
  renderCell?: (row: T, index: number) => React.ReactNode;
}

export interface CustomTableProps<T extends object> {
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
  loading?: boolean;
  error?: string | null;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

/**
 * @file CustomTable.tsx
 * @description Reusable, responsive data table with smart sticky header and pagination that never hides.
 */
export function CustomTable<T extends object>({
  columns,
  initialPageSize = 10,
  api,
  data,
  externalFilters,
  showPagination = true,
  loading: externalLoading,
  error: externalError,
  totalCount: externalTotalCount,
  currentPage: externalCurrentPage,
  pageSize: externalPageSize,
  onPageChange: externalOnPageChange,
  onPageSizeChange: externalOnPageSizeChange,
}: CustomTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [serverData, setServerData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  // Keep internal pageSize in sync when the external initialPageSize prop changes
  useEffect(() => {
    setPageSize(initialPageSize);
  }, [initialPageSize]);

  const loading = externalLoading ?? internalLoading;
  const error = externalError ?? internalError;

  const isExternalPagination =
    !!externalOnPageChange &&
    externalCurrentPage !== undefined &&
    externalTotalCount !== undefined;
  const activePage = isExternalPagination
    ? (externalCurrentPage ?? 1)
    : currentPage;
  const activePageSize =
    isExternalPagination && externalPageSize !== undefined
      ? externalPageSize
      : pageSize;

  // ---------- Fetch (Server Pagination) ----------
  useEffect(() => {
    const fetchData = async () => {
      if (!api) return;
      try {
        setInternalLoading(true);
        setInternalError(null);
        const res = await api({
          page: activePage,
          pageSize: activePageSize,
          filters: externalFilters,
        });
        setServerData(res.data);
        setTotal(res.total);
      } catch {
        setInternalError("Failed to load data.");
      } finally {
        setInternalLoading(false);
      }
    };
    fetchData();
  }, [api, activePage, activePageSize, externalFilters]);

  // ---------- Data Helpers ----------
  const allData = api ? serverData : (data ?? []);
  const totalCount = isExternalPagination
    ? (externalTotalCount ?? allData.length)
    : api
      ? total
      : allData.length;

  const paginatedData = useMemo(() => {
    if (api) return allData;

    if (isExternalPagination) {
      return allData;
    }

    const start = (activePage - 1) * activePageSize;
    return allData.slice(start, start + activePageSize);
  }, [allData, activePage, activePageSize, api, isExternalPagination]);

  const handlePageChange = (page: number) => {
    if (isExternalPagination) {
      externalOnPageChange?.(page);
    } else {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (isExternalPagination) {
      externalOnPageSizeChange?.(size);
    } else {
      setPageSize(size);
      setCurrentPage(1);
    }
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
        <div className="flex-1 overflow-auto min-h-[350px]">
          {loading && (
            <div className="flex justify-center items-center py-10 w-full">
              <LoaderComponent />
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
                                : col.key
                                  ? (row[col.key as keyof T] as React.ReactNode)
                                  : null}
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
                                : col.key
                                  ? (row[col.key as keyof T] as React.ReactNode)
                                  : null}
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
                                  : col.key
                                    ? (row[
                                        col.key as keyof T
                                      ] as React.ReactNode)
                                    : null}
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
              pageSize={activePageSize}
              currentPage={activePage}
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
