import { Footer } from './footer';
import { Header } from './header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};