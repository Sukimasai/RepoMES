'use client';
import { useState } from 'react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    eventId: '',
    vendorName: '',
    boothNumber: '',
    poAvailable: false,
    poLink: '',
    poStartDate: '',
    poEndDate: '',
    fandoms: '',
    merchList: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // Process comma-separated strings into arrays for the backend
    const payload = {
      ...formData,
      fandoms: formData.fandoms.split(',').map(s => s.trim()).filter(Boolean),
      merchList: formData.merchList.split(',').map(s => s.trim()).filter(Boolean),
      poStartDate: formData.poStartDate ? new Date(formData.poStartDate).toISOString() : null,
      poEndDate: formData.poEndDate ? new Date(formData.poEndDate).toISOString() : null,
    };

    try {
      const res = await fetch('http://localhost:3000/api/admin/vendor-event', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE' 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage('✅ Vendor successfully added to event!');
        // Reset form or handle success
      } else {
        const err = await res.json();
        setMessage(`❌ Error: ${err.message || 'Failed to add vendor'}`);
      }
    } catch (error) {
      setMessage('❌ Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Register a vendor to an event and set up their booth and PO timeline.</p>

      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.startsWith('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl shadow-sm p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Event ID (UUID)</label>
            <input required type="text" className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.eventId} onChange={e => setFormData({...formData, eventId: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Vendor Name</label>
            <input required type="text" className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.vendorName} onChange={e => setFormData({...formData, vendorName: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Booth Number <span className="text-gray-400 font-normal">(Leave empty for TBA)</span></label>
          <input type="text" className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
            value={formData.boothNumber} onChange={e => setFormData({...formData, boothNumber: e.target.value})} />
        </div>

        <hr className="my-6" />

        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
              checked={formData.poAvailable} onChange={e => setFormData({...formData, poAvailable: e.target.checked})} />
            <span className="text-base font-semibold text-gray-900">Enable Pre-Order (PO) Tracking</span>
          </label>
        </div>

        {formData.poAvailable && (
          <div className="bg-gray-50 border rounded-lg p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">PO Link (URL)</label>
              <input type="url" required={formData.poAvailable} placeholder="https://..." className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.poLink} onChange={e => setFormData({...formData, poLink: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">PO Start Date</label>
                <input type="date" required={formData.poAvailable} className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.poStartDate} onChange={e => setFormData({...formData, poStartDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">PO End Date</label>
                <input type="date" required={formData.poAvailable} className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.poEndDate} onChange={e => setFormData({...formData, poEndDate: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        <hr className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fandoms <span className="text-gray-400 font-normal">(Comma separated)</span></label>
            <input placeholder="e.g. Genshin Impact, Hololive" type="text" className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.fandoms} onChange={e => setFormData({...formData, fandoms: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Merchandise <span className="text-gray-400 font-normal">(Comma separated)</span></label>
            <input placeholder="e.g. Acrylic Stand, Keychain" type="text" className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.merchList} onChange={e => setFormData({...formData, merchList: e.target.value})} />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Saving Vendor...' : 'Save Vendor to Event'}
          </button>
        </div>
      </form>
    </div>
  );
}