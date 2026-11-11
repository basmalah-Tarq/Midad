export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12" aria-busy="true">
      <div className="mb-8 h-9 w-56 animate-pulse rounded-lg bg-line" />
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[2/3] animate-pulse rounded-md bg-line" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-line" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
