import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">🅿️ Welcome to Parkiva</h1>
            <p className="py-6 text-lg">
              Your smart parking solution for Istanbul. Find, manage, and sync parking data with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/parking" className="btn btn-primary">
                Find Parking
              </Link>
              <Link href="/sync" className="btn btn-outline">
                Sync Data
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">Smart Parking Search</h3>
                <p>Search for available parking spaces by district and get real-time information.</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-secondary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">Data Synchronization</h3>
                <p>Keep your parking data up-to-date with automatic syncing from ISpark and other sources.</p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure className="px-10 pt-10">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </figure>
              <div className="card-body items-center text-center">
                <h3 className="card-title">Real-time Analytics</h3>
                <p>Get insights and analytics about parking availability and usage patterns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="stats shadow w-full">
            <div className="stat place-items-center">
              <div className="stat-title">Parking Spaces</div>
              <div className="stat-value">1,247</div>
              <div className="stat-desc">Across Istanbul</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">Districts Covered</div>
              <div className="stat-value text-secondary">39</div>
              <div className="stat-desc">All major areas</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">Active Users</div>
              <div className="stat-value">2,500+</div>
              <div className="stat-desc">Growing daily</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
