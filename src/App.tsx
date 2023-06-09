import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));

const Home = lazy(() => import("./pages/Home"));
const Popular = lazy(() => import("./pages/Popular"));
const Rekomen = lazy(() => import("./pages/Rekomen"));
const Detail = lazy(() => import("./pages/Detail"));
const Chapter = lazy(() => import("./pages/Chapter"));

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<progress></progress>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/rekomen" element={<Rekomen />} />
          <Route path="/detail/:endpoint" element={<Detail />} />
          <Route path="/chapter/:endpoint" element={<Chapter />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
