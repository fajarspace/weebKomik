import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { popularManga } from "../api/weebkomik";

interface PopularData {
  title: string;
  upload_on: string;
  thumb: string;
  endpoint: string;
}

const Popular: React.FC = () => {
  const handlingApiError = (error: any) => {
    console.log("Error:", error);
  };

  const [popular, setPopular] = useState<PopularData[]>([]);

  useEffect(() => {
    popularManga().then((res) => {
      setPopular(res);
    });
  }, []);

  const listPopularManga = useMemo(() => {
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
                      <br />
                      <kbd>{data.upload_on}</kbd>
                    </p>
                  </Link>
                </div>
              </>
            );
          })}
        </div>
      </>
    );
  }, [popular]);

  return (
    <main>
      {/* <ErrorGet
        apiUrl="https://localhost:4000/api"
        onError={handlingApiError}
      > */}
      <hgroup>
        <h1>Popular Manga</h1>
        <h2>
          Populer
        </h2>
      </hgroup>
      {popular.length === 0 ? (
        <progress></progress>
      ) : (
        <div>
          {listPopularManga}
        </div>
      )}
      {/* </ErrorGet> */}
    </main>
  );
};

export default Popular;
