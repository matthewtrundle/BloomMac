export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bloom-sage-50 via-white to-bloom-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bloom-sage mx-auto"></div>
        <p className="mt-4 text-bloom-dark/60">Loading your wellness hub...</p>
      </div>
    </div>
  );
}