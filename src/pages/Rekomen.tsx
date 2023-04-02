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
                <div className="" key={i}>
                  <Link to={`/detail/${data.endpoint}`}>
                    <figure>
                      <img src={data.thumb} alt={data.title} />
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
      <hgroup>
        <h1>Rekomen untuk dibaca</h1>
        <h2>
          Recommendation Komik
        </h2>
      </hgroup>
      {popular.length === 0 ? (
        <progress></progress>
      ) : (
        <div>
          <ListRekomenManga />
        </div>
      )}
    </main>
  );
};

export default Recommend;
