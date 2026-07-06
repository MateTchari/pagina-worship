import type { ReactNode } from "react";

export function EmptyState({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">{children}</div>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </section>
  );
}
