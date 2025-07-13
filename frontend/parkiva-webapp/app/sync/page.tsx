'use client';

import { useSync, useParkingData } from '@/hooks/useApi';

export default function SyncPage() {
  const { syncIspark, loading, error, success, clearMessages } = useSync();
  const { data: parkingData, refetch: refetchParking } = useParkingData();

  const handleSync = async () => {
    clearMessages();
    try {
      await syncIspark();
      // Refresh parking data after successful sync
      await refetchParking();
    } catch {
      // Error is already handled by the useSync hook
    }
  };

  const totalParkingSpaces = parkingData.length;
  const activeParkingSpaces = parkingData.filter(p => p.active).length;
  const isparkSpaces = parkingData.filter(p => p.dataSource === 1).length; // ISpark = 1
  const lastSyncedSpaces = parkingData.filter(p => p.lastSyncedAt).length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="hero min-h-[24rem] sm:min-h-96 bg-base-200 rounded-lg">
        <div className="hero-content text-center px-4 sm:px-6">
          <div className="max-w-xs sm:max-w-md">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">🔄 Data Sync</h1>
            <p className="py-4 sm:py-6 text-sm sm:text-base">
              Synchronize parking data from external sources like ISpark to keep your information up to date.
            </p>
            
            <div className="space-y-3 sm:space-y-4">
              <button 
                className={`btn btn-primary btn-sm sm:btn-md ${loading ? 'loading' : ''}`}
                onClick={handleSync}
                disabled={loading}
              >
                {loading ? 'Syncing...' : 'Sync ISpark Data'}
              </button>

              {success && (
                <div className="alert alert-success text-xs sm:text-sm">
                  <svg className="stroke-current shrink-0 h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="alert alert-error text-xs sm:text-sm">
                  <svg className="stroke-current shrink-0 h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Sync Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 sm:p-6">
              <h3 className="card-title text-base sm:text-lg">ISpark Integration</h3>
              <p className="text-sm sm:text-base">Sync parking data from Istanbul Metropolitan Municipality ISpark system</p>
              <div className="card-actions justify-end">
                <div className="badge badge-success badge-sm">Connected</div>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 sm:p-6">
              <h3 className="card-title text-base sm:text-lg">Data Status</h3>
              <p className="text-sm sm:text-base">{lastSyncedSpaces > 0 ? 'Data is synchronized and up to date' : 'No synchronized data found'}</p>
              <div className="card-actions justify-end">
                <div className={`badge badge-sm ${lastSyncedSpaces > 0 ? 'badge-info' : 'badge-warning'}`}>
                  {lastSyncedSpaces > 0 ? 'Recent' : 'Needs Sync'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="stats shadow w-full flex-col lg:flex-row">
            <div className="stat place-items-center">
              <div className="stat-figure text-primary">
                <svg className="inline-block w-6 h-6 sm:w-8 sm:h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <div className="stat-title text-xs sm:text-sm">Total Records</div>
              <div className="stat-value text-primary text-xl sm:text-2xl lg:text-3xl">{totalParkingSpaces.toLocaleString()}</div>
              <div className="stat-desc text-xs sm:text-sm">Parking spaces in database</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-figure text-secondary">
                <svg className="inline-block w-6 h-6 sm:w-8 sm:h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="stat-title text-xs sm:text-sm">ISpark Records</div>
              <div className="stat-value text-secondary text-xl sm:text-2xl lg:text-3xl">{isparkSpaces.toLocaleString()}</div>
              <div className="stat-desc text-xs sm:text-sm">From ISpark system</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-figure text-accent">
                <svg className="inline-block w-6 h-6 sm:w-8 sm:h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
              </div>
              <div className="stat-title text-xs sm:text-sm">Active Records</div>
              <div className="stat-value text-accent text-xl sm:text-2xl lg:text-3xl">{activeParkingSpaces.toLocaleString()}</div>
              <div className="stat-desc text-xs sm:text-sm">Currently active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
