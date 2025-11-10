import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MangaDetail from "./components/Detail";
import ChapterReader from "./components/Chapter";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:mangaId" element={<MangaDetail />} />
        <Route path="/chapter/:chapterId" element={<ChapterReader />} />
        {/* Route untuk chapter reader (bisa ditambahkan nanti) */}
        {/* <Route path="/chapter/:chapterId" element={<ChapterReader />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
