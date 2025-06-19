'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('./RichTextEditor'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-50 animate-pulse rounded-lg" />
});

interface BlogPost {
  id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  image_alt: string;
  category: string;
  read_time: number;
  published_at: string;
  featured: boolean;
  author_name: string;
  author_title: string;
  author_image?: string;
  meta_description?: string;
  keywords?: string[];
  created_at?: string;
  updated_at?: string;
}

interface BlogEditorProps {
  post?: BlogPost;
  isEditing?: boolean;
}

const categories = [
  'Pregnancy',
  'Postpartum',
  'Mental Health',
  'Parenting',
  'Self-Care',
  'Relationships',
  'Wellness'
];

// Images will be loaded dynamically from the API

export default function BlogEditor({ post, isEditing = false }: BlogEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageFilter, setImageFilter] = useState('');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState<BlogPost>({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    image_url: post?.image_url || '',
    image_alt: post?.image_alt || '',
    category: post?.category || 'Mental Health',
    read_time: post?.read_time || 5,
    published_at: post?.published_at || new Date().toISOString(),
    featured: post?.featured || false,
    author_name: post?.author_name || 'Jana Rundle',
    author_title: post?.author_title || 'Licensed Clinical Psychologist',
    author_image: post?.author_image || '/images/Team/Jana Rundle.jpg',
    meta_description: post?.meta_description || '',
    keywords: post?.keywords || []
  });

  // Load available images when image picker is opened
  useEffect(() => {
    if (showImagePicker && availableImages.length === 0) {
      loadImages();
    }
  }, [showImagePicker]);

  const loadImages = async () => {
    setLoadingImages(true);
    try {
      const response = await fetch('/api/images-v2');
      if (response.ok) {
        const data = await response.json();
        setAvailableImages(data.images);
        if (data.error) {
          console.warn('Image loading warning:', data.error);
        }
      } else {
        console.error('Failed to load images');
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'keywords') {
      const parsedKeywords = value.split(',').map(k => k.trim()).filter(k => k);
      console.log('Keywords input:', value, 'Parsed:', parsedKeywords);
      setFormData(prev => ({ 
        ...prev, 
        keywords: parsedKeywords
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload-blog-image', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, image_url: data.url }));
      setShowImagePicker(false);
      
      // Refresh available images to include the new upload
      loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectExistingImage = (imagePath: string) => {
    setFormData(prev => ({ ...prev, image_url: imagePath }));
    setShowImagePicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEditing 
        ? `/api/blog-admin-supabase?slug=${post?.slug}`
        : '/api/blog-admin-supabase';
      
      const method = isEditing ? 'PUT' : 'POST';

      console.log('Blog save request:', { url, method, formData: { ...formData, content: formData.content.substring(0, 100) + '...' } });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      console.log('Blog save response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      const responseData = await response.json().catch(() => null);
      console.log('Blog save response data:', responseData);

      if (!response.ok) {
        const errorMessage = responseData?.error || responseData?.details || `Failed to save post (${response.status})`;
        console.error('Blog save error:', errorMessage, responseData);
        throw new Error(errorMessage);
      }

      console.log('Blog save successful, redirecting...');
      router.push('/admin/blog');
    } catch (err) {
      console.error('Blog save exception:', err);
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/blog')}>
          Cancel
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt *
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image *
          </label>
          <div className="space-y-4">
            {formData.image_url && (
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={formData.image_url}
                  alt={formData.image_alt || 'Blog post image'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowImagePicker(true)}
              >
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Image Picker Modal */}
        {showImagePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Choose an Image</h3>
                  <span className="text-sm text-gray-500">
                    {availableImages.length} images available
                  </span>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="mb-6 space-y-4">
                  <Button
                    type="button"
                    variant="pink"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload New Image'}
                  </Button>
                  
                  {/* Search/Filter */}
                  <input
                    type="text"
                    placeholder="Search images by name..."
                    value={imageFilter}
                    onChange={(e) => setImageFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
                  />
                </div>
                
                {loadingImages ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-bloom-accent"></div>
                    <p className="mt-2 text-gray-600">Loading images...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {availableImages
                      .filter(img => 
                        imageFilter === '' || 
                        img.toLowerCase().includes(imageFilter.toLowerCase())
                      )
                      .map((img) => {
                        const isFailed = failedImages.has(img);
                        return (
                          <button
                            key={img}
                            type="button"
                            onClick={() => !isFailed && handleSelectExistingImage(img)}
                            className={`group relative aspect-video bg-gray-100 rounded-lg overflow-hidden transition-all ${
                              isFailed 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:ring-2 hover:ring-bloom-accent cursor-pointer'
                            }`}
                            title={isFailed ? `Failed to load: ${img}` : img}
                            disabled={isFailed}
                          >
                            {isFailed ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center p-2">
                                  <svg className="w-8 h-8 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p className="text-xs text-gray-500">Image unavailable</p>
                                </div>
                              </div>
                            ) : (
                              <Image
                                src={img}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 25vw"
                                onError={() => {
                                  console.error('Failed to load image:', img);
                                  setFailedImages(prev => new Set(prev).add(img));
                                }}
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
                              />
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                              <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                {img.split('/').pop()}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    }
                  </div>
                )}
                
                {!loadingImages && availableImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No images found
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowImagePicker(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Image Alt Text */}
        <div>
          <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-700 mb-2">
            Image Alt Text *
          </label>
          <input
            type="text"
            id="image_alt"
            name="image_alt"
            value={formData.image_alt}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
          />
        </div>

        {/* Category and Read Time */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-2">
              Read Time (minutes) *
            </label>
            <input
              type="number"
              id="read_time"
              name="read_time"
              value={formData.read_time}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(newContent) => setFormData(prev => ({ ...prev, content: newContent }))}
            placeholder="Start writing your blog post..."
          />
        </div>

        {/* Meta Description */}
        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description (SEO)
          </label>
          <textarea
            id="meta_description"
            name="meta_description"
            value={formData.meta_description}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
          />
        </div>

        {/* Keywords */}
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={formData.keywords?.join(', ') || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
            placeholder="mental health, postpartum, wellness"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="h-4 w-4 text-bloom-accent focus:ring-bloom-accent border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
            Feature this post on the homepage
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/blog')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="pink"
            disabled={saving}
          >
            {saving ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
          </Button>
        </div>
      </div>
    </form>
  );
}