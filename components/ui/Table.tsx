import { ReactNode } from "react";

interface ColumnDef<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: string;
  className?: string;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  empty = "No records",
  className = "",
}: TableProps<T>) {
  return (
    <div className={`overflow-x-auto bg-surface-card border border-rule rounded-card ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-elevated border-b border-rule">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-ink-soft ${c.className ?? ""}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-ink-faint italic"
              >
                {empty}
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={rowKey(r)} className="border-b border-rule last:border-0 hover:bg-surface-elevated/60">
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 align-middle ${c.className ?? ""}`}>
                  {c.render(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
