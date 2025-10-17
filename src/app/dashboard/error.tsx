'use client';

import React from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto rounded-md border border-red-200 bg-red-50 p-4">
        <p className="font-semibold text-red-700">Failed to load Dashboard.</p>
        <button className="mt-3 inline-flex rounded-md bg-red-600 px-3 py-1.5 text-white" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
