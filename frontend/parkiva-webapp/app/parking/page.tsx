'use client';

import { useState } from 'react';
import { useParkingData } from '@/hooks/useApi';
import { ParkingDto } from '@/types/api';

export default function ParkingPage() {
  const [searchDistrict, setSearchDistrict] = useState<string>('');
  const [filterDistrict, setFilterDistrict] = useState<string>('');
  const { data: parkingData, loading, error, refetch } = useParkingData(filterDistrict);

  const handleSearch = () => {
    setFilterDistrict(searchDistrict);
  };

  const handleClearFilter = () => {
    setSearchDistrict('');
    setFilterDistrict('');
  };

  const getUniqueDistricts = () => {
    const districts = parkingData.map(parking => parking.district);
    return [...new Set(districts)].filter(Boolean);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="hero min-h-96 bg-base-200 rounded-lg">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">🅿️ Parking</h1>
            <p className="py-6">
              Find and manage parking spaces in your area. Search by district to discover available parking options.
            </p>
            <div className="form-control w-full max-w-xs mx-auto">
              <label className="label">
                <span className="label-text">Search by District</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g., Kadikoy" 
                className="input input-bordered w-full max-w-xs"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="flex gap-2 mt-4">
                <button 
                  className="btn btn-primary flex-1" 
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? 'Searching...' : 'Search Parking'}
                </button>
                {filterDistrict && (
                  <button 
                    className="btn btn-outline" 
                    onClick={handleClearFilter}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {filterDistrict ? `Parking in ${filterDistrict}` : 'All Parking Areas'}
          </h2>
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={() => refetch()}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {!loading && !error && parkingData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-base-content/70">
              {filterDistrict ? `No parking spaces found in ${filterDistrict}` : 'No parking spaces found'}
            </p>
          </div>
        )}

        {!loading && !error && parkingData.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parkingData.map((parking: ParkingDto) => (
                <div key={parking.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">{parking.name}</h3>
                    <p className="text-sm text-base-content/70">{parking.district}</p>
                    
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span>Total Spaces:</span>
                        <span className="font-semibold">{parking.totalSpaces}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available:</span>
                        <span className={`font-semibold ${parking.availableSpaces > 0 ? 'text-success' : 'text-error'}`}>
                          {parking.availableSpaces}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price/Hour:</span>
                        <span className="font-semibold">₺{parking.pricePerHour}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Free Time:</span>
                        <span className="font-semibold">{parking.freeTime} min</span>
                      </div>
                    </div>

                    <div className="card-actions justify-between items-center mt-4">
                      <div className="flex gap-1">
                        {parking.isReservable && (
                          <div className="badge badge-success badge-sm">Reservable</div>
                        )}
                        {parking.active && (
                          <div className="badge badge-info badge-sm">Active</div>
                        )}
                      </div>
                      <button className="btn btn-primary btn-sm">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Districts Summary */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Available Districts</h3>
              <div className="flex flex-wrap gap-2">
                {getUniqueDistricts().map((district) => (
                  <button
                    key={district}
                    className={`btn btn-sm ${filterDistrict === district ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => {
                      setSearchDistrict(district);
                      setFilterDistrict(district);
                    }}
                  >
                    {district}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
