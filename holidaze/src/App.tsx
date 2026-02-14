import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import MobileBottomNav from "./components/layout/MobileBottomNav"; // if you use it
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pb-16 md:pb-0">
        <AppRoutes />
      </main>

      <Footer />

      <MobileBottomNav />
    </div>
  );
}
