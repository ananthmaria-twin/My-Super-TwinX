
import { type NavModuleId } from '../../types';

interface SkeletonLoaderProps {
  module: NavModuleId;
}

export default function SkeletonLoader({ module }: SkeletonLoaderProps) {
  if (module === 'digitaltwins') {
    return (
      <div id="skeleton-digital-twins" className="space-y-6 animate-pulse select-none">
        {/* Entity Header Banner Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
              <div className="space-y-2">
                <div className="h-5 w-56 bg-slate-200 rounded-md" />
                <div className="h-3 w-80 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-24 bg-slate-100 rounded-lg" />
              <div className="h-8 w-28 bg-slate-200 rounded-lg" />
            </div>
          </div>

          {/* Metric Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                <div className="h-2.5 w-20 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-300 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Tab Bar Skeleton */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-28 bg-slate-200 rounded-lg" />
          ))}
        </div>

        {/* Main 2-Column Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-44 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-100 rounded" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-10 w-full bg-slate-100 rounded-lg flex items-center px-4 justify-between">
                  <div className="h-3 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="h-3 w-16 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="h-4 w-36 bg-slate-200 rounded" />
              <div className="h-48 w-full bg-slate-100 rounded-xl" />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-24 w-full bg-slate-50 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (module === 'livefeatures') {
    return (
      <div id="skeleton-live-features" className="space-y-6 animate-pulse select-none">
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-64 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-96 bg-slate-100 rounded-md" />
            </div>
            <div className="flex space-x-2">
              <div className="h-9 w-28 bg-slate-200 rounded-lg" />
              <div className="h-9 w-24 bg-slate-100 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Streaming Chart Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-slate-200" />
              <div className="space-y-1">
                <div className="h-4 w-48 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-7 w-20 bg-slate-100 rounded" />
              <div className="h-7 w-20 bg-slate-100 rounded" />
            </div>
          </div>
          {/* Chart Wireframe Canvas */}
          <div className="h-64 w-full bg-slate-900/90 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex justify-between text-slate-700 font-mono text-[10px]">
              <div className="h-2 w-12 bg-slate-800 rounded" />
              <div className="h-2 w-16 bg-slate-800 rounded" />
            </div>
            <div className="w-full border-b border-dashed border-slate-800 my-4" />
            <div className="w-full border-b border-dashed border-slate-800 my-4" />
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-2 w-8 bg-slate-800 rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* Feature Store Table Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <div className="h-5 w-48 bg-slate-200 rounded" />
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full bg-slate-50 rounded-lg border border-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (module === 'configuration') {
    return (
      <div id="skeleton-configuration" className="space-y-6 animate-pulse select-none">
        {/* Navigation Step Pills Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-36 bg-slate-100 rounded-lg" />
            ))}
          </div>
          <div className="h-8 w-28 bg-slate-200 rounded-lg" />
        </div>

        {/* Configuration Body Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-2">
              <div className="h-5 w-60 bg-slate-200 rounded" />
              <div className="h-3 w-80 bg-slate-100 rounded" />
            </div>
            <div className="h-9 w-32 bg-slate-200 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-full bg-slate-100 rounded" />
                <div className="h-20 w-full bg-white rounded-lg border border-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Catalog / Generic fallback skeleton
  return (
    <div id="skeleton-generic-module" className="space-y-6 animate-pulse select-none">
      {/* Top Banner Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-52 bg-slate-200 rounded" />
            <div className="h-3.5 w-80 bg-slate-100 rounded" />
          </div>
          <div className="h-9 w-28 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* Grid of Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-200" />
              <div className="h-4 w-16 bg-slate-100 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-40 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-100 rounded" />
              <div className="h-3 w-3/4 bg-slate-100 rounded" />
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-7 w-20 bg-slate-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
