'use client';

import { useState, useEffect, useRef } from 'react';
import { ParkingDto } from '@/types/api';
import { parkingApi } from '@/lib/api';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

interface SearchFilters {
  address: string;
  useCurrentLocation: boolean;
  radiusKm: number;
  sortBy: 'distance' | 'availability' | 'price';
  selectedCoordinates?: { lat: number; lng: number }; // Store coordinates from selected suggestion
}

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

export default function FindParkingPage() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null
  });
  
  const [filters, setFilters] = useState<SearchFilters>({
    address: '',
    useCurrentLocation: false,
    radiusKm: 2,
    sortBy: 'distance'
  });

  const [searchResults, setSearchResults] = useState<ParkingDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get user's current location
  const getCurrentLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    if (!navigator.geolocation) {
      setLocation(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Geolocation is not supported by this browser' 
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null
        });
        setFilters(prev => ({ ...prev, useCurrentLocation: true }));
      },
      (error) => {
        let errorMessage = 'Error getting location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setLocation(prev => ({ ...prev, loading: false, error: errorMessage }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Geocode address to coordinates
  const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
    try {
      console.log('Geocoding address:', address);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, Istanbul, Turkey&limit=1`);
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      console.log('Geocoding response:', data);
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Fetch address suggestions
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Istanbul, Turkey&limit=5&addressdetails=1`);
      const data = await response.json();
      
      const suggestions: AddressSuggestion[] = data.map((item: {
        display_name: string;
        lat: string;
        lon: string;
        place_id: string;
      }) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        place_id: item.place_id
      }));
      
      setAddressSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Handle address input change
  const handleAddressChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      address: value,
      selectedCoordinates: undefined // Clear stored coordinates when user types manually
    }));
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout for debounced API call
    debounceTimeoutRef.current = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    setFilters(prev => ({ 
      ...prev, 
      address: suggestion.display_name,
      selectedCoordinates: {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon)
      }
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Search for nearby parking
  const searchNearbyParking = async () => {
    setIsSearching(true);
    try {
      let searchLat = location.latitude;
      let searchLng = location.longitude;

      // If using address search instead of current location
      if (!filters.useCurrentLocation && filters.address.trim()) {
        // First check if we have coordinates from selected suggestion
        if (filters.selectedCoordinates) {
          searchLat = filters.selectedCoordinates.lat;
          searchLng = filters.selectedCoordinates.lng;
        } else {
          // Fallback to geocoding the address
          const coords = await geocodeAddress(filters.address);
          if (coords) {
            searchLat = coords.lat;
            searchLng = coords.lng;
          } else {
            throw new Error('Address not found. Please try selecting from the suggestions or enter a more specific address in Istanbul.');
          }
        }
      }

      if (!searchLat || !searchLng) {
        throw new Error('Location not specified. Please enter an address or use your current location.');
      }

      // Call your API to search for nearby parking
      let results = await parkingApi.getNearby(searchLat, searchLng, filters.radiusKm);
      
      // Sort results based on selected criteria
      results = sortParkingResults(results, searchLat, searchLng, filters.sortBy);
      
      setSearchResults(results);
      
      if (results.length === 0) {
        alert('No parking spaces found in the specified area. Try increasing the search radius or searching in a different location.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert(error instanceof Error ? error.message : 'Search error occurred. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Sort parking results
  const sortParkingResults = (results: ParkingDto[], userLat: number, userLng: number, sortBy: string) => {
    return [...results].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          const distanceA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
          const distanceB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
          return distanceA - distanceB;
        case 'availability':
          return b.availableSpaces - a.availableSpaces;
        case 'price':
          return a.pricePerHour - b.pricePerHour;
        default:
          return 0;
      }
    });
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Navigate to parking location
  const navigateToParking = (parking: ParkingDto, mapType: 'apple' | 'google') => {
    const lat = parking.latitude;
    const lng = parking.longitude;
    const destination = encodeURIComponent(parking.name);

    if (mapType === 'apple') {
      // Apple Maps
      const appleUrl = `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
      window.open(appleUrl, '_blank');
    } else {
      // Google Maps
      const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${destination}`;
      window.open(googleUrl, '_blank');
    }
  };

  // Format distance
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} meters`;
    }
    return `${distance.toFixed(1)} km`;
  };

  // Get park type in English
  const getParkTypeEnglish = (parkType: number): string => {
    switch (parkType) {
      case 0: return 'Street Parking';
      case 1: return 'Parking Garage';
      case 2: return 'Parking Lot';
      case 3: return 'Private Parking';
      default: return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">🔍 Find Nearby Parking</h1>
        <p className="text-lg text-gray-600">
          Find the closest available parking spaces with real-time availability
        </p>
      </div>

      {/* Search Filters */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title mb-4">Search & Filters</h2>
          
          {/* Location Type Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Search Type</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="label cursor-pointer">
                <input 
                  type="radio" 
                  name="searchType" 
                  className="radio radio-primary" 
                  checked={!filters.useCurrentLocation}
                  onChange={() => setFilters(prev => ({ ...prev, useCurrentLocation: false }))}
                />
                <span className="label-text ml-2">Search by Address</span>
              </label>
              <label className="label cursor-pointer">
                <input 
                  type="radio" 
                  name="searchType" 
                  className="radio radio-primary" 
                  checked={filters.useCurrentLocation}
                  onChange={() => setFilters(prev => ({ ...prev, useCurrentLocation: true }))}
                />
                <span className="label-text ml-2">Use Current Location</span>
              </label>
            </div>
          </div>

          {/* Address Input */}
          {!filters.useCurrentLocation && (
            <div className="form-control relative">
              <label className="label">
                <span className="label-text font-medium">Enter Address</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g., Taksim, Istanbul" 
                  className="input input-bordered w-full"
                  value={filters.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onFocus={() => {
                    if (addressSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow clicking on them
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                />
                {isLoadingSuggestions && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="loading loading-spinner loading-sm"></div>
                  </div>
                )}
                {filters.selectedCoordinates && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="text-success text-sm">📍</div>
                  </div>
                )}
              </div>
              
              {/* Show selected location indicator */}
              {filters.selectedCoordinates && (
                <div className="text-success text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Location selected from suggestions
                </div>
              )}
              
              {/* Address Suggestions Dropdown */}
              {showSuggestions && addressSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {addressSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.place_id}
                      className="p-3 hover:bg-base-200 cursor-pointer border-b border-base-300 last:border-b-0"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <div className="text-sm font-medium truncate">
                        {suggestion.display_name.split(',').slice(0, 2).join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {suggestion.display_name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Current Location */}
          {filters.useCurrentLocation && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Current Location</span>
              </label>
              <div className="flex items-center gap-4">
                <button 
                  className={`btn btn-outline ${location.loading ? 'loading' : ''}`}
                  onClick={getCurrentLocation}
                  disabled={location.loading}
                >
                  {location.loading ? 'Getting Location...' : 'Get Current Location'}
                </button>
                {location.error && (
                  <div className="text-error text-sm">{location.error}</div>
                )}
                {location.latitude && location.longitude && (
                  <div className="text-success text-sm">
                    Location acquired ✓
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Radius */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Search Radius: {filters.radiusKm} km</span>
            </label>
            <input 
              type="range" 
              min="0.5" 
              max="10" 
              step="0.5" 
              value={filters.radiusKm} 
              className="range range-primary" 
              onChange={(e) => setFilters(prev => ({ ...prev, radiusKm: parseFloat(e.target.value) }))}
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>0.5 km</span>
              <span>5 km</span>
              <span>10 km</span>
            </div>
          </div>

          {/* Sort Options */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Sort by</span>
            </label>
            <select 
              className="select select-bordered"
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as 'distance' | 'availability' | 'price' }))}
            >
              <option value="distance">Distance</option>
              <option value="availability">Available Spaces</option>
              <option value="price">Price</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="card-actions justify-end mt-4">
            <button 
              className={`btn btn-primary ${isSearching ? 'loading' : ''}`}
              onClick={searchNearbyParking}
              disabled={isSearching || (!filters.useCurrentLocation && !filters.address.trim()) || (filters.useCurrentLocation && !location.latitude)}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Search Results ({searchResults.length} parking spaces)</h2>
          
          {searchResults.map((parking) => {
            const distance = location.latitude && location.longitude 
              ? calculateDistance(location.latitude, location.longitude, parking.latitude, parking.longitude)
              : 0;

            return (
              <div key={parking.id} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Parking Info */}
                    <div className="flex-1">
                      <h3 className="card-title text-xl mb-2">{parking.name}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="badge badge-secondary">{parking.district}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>{formatDistance(distance)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                            <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{getParkTypeEnglish(parking.parkType)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`badge ${parking.availableSpaces > 10 ? 'badge-success' : parking.availableSpaces > 5 ? 'badge-warning' : 'badge-error'}`}>
                            {parking.availableSpaces} available
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          <span>₺{parking.pricePerHour}/hour</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>{parking.openHours}</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => navigateToParking(parking, 'google')}
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Google Maps
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigateToParking(parking, 'apple')}
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Apple Maps
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {searchResults.length === 0 && !isSearching && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No search performed yet</h3>
          <p className="text-gray-600">Use the form above to find nearby parking spaces</p>
        </div>
      )}
    </div>
  );
}
