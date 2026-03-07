import Header from "@/components/Header";
import Home from "@/pages/Home";
import Footer from "@/components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
