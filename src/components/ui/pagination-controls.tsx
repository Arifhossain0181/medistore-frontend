"use client";

import { Button } from "@/components/ui/button";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
};

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  itemLabel = "items",
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, page + 1);
  const pages: number[] = [];

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Page {page} of {totalPages} ({itemLabel})
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        {start > 1 ? (
          <Button type="button" variant="outline" size="sm" onClick={() => onPageChange(1)}>
            1
          </Button>
        ) : null}

        {start > 2 ? <span className="px-1 text-slate-500">...</span> : null}

        {pages.map((pageNo) => (
          <Button
            key={pageNo}
            type="button"
            size="sm"
            variant={pageNo === page ? "default" : "outline"}
            onClick={() => onPageChange(pageNo)}
          >
            {pageNo}
          </Button>
        ))}

        {end < totalPages - 1 ? <span className="px-1 text-slate-500">...</span> : null}

        {end < totalPages ? (
          <Button type="button" variant="outline" size="sm" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </Button>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
