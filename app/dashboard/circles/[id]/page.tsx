'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function EditCirclePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [circle, setCircle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load the specific Circle from the database
  useEffect(() => {
    async function fetchCircle() {
      const { data, error } = await supabase
        .from('circles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error("Error fetching:", error);
        router.push('/dashboard/circles');
        return;
      }
      setCircle(data);
      setLoading(false);
    }
    fetchCircle();
  }, [params.id, router, supabase]);

  // THE UPLOAD LOGIC
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // 1. Create a secure, random file name so files never overwrite each other
    const fileExt = file.name.split('.').pop();
    const fileName = `${params.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // 2. Push the actual file to your Supabase Bucket
    const { error: uploadError } = await supabase.storage
      .from('circle-assets')
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("Failed to upload file to the vault.");
      setUploading(false);
      return;
    }

    // 3. Get the secure URL for playback
    const { data: { publicUrl } } = supabase.storage
      .from('circle-assets')
      .getPublicUrl(fileName);

    // 4. Attach this URL to the Circle in your database
    const updatedAssets = [...(circle.assets || []), publicUrl];
    const { error: updateError } = await supabase
      .from('circles')
      .update({ assets: updatedAssets })
      .eq('id', params.id);

    if (updateError) {
      console.error("Failed to link file to circle:", updateError);
    } else {
      setCircle({ ...circle, assets: updatedAssets });
    }
    
    setUploading(false);
  };

  // THE METADATA SAVER
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const { error } = await supabase
      .from('circles')
      .update({
        title: formData.get('title'),
        description: formData.get('description')
      })
      .eq('id', params.id);

    setSaving(false);
    if (!error) alert("Drop details updated.");
  };

  // THE NUKE BUTTON
  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This cannot be undone and the drop will be destroyed forever.")) return;
    
    const { error } = await supabase.from('circles').delete().eq('id', params.id);
    if (!error) router.push('/dashboard/circles');
  };

  if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center animate-pulse text-sm text-gray-400 font-mono tracking-widest uppercase">Unlocking...</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black p-8 md:p-16 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation */}
        <div className="mb-12 flex justify-between items-center">
          <Link href="/dashboard/circles" className="text-sm text-gray-500 hover:text-black transition-colors">
            ← Back to Vault
          </Link>
          <span className={`text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded ${circle.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {circle.is_active ? 'Active' : 'Locked'}
          </span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-normal tracking-tight mb-2">Configure Drop</h1>
          <p className="text-gray-500 text-sm">Upload your ephemeral audio track. Fans will only be able to stream this live.</p>
        </div>

        {/* The Ephemeral Uploader */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 text-center border-dashed relative overflow-hidden">
          {circle.assets && circle.assets.length > 0 ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">✓</div>
              <h3 className="text-sm font-medium mb-1">Track Uploaded</h3>
              <p className="text-xs text-gray-500 mb-4">Ready for live streaming.</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              </div>
              <h3 className="text-sm font-medium mb-1">Upload Master Audio</h3>
              <p className="text-xs text-gray-500 mb-6">WAV or high-quality MP3.</p>
              
              <div className="relative inline-block">
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <button disabled={uploading} className="text-xs bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {uploading ? 'Encrypting & Uploading...' : 'Select Audio File'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Metadata Editor */}
        <form onSubmit={handleSaveDetails} className="space-y-6 mb-12">
          <div>
            <label className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mb-2 block">Drop Title</label>
            <input 
              name="title"
              type="text" 
              defaultValue={circle.title}
              required
              className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mb-2 block">Lore / Description</label>
            <textarea 
              name="description"
              rows={4}
              defaultValue={circle.description}
              required
              className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>
          <button type="submit" disabled={saving} className="w-full bg-black text-white p-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Update Details'}
          </button>
        </form>

        {/* Danger Zone */}
        <div className="border-t border-red-100 pt-8 mt-16">
          <h4 className="text-red-600 font-medium text-sm mb-2">Destroy Drop</h4>
          <p className="text-gray-500 text-xs mb-4">This will permanently delete the audio file and all associated metadata. Fans will immediately lose access.</p>
          <button onClick={handleDelete} className="text-xs border border-red-200 text-red-600 px-4 py-2 rounded hover:bg-red-50 transition-colors">
            Destroy Forever
          </button>
        </div>

      </div>
    </div>
  );
}