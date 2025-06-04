import { useState } from 'react';

interface ResourceDownloadFormProps {
  resourceName: string;
  resourcePath: string;
}

export default function ResourceDownloadForm({ resourceName, resourcePath }: ResourceDownloadFormProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Trigger the email sequence
      const response = await fetch('/api/trigger-resource-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          resourceName,
          downloadLink: resourcePath,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Redirect to download or show download link
        window.location.href = resourcePath;
      } else {
        console.error('Failed to trigger email sequence');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Success! Your download is starting... 🎉
        </h3>
        <p className="text-green-700">
          Check your email for helpful tips on using your resource!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C06B93] focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C06B93] focus:border-transparent"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#C06B93] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#B05882] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processing...' : `Download ${resourceName} 📥`}
      </button>
      
      <p className="text-xs text-gray-600 text-center">
        We'll email you the resource and helpful tips. No spam, promise! 💕
      </p>
    </form>
  );
}