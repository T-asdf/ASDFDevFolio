import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-[100vh]">
      {/* <Header /> */}

      <main>
        {children}
      </main>

      {/* <Footer /> */}
    </div>
  );
}