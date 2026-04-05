'use client';

import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CirclesDashboard() {
  const [circles, setCircles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [artistId, setArtistId] = useState<string | null>(null);

  useEffect(() => {
    async function loadVault() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) { setLoading(false); return; }

      // Step 1: get the artist record using auth user id
      const { data: artist } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!artist) { setLoading(false); return; }

      setArtistId(artist.id);

      // Step 2: fetch circles using the artist's actual id
      const { data, error } = await supabase
        .from('circles')
        .select('*')
        .eq('artist_id', artist.id)
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching circles:', error);
      if (data) setCircles(data);
      setLoading(false);
    }
    loadVault();
  }, []);

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    setCircles(circles.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
    const supabase = createClient();
    await supabase.from('circles').update({ is_active: !currentStatus }).eq('id', id);
  };

  const triggerSelfDestruct = async (id: string) => {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);
    const isoString = expirationDate.toISOString();
    setCircles(circles.map(c => c.id === id ? { ...c, expires_at: isoString } : c));
    const supabase = createClient();
    await supabase.from('circles').update({ expires_at: isoString }).eq('id', id);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-sans">
      <p className="text-gray-400 text-sm font-medium tracking-widest uppercase animate-pulse">Unlocking vault...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black p-8 md:p-16 font-sans">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-normal tracking-tight mb-2">Your Vault</h1>
            <p className="text-gray-500">Manage your active circles and drops.</p>
          </div>
          <Link
            href="/dashboard/circles/create"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2 text-sm"
          >
            <span>+</span> Drop a Circle
          </Link>
        </div>

        {circles && circles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circles.map((circle) => {
              const hasExpired = circle.expires_at && new Date(circle.expires_at) < new Date();
              const isLocked = !circle.is_active || hasExpired;

              return (
                <div
                  key={circle.id}
                  className={`bg-white border ${isLocked ? 'border-red-100 opacity-75' : 'border-gray-200'} rounded-xl p-6 hover:shadow-sm transition-all flex flex-col h-full relative overflow-hidden`}
                >
                  <div className="flex-grow z-10">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h2 className="text-xl font-medium tracking-tight line-clamp-2">{circle.title}</h2>
                      <span className="bg-gray-100 text-gray-900 text-xs font-mono px-2 py-1 rounded">
                        ${(circle.price / 100).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6">{circle.description}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex flex-col gap-4 mt-auto z-10">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs uppercase tracking-widest font-medium ${isLocked ? 'text-red-500' : 'text-[#00c2d4]'}`}>
                        {hasExpired ? 'Expired' : (!circle.is_active ? 'Locked' : 'Active')}
                      </span>
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/dashboard/circles/${circle.id}`}
                          className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors font-bold underline"
                        >
                          EDIT ↗
                        </Link>
                        {!circle.expires_at && circle.is_active && (
                          <button
                            onClick={() => triggerSelfDestruct(circle.id)}
                            className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded uppercase tracking-widest hover:bg-red-100 transition-colors"
                          >
                            Set 24h Drop
                          </button>
                        )}
                        {circle.expires_at && !hasExpired && (
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest">Ends soon</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                      <span className="text-xs text-gray-500 font-medium">Public Access</span>
                      <button
                        onClick={() => toggleActiveStatus(circle.id, circle.is_active)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${circle.is_active ? 'bg-black' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${circle.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-gray-300 rounded-xl bg-white">
            <h3 className="text-lg font-medium mb-2">Your vault is empty</h3>
            <p className="text-gray-500 mb-6 text-sm">You haven't dropped any circles yet.</p>
            <Link
              href="/dashboard/circles/create"
              className="text-black underline text-sm hover:text-gray-600 transition-colors"
            >
              Create your first drop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
