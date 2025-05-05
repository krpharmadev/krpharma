import { ReactNode } from 'react';

interface LineLayoutProps {
  children: ReactNode;
}

export default function LineLayout({ children }: LineLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#06c755] text-white shadow">
        <div className="container mx-auto px-4 py-4 text-center">
          <h1 className="font-bold text-xl">KR Pharma</h1>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} KR Pharma</p>
        </div>
      </footer>
    </div>
  );
} 