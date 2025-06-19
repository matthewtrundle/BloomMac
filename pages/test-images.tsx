import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TestImages() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    setError('');
    try {
      // Test both endpoints
      const [res1, res2] = await Promise.all([
        fetch('/api/images'),
        fetch('/api/images-v2')
      ]);
      
      const data1 = await res1.json();
      const data2 = await res2.json();
      
      console.log('Original endpoint:', data1);
      console.log('New endpoint:', data2);
      
      setImages(data2.images || data1.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  const testImages = [
    '/images/Team/jana10.png',
    '/images/jana10.png',
    '/images/Blog/biff01_imagine_new_mother_holding_baby_peaceful_nursery_soft__1142a756-4014-4606-aced-81dd4005e812_0.png',
    '/images/biff01_mother_and_toddler_resting_together_after_tantrum_soft_1fded242-6d18-48b4-bcb8-cd05b63ccc61_1.png'
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Loading Test</h1>
      
      {error && (
        <div className="bg-red-100 p-4 rounded mb-4 text-red-700">
          Error: {error}
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Direct Test Images</h2>
        <div className="grid grid-cols-4 gap-4">
          {testImages.map((img, index) => (
            <div key={index} className="border p-2">
              <p className="text-xs mb-1 truncate">{img}</p>
              <div className="relative h-32 bg-gray-100">
                <Image
                  src={img}
                  alt={`Test ${index}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error(`Failed to load: ${img}`);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">
          API Images ({images.length} total)
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="max-h-96 overflow-auto border p-4">
            <pre className="text-xs">{JSON.stringify(images, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}