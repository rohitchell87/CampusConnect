import Navbar from '../components/Navbar';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <Navbar />
      <main className="mx-auto max-w-7xl py-8">{children}</main>
    </div>
  );
}

export default Layout;
