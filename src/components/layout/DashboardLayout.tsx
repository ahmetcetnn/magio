import React from 'react';

export default function DashboardLayout({
  sidebar,
  topbar,
  children,
}: {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen min-w-full bg-white">
      <div className="flex gap-10 pr-10">
        {sidebar}
        <div className="flex-1 min-h-screen flex flex-col">
          {topbar}
          <div className="flex-1 flex flex-col gap-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
