import { Footer } from './footer';
import { Header } from './header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};