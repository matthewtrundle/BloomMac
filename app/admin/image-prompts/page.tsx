'use client';

import { useState } from 'react';
import { blogPosts } from '@/lib/data/blog-posts';
import { generateMidjourneyPrompt, formatPromptsForDiscord } from '@/lib/midjourney-prompts';

export default function ImagePromptsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const prompts = blogPosts.map(post => generateMidjourneyPrompt(post));
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const copyAllPrompts = () => {
    const allPrompts = formatPromptsForDiscord(prompts);
    navigator.clipboard.writeText(allPrompts);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Midjourney Image Prompts</h1>
          <p className="text-gray-600">
            Generate beautiful, on-brand images for blog posts using these Midjourney prompts.
          </p>
        </div>
        
        <div className="mb-6">
          <button
            onClick={copyAllPrompts}
            className="bg-bloompink hover:bg-[#B03979] text-white font-medium px-6 py-2 rounded-md transition-colors"
          >
            {copiedId === 'all' ? 'Copied!' : 'Copy All Prompts'}
          </button>
        </div>
        
        <div className="space-y-6">
          {prompts.map((prompt) => (
            <div key={prompt.blogId} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{prompt.title}</h3>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-sm font-mono text-gray-700 break-all">
                  /imagine {prompt.prompt}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(`/imagine ${prompt.prompt}`, prompt.blogId)}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
              >
                {copiedId === prompt.blogId ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use These Prompts</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Copy the prompt for the blog post you need an image for</li>
            <li>Go to your Midjourney Discord server</li>
            <li>Paste the prompt and hit enter</li>
            <li>Wait for the 4 image variations to generate</li>
            <li>Use U1-U4 to upscale your preferred image</li>
            <li>Download the image and optimize it for web (compress, resize to 1200x675px)</li>
            <li>Add the image to <code className="bg-gray-200 px-1 rounded">/public/images/blog/</code></li>
            <li>Update the blog post in <code className="bg-gray-200 px-1 rounded">blog-posts.ts</code> with the new image path</li>
          </ol>
        </div>
      </div>
    </div>
  );
}