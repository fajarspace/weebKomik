import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DetailManga } from "../api/weebkomik";

import image from "../assets/img/loading.png";

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
            <hgroup>
              <h1 >Sinopsis</h1>
              <h2>
                {manga.synopsis}
              </h2>
            </hgroup>
          </label>
        </label>
      </>
    );
  };

  return (
    <main className="container">
      <div>
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
            className="cover"
            src={manga.thumb ? manga.thumb : image}
            alt="detail manga"
          />

          <hgroup className="center">
            <h1>
              {manga.title ? manga.title.slice(6, 100) : <progress></progress>}
            </h1>
            <p >{manga.status}</p>
          </hgroup>
        </div>
      </div>
      <article >
        <article>
          <h2 >Sinopsis</h2>
          <p>
            {manga.synopsis}
          </p>
        </article>
        <div className="grid">

          <table className="card" role={'grid'}>
            {/* <hgroup>
              <h1>Info</h1>
            </hgroup> */}
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
                  {manga.genre_list.map((genre) => (
                    <>
                      <kbd key={genre.genre_id}
                      >
                        {genre.genre_name}
                      </kbd> &nbsp;
                    </>
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
          <main className="card">
            {/* <hgroup>
              <h1>
                List Chapter
              </h1>
            </hgroup> */}
            <ul className="list-chapter" >
              {manga.chapter.map((chapt) => (
                <a style={{ textDecoration: "none" }} key={chapt.chapter_id} href={`/chapter/${chapt.chapter_endpoint}`} >
                  <li >
                    <button className="primary">
                      {chapt.chapter_title}
                    </button>
                  </li>
                </a>
              ))}
            </ul>
          </main>
        </div>

      </article>
    </main>
  );
};

export default Detail;
