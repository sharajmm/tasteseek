import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">Taste Seek</h1>
            <p className="text-sm text-gray-600 -mt-1">Leftover remix</p>
          </Link>
          
          <nav className="flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/saved" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Saved Recipes
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}