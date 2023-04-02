import React from "react";
import { Link } from "react-router-dom";
// import { Setting } from "../config/Setting";
import { searchManga } from "../api/weebkomik";
interface SearchData {
  thumb: string;
  title: string;
  type: string;
  endpoint: string;
  updated_on: string;
}

const Search: React.FC = () => {

  const [result, setResult] = React.useState<SearchData[]>([])

  const Search = async (q: string) => {
    if (q.length > 3) {
      const query = await searchManga(q);
      setResult(query);
    } else if (q.length < 2) {
      setResult([])
    }
  }

  React.useEffect(() => {
    searchManga
  }, [])

  return (
    <>
      <div className="list">
        <div >
          <input type="search" id="search" name="search"
            placeholder="type here..."
            onChange={(e) => Search(e.target.value)}
          />
        </div>
        {result ? (
          result.map((data, i) => {
            const shortenedTitle =
              data.title.length > 30
                ? `${data.title.slice(0, 30)}...`
                : data.title;
            return (
              <>
                <div className="grid-auto">
                  <div className="card" key={i}>
                    <Link to={`/detail/${data.endpoint}`}>
                      <img src={data.thumb} alt="result photo" loading="lazy" />
                      <p style={{ position: "relative" }}>{shortenedTitle}</p>
                      {/* <p>{data.type}</p>
                    <p>{data.updated_on}</p> */}
                    </Link>
                  </div>
                </div>

              </>
            );
          })
        ) : (
          <p>as</p>
        )}
      </div>
    </>
  );
};

export default Search;
