import { AlertCircle, Inbox, RefreshCcw } from 'lucide-react';
import { Skeleton } from '@mui/material';

export const FeedSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4 mt-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="30%" height={20} />
              <Skeleton variant="text" width="18%" height={16} />
            </div>
          </div>
          <Skeleton variant="text" width="92%" height={18} />
          <Skeleton variant="text" width="75%" height={18} />
          <Skeleton variant="rounded" height={280} className="mt-4" />
          <div className="flex gap-3 mt-4">
            <Skeleton variant="rounded" width={100} height={36} />
            <Skeleton variant="rounded" width={100} height={36} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const GridSkeleton = ({ count = 8, columns = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' }) => {
  return (
    <div className={`grid gap-4 ${columns}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Skeleton variant="rounded" height={192} />
          <div className="p-4 space-y-2">
            <Skeleton variant="text" width="70%" height={22} />
            <Skeleton variant="text" width="45%" height={18} />
            <Skeleton variant="rounded" width={110} height={36} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ListSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
          <Skeleton variant="circular" width={56} height={56} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="35%" height={20} />
            <Skeleton variant="text" width="55%" height={16} />
          </div>
          <Skeleton variant="rounded" width={96} height={36} />
        </div>
      ))}
    </div>
  );
}

export const EmptyState = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white/80 px-6 py-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Inbox size={22} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0866ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0758db]"
        >
          <RefreshCcw size={14} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState = ({ title = 'Something went wrong', description, onRetry, retryLabel = 'Try again' }) => {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle size={22} />
      </div>
      <h3 className="text-lg font-semibold text-red-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-red-700">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          <RefreshCcw size={14} />
          {retryLabel}
        </button>
      )}
    </div>
  );
};