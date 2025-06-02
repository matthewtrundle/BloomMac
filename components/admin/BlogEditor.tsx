'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Image from 'next/image';

interface BlogPost {
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  imageAlt: string;
  category: string;
  readTime: number;
  publishedAt: string;
  featured: boolean;
  author: {
    name: string;
    title: string;
    image?: string;
  };
  metaDescription?: string;
  keywords?: string[];
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

const existingImages = [
  '/images/Home/Confident Women.png',
  '/images/Home/new-mom.png',
  '/images/Services/New Mothers.png',
  '/images/Services/Hopeful Hands.png',
  '/images/Services/Walking through fields.png',
  '/images/Services/Empty Armchair.png',
  '/images/Services/Experienced Parents.png',
  '/images/Services/AnxietyManagement1.png',
  '/images/Services/AnxietyManagement2.png',
  '/images/Hero/Hero.png',
  '/images/Hero/Hero2.png',
  '/images/Hero/Hero3.png',
  '/images/Hero/Hero4.png',
  '/images/Hero/Hero7.png',
  '/images/Hero/Hero11.png'
];

export default function BlogEditor({ post, isEditing = false }: BlogEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  const [formData, setFormData] = useState<BlogPost>({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    image: post?.image || '',
    imageAlt: post?.imageAlt || '',
    category: post?.category || 'Mental Health',
    readTime: post?.readTime || 5,
    publishedAt: post?.publishedAt || new Date().toISOString(),
    featured: post?.featured || false,
    author: post?.author || {
      name: 'Jana Rundle',
      title: 'Licensed Clinical Psychologist',
      image: '/images/Team/Jana Rundle.jpg'
    },
    metaDescription: post?.metaDescription || '',
    keywords: post?.keywords || []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'keywords') {
      setFormData(prev => ({ 
        ...prev, 
        keywords: value.split(',').map(k => k.trim()).filter(k => k) 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, image: data.url }));
      setShowImagePicker(false);
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectExistingImage = (imagePath: string) => {
    setFormData(prev => ({ ...prev, image: imagePath }));
    setShowImagePicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEditing 
        ? `/api/blog-admin?slug=${post?.slug}`
        : '/api/blog-admin';
      
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
            {formData.image && (
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={formData.image}
                  alt={formData.imageAlt || 'Blog post image'}
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
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Choose an Image</h3>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="mb-4">
                  <Button
                    type="button"
                    variant="pink"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload New Image'}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {existingImages.map((img) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => handleSelectExistingImage(img)}
                      className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-bloom-accent"
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
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
            id="imageAlt"
            name="imageAlt"
            value={formData.imageAlt}
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
              id="readTime"
              name="readTime"
              value={formData.readTime}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={20}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-bloom-accent focus:border-transparent font-mono text-sm"
            placeholder="Write your blog post content here. You can use Markdown for formatting."
          />
        </div>

        {/* Meta Description */}
        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description (SEO)
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={formData.metaDescription}
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