// app/page.tsx
import Link from 'next/link';
import { Event } from '../types';

async function getEvents(): Promise<Event[]> {
  // Replace with your actual backend API URL
  const res = await fetch('http://localhost:3000/api/events', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function EventListPage() {
  const events = await getEvents();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Upcoming Events</h1>
        <p className="text-gray-500 mt-2">Find your favorite art markets and conventions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">{event.name}</h2>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>📍 {event.location}</p>
                <p>📅 {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
              </div>
            </div>
            <Link 
              href={`/events/${event.id}`} 
              className="mt-4 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              View Vendors & Timelines
            </Link>
          </div>
        ))}
        {events.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No events found.
          </div>
        )}
      </div>
    </div>
  );
}