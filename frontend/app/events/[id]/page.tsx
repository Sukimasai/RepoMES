// app/events/[id]/page.tsx
import { EventDetailResponse } from '../../../types';

async function getEventDetails(id: string): Promise<EventDetailResponse | null> {
  const res = await fetch(`http://localhost:3000/api/events/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function EventDetail({ params }: { params: { id: string } }) {
  const data = await getEventDetails(params.id);
  
  if (!data) {
    return <div className="p-8 text-center text-red-500">Event not found or failed to load.</div>;
  }

  const { event, vendors } = data;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Event Header */}
      <div className="bg-white border rounded-xl p-8 mb-8 shadow-sm">
        <h1 className="text-3xl font-extrabold mb-2">{event.name}</h1>
        <p className="text-gray-600">📍 {event.location}</p>
        <p className="text-gray-600 font-medium mt-1">
          Event Timeline: {new Date(event.startDate).toLocaleDateString()} to {new Date(event.endDate).toLocaleDateString()}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-6">Participating Vendors ({vendors.length})</h2>
      
      <div className="space-y-6">
        {vendors.map((ve) => {
          const vendor = ve.vendor;
          const activePO = vendor.preOrders?.[0]; // Taking the first PO for simplicity

          return (
            <div key={ve.id} className="bg-white border rounded-xl p-6 shadow-sm">
              {/* Vendor Header & Booth */}
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold">{vendor.name}</h3>
                </div>
                <div className="bg-gray-100 border text-gray-800 px-3 py-1 rounded-md font-mono text-sm font-semibold">
                  Booth: {ve.boothNumber || 'TBA'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Merch & Fandoms */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Supported Fandoms</h4>
                    <div className="flex flex-wrap gap-2">
                      {vendor.merchandises?.flatMap(m => m.fandoms).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).map(f => (
                        <span key={f.id} className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                          {f.name}
                        </span>
                      )) || <span className="text-sm text-gray-500">No fandoms listed</span>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Merchandise List</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {vendor.merchandises?.map(m => (
                        <li key={m.id}>
                          {m.name} <span className="text-gray-400 text-xs">({m.salesStatus.replace('_', ' ')})</span>
                        </li>
                      )) || <li>No merchandise listed</li>}
                    </ul>
                  </div>
                </div>

                {/* Right Column: Pre-Order Tracker */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    📦 Pre-Order Tracker
                  </h4>
                  
                  {!ve.poAvailable ? (
                    <p className="text-sm text-gray-600">No active Pre-Orders for this event.</p>
                  ) : (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-blue-200 pb-2">
                        <span className="text-blue-800">Status</span>
                        <span className={`font-bold ${activePO?.status === 'ACTIVE' ? 'text-green-600' : 'text-amber-600'}`}>
                          {activePO?.status || 'UNKNOWN'}
                        </span>
                      </div>
                      
                      {activePO && (
                        <div className="flex justify-between border-b border-blue-200 pb-2">
                          <span className="text-blue-800">Duration</span>
                          <span className="font-medium text-gray-800">
                            {new Date(activePO.startDate).toLocaleDateString()} - {new Date(activePO.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {ve.poLink && (
                        <div className="pt-2">
                          <a 
                            href={ve.poLink} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                          >
                            Open PO Form
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {vendors.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white border rounded-xl">
            No vendors registered for this event yet.
          </div>
        )}
      </div>
    </div>
  );
}