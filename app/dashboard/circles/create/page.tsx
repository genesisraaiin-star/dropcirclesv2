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
    circle_tier: 'origin', // origin | wave | open
    is_hype_drop: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      // Step 1: get auth user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError('You must be logged in. Please sign in again.');
        setLoading(false);
        return;
      }

      // Step 2: get the artist record — circles.artist_id refs artists.id, not auth.users.id
      const { data: artist, error: artistError } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (artistError || !artist) {
        setError('Artist profile not found. Please complete onboarding first.');
        setLoading(false);
        return;
      }

      // Step 3: convert price to cents
      const priceInCents = Math.round(parseFloat(formData.price) * 100);

      // Step 4: set expiry if hype drop
      const expires_at = formData.is_hype_drop
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : null;

      // Step 5: insert circle with correct artist_id
      const { error: dbError } = await supabase
        .from('circles')
        .insert({
          artist_id: artist.id,
          title: formData.title,
          description: formData.description,
          price: priceInCents,
          is_active: false,
          expires_at,
        });

      if (dbError) throw dbError;

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
            ← Back to vault
          </Link>
          <h1 className="text-4xl font-normal tracking-tight mb-2">Drop a circle.</h1>
          <p className="text-gray-500">Define your offering and set your price.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. The Midnight Sessions, Unreleased Vol. 1"
              className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
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
              className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Circle tier</label>
            <div className="grid grid-cols-3 gap-3">
              {(['origin', 'wave', 'open'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setFormData({...formData, circle_tier: tier})}
                  className={`p-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                    formData.circle_tier === tier
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">Origin = top tier · Wave = early access · Open = free</p>
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
                className="w-full p-4 pl-8 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">Hype Drop</div>
              <div className="text-xs text-gray-400 mt-0.5">Expires in 24 hours — creates urgency</div>
            </div>
            <button
              type="button"
              onClick={() => setFormData({...formData, is_hype_drop: !formData.is_hype_drop})}
              className={`w-11 h-6 rounded-full transition-colors relative ${formData.is_hype_drop ? 'bg-black' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.is_hype_drop ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Dropping...' : 'Drop circle'}
          </button>
        </form>
      </div>
    </div>
  );
}
