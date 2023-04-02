import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Popular = lazy(() => import("./pages/Popular"));
const Rekomen = lazy(() => import("./pages/Rekomen"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/popular" element={<Popular />} />
          <Route path="/rekomen" element={<Rekomen />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
