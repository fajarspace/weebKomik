import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DetailManga } from "../api/weebkomik";

interface Genre {
  genre_id: string;
  genre_name: string;
}

interface Chapter {
  chapter_id: string;
  chapter_title: string;
  chapter_endpoint: string;
}

interface Detail {
  title: string;
  type: string;
  genre_list: Genre[];
  thumb: string;
  status: string;
  author: string;
  synopsis: string;
  chapter: Chapter[];
}

const Detail: React.FC = () => {
  const { endpoint } = useParams<{ endpoint: string }>();
  const [manga, setManga] = useState<Detail>({
    title: "",
    type: "",
    genre_list: [],
    thumb: "",
    status: "",
    author: "",
    synopsis: "",
    chapter: [],
  });

  useEffect(() => {
    DetailManga(`${endpoint}`)
      .then((res) => {
        setManga(res);
      })
      .catch((err) => console.log(err));
  }, [endpoint]);

  const ReadMore = () => {
    return (
      <>
        {/* <label htmlFor="my-modal-4">
          Baca Selengkapnya...
        </label>
        <input type="checkbox" id="my-modal-4" /> */}
        <label htmlFor="my-modal-4" >
          <label className="modal-box relative" htmlFor="">
            <h1 >Sinopsis</h1>
            <p>
              {manga.synopsis}
            </p>
          </label>
        </label>
      </>
    );
  };

  return (
    <main >
      <section className="thumbnail">
        {manga.thumb ? (
          <div
            style={{
              backgroundImage: `url("${manga.thumb}")`,
            }}
          ></div>
        ) : (
          <div></div>
        )}
        <div>
          <img
            src={manga.thumb}
            alt="detail manga"
            loading="lazy"
          />
          <div>
            <h1>
              {manga.title ? manga.title.slice(6, 100) : "Loading"}
            </h1>
            <p >{manga.status}</p>
          </div>
        </div>
      </section>
      <article >
        <article>
          <h2 >Sinopsis</h2>
          <p>
            {manga.synopsis}
          </p>
        </article>
        <div >
          <table >
            <tbody>
              <tr>
                <td >Type</td>
                <td>: {manga.type}</td>
              </tr>
              <tr>
                <td >Author</td>
                <td>: {manga.author}</td>
              </tr>
              <tr>
                <td >Genre</td>
                <td >
                  {":"}
                  {manga.genre_list.map((genre) => (
                    <p key={genre.genre_id}
                    >
                      {genre.genre_name}
                    </p>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <main>
          <h1>
            <span ></span> List Chapter
          </h1>
          <ul >
            {manga.chapter.map((chapt) => (
              <Link key={chapt.chapter_id} to={`/chapter/${chapt.chapter_endpoint}`} >
                <li >
                  {chapt.chapter_title}
                </li>
              </Link>
            ))}
          </ul>
        </main>
      </article>
    </main>
  );
};

export default Detail;
