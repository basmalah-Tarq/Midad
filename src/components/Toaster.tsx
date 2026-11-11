"use client";

import { useEffect, useState } from "react";
import { onToast } from "@/lib/userLibrary";

export default function Toaster() {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const off = onToast((message) => {
      setToast({ id: Date.now(), message });
      clearTimeout(timer);
      timer = setTimeout(() => setToast(null), 2400);
    });
    return () => {
      off();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {toast && (
        <div
          key={toast.id}
          className="animate-toast rounded-full border border-[#e2b65f]/30 bg-[#123a31] px-5 py-2.5 text-sm font-semibold text-[#f1ebe0] shadow-2xl shadow-black/40"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
