'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function CreateCirclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Initialize your proven browser client
      const supabase = createClient();
      
      // 2. Get the logged-in user (This works here because we are in the browser!)
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setError('You must be logged in to drop a circle. Please sign in again.');
        setLoading(false);
        return;
      }

      // 3. Convert price to cents
      const priceInCents = Math.round(parseFloat(formData.price) * 100);

      // 4. Insert the Circle
      const { error: dbError } = await supabase
        .from('circles')
        .insert({
          artist_id: user.id,
          title: formData.title,
          description: formData.description,
          price: priceInCents,
        });

      if (dbError) throw dbError;

      // 5. Success! Teleport back to dashboard
      router.push('/dashboard/circles');

    } catch (err: any) {
      console.error('Failed to create circle:', err);
      setError(err.message || 'Could not create circle. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black p-8 md:p-16 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <Link 
            href="/dashboard/circles"
            className="text-sm text-gray-500 hover:text-black transition-colors mb-8 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-normal tracking-tight mb-2">Drop a new Circle</h1>
          <p className="text-gray-500">Define your offering and set your price.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Circle Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., The Midnight EP, Exclusive Behind-the-Scenes"
              className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="What do fans get when they unlock this circle?"
              className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Price (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
                className="w-full p-4 pl-8 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Circle'}
          </button>
        </form>
      </div>
    </div>
  );
}