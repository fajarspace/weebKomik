import React, { useState } from "react";
import { searchManga } from "../api/weebkomik";

function App() {
  const [query, setQuery] = useState("");
  const [mangaList, setMangaList] = useState([]);
  const [message, setMessage] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const mangaList = await searchManga(query);
      if (Array.isArray(mangaList)) {
        setMangaList(mangaList);
        setMessage("Success");
      } else {
        setMessage(mangaList.message);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Search for Manga Titles</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter search query"
          value={query}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>
      {message && <p>{message}</p>}
      {mangaList.length > 0 && (
        <ul>
          {mangaList.map((manga) => (
            <li key={manga.endpoint}>
              <img src={manga.thumb} alt={manga.title} />
              <div>
                <h3>{manga.title}</h3>
                <p>Type: {manga.type}</p>
                <p>Updated On: {manga.updated_on}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
