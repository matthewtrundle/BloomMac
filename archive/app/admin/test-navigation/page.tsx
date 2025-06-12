'use client';

export default function TestNavigationPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Navigation Test Page</h1>
      <p>This page tests if the admin navigation is working correctly.</p>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p>If you can see this page and the Course Management link in the sidebar, the navigation is working!</p>
      </div>
    </div>
  );
}