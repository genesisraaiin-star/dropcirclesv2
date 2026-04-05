export default function CirclesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl">
          ✓
        </div>
        <h1 className="text-4xl font-bold tracking-tight">You're official.</h1>
        <p className="text-gray-600 text-lg">
          Your vault is connected to Stripe. You are ready to start dropping circles.
        </p>
      </div>
    </div>
  );
}