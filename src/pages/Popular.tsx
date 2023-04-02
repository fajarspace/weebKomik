import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { popularKomik } from "../api/weebkomik";

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
    popularKomik().then((res) => {
      setPopular(res);
    });
  }, []);

  const listPopularKomik = useMemo(() => {
    return popular.map((data, i) => {
      return (
        <div key={i}>
          <figure>
            <img src={data.thumb} alt={data.title} />
          </figure>
          <div>
            <Link to={`/detail/${data.endpoint}`}>
              <h2>
                {data.title}
              </h2>
            </Link>
            <p>{data.upload_on}</p>
          </div>
        </div>
      );
    });
  }, [popular]);

  return (
    <main>
      {/* <ErrorGet
        apiUrl="https://localhost:4000/api"
        onError={handlingApiError}
      > */}
      <h2>
        Popular Manga
      </h2>
      {popular.length === 0 ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          {listPopularKomik}
        </div>
      )}
      {/* </ErrorGet> */}
    </main>
  );
};

export default Popular;
