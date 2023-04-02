import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchManga } from "../api/weebkomik";

interface SearchData {
  thumb: string;
  title: string;
  type: string;
  endpoint: string;
  updated_on: string;
}

const Navbar: React.FC = () => {

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
      <main style={{ paddingTop: "1em" }}>
        <div >
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Langsung ketik..."
            onChange={(e) => Search(e.target.value)}
          />
          {/* <button
            title="search"
            className="uil uil-search btn ml-2"
          ></button> */}
        </div>
        <div className="grid-auto">
          {result ? (
            result.map((data, i) => {
              const shortenedTitle =
                data.title.length > 30
                  ? `${data.title.slice(0, 30)}...`
                  : data.title;
              return (
                <>
                  <main className="" key={i}>

                    <div className="search">
                      <Link to={`/detail/${data.endpoint}`}>
                        <figure>
                          <img className="" src={data.thumb} alt="result photo" loading="lazy" />
                        </figure>
                        <p>{shortenedTitle} <br />
                          <mark>{data.type}</mark>
                          <kbd>{data.updated_on}</kbd>
                        </p>

                      </Link> <br />
                    </div>
                  </main>
                </>
              );
            })
          ) : (
            <><progress></progress></>
          )}
        </div>
      </main>
    </>
  );
}

export default Navbar;
