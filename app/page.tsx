import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">
      <p className="text-xl font-semibold text-gray-800">
        Click to see each page
      </p>

      <div className="flex flex-col gap-4">
        <Link
          href="/user"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition"
        >
          User Page
        </Link>

        <Link
          href="/admin"
          className="px-6 py-3 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition"
        >
          Admin Page
        </Link>

        <Link
          href="/auth"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700 transition"
        >
          Auth Page
        </Link>
      </div>
    </main>
  );
}
