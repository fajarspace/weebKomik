import React, { useEffect, useState, memo } from "react";
import { RekomenManga } from "../api/weebkomik";
import { Link } from "react-router-dom";

interface PopularData {
  title: string;
  thumb: string;
  endpoint: string;
}

const Recommend: React.FC = () => {
  const [popular, setPopular] = useState<PopularData[]>([]);

  useEffect(() => {
    RekomenManga().then((res) => {
      setPopular(res);
    });
  }, []);

  const ListRekomenManga = memo(() => {
    return (
      <>
        <div className="grid-auto">
          {popular.map((data, i) => {
            const shortenedTitle =
              data.title.length > 30
                ? `${data.title.slice(0, 30)}...`
                : data.title;
            return (
              <>
                <div className="card" key={i}>
                  <Link to={`/detail/${data.endpoint}`}>
                    <figure>
                      <img className="icon-komik" src={data.thumb} alt={data.title} />
                    </figure>
                    <p>
                      {shortenedTitle}
                    </p>
                  </Link>
                </div>
              </>
            );
          })}
        </div>
      </>
    );
  });

  return (
    <main>
      <h2>
        Recommendation Komik
      </h2>
      {popular.length === 0 ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <ListRekomenManga />
        </div>
      )}
    </main>
  );
};

export default Recommend;
