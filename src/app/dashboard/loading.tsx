import React from 'react';
import Sidebar from '../../components/Sidebar';
import { Skeleton } from '../../components/ui/cards';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl flex gap-6 p-4 lg:p-6">
        <Sidebar />
        <main className="flex-1">
          <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Skeleton className="h-72 xl:col-span-2" />
            <Skeleton className="h-72" />
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </div>
        </main>
      </div>
    </div>
  );
}
