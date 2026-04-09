export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
      <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
      <p className="text-zinc-400">Could not find requested resource</p>
      <a href="/" className="mt-6 px-6 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition-colors">
        Return Home
      </a>
    </div>
  );
}
