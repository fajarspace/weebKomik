import React, { useState } from "react";
// import { Link } from "react-router-dom";
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
    <>
      <form className="grid" onSubmit={handleSubmit}>
        <input
          type="search" id="search" name="search"
          placeholder="Enter search query"
          value={query}
          onChange={handleInputChange}
        />
        <button style={{ width: "100px" }} type="submit">Search</button>
      </form>
      {message && <p>{message}</p>}
      {mangaList.length > 0 && (
        <ul>
          <div className="grid-auto">
            {mangaList.map((manga) => (
              <li key={manga.endpoint}>
                <div>
                  <a href={`/detail/${manga.endpoint}`}>
                    <img src={manga.thumb} alt={manga.title} />
                    <p>{manga.title}</p>
                    <small>Type: {manga.type}</small> <br />
                    <small>Updated On: {manga.updated_on}</small>
                  </a>
                </div>
              </li>
            ))}
          </div>
        </ul>
      )}
    </>
  );
}

export default App;
