import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChapterManga, DetailManga } from "../api/weebkomik";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

interface ChapterImage {
  chapter_id: string;
  chapter_image_link: string;
}

interface Chapter {
  chapter_id: string;
  chapter_title: string;
  chapter_endpoint: string;
}

interface Image {
  chapter_endpoint: string;
  chapter_name: string;
  chapter_image: ChapterImage[];
  chapter: Chapter[];
}

const Chapter: React.FC = () => {
  const [isFixed, setIsFixed] = useState(false)
  const [isList, setList] = useState(false)
  const { endpoint = "" } = useParams<{ endpoint: string }>();
  const [chapter, setChapter] = useState<Image>({
    chapter_endpoint: "",
    chapter_name: "",
    chapter_image: [],
    chapter: []
  });

  useEffect(() => {
    ChapterManga(endpoint)
      .then((res) => {
        setChapter(res);
      })
      .catch((err) => console.log(err));

    const handleScroll = () => {
      setIsFixed(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }

  }, [endpoint]);

  const chapterNumMatch = endpoint.match(/chapter-(\d+)/);
  const chapterNum = chapterNumMatch ? chapterNumMatch[1] : "";
  const nextChapterNum = parseInt(chapterNum) + 1;
  const prevChapterNum = parseInt(chapterNum) - 1;
  const nextEndpoint = chapterNum
    ? endpoint.replace(/chapter-\d+/, `chapter-${nextChapterNum}`)
    : "";
  const prevEndpoint = chapterNum
    ? endpoint.replace(/chapter-\d+/, `chapter-${prevChapterNum}`)
    : "";
  const nextChapterUrl = `/chapter/${nextEndpoint}/`;
  const prevChapterUrl = `/chapter/${prevEndpoint}/`;

  const isChapterOption = (chapt_endpoint: string) => {
    window.scrollTo(0, 0);
    navigate(`${chapt_endpoint}`)
  }

  const navigate = useNavigate()
  return (
    <main className="chapter">
      <nav className="chapter__nav">
        <h3>
          {chapter.chapter_name ? chapter.chapter_name : <progress value="70" max="100">
            Loading... 70%
          </progress>

          }
        </h3>

      </nav>
      <ul className="chapter__menu">
        <li className="chapter__menu-item">
          <button
            onClick={() => isChapterOption(`${prevChapterUrl}`)}
            className="chapter__menu-link"
            disabled={!prevChapterUrl}
          ><AiOutlineArrowLeft /></button>
        </li>
        <li className="chapter__menu-item">
          <button
            title="lanjut"
            onClick={() => isChapterOption(`${nextChapterUrl}`)}
            className="chapter__menu-link"
            disabled={!nextChapterUrl} // tambahkan disabled saat nextChapterUrl tidak ada
          ><AiOutlineArrowRight /></button>
        </li>

      </ul>
      <span className="chapter__divider"></span>
      <ol className="chapter__images">
        {chapter.chapter_image
          ? chapter.chapter_image.map((image) => (
            <li key={image.chapter_id} className="chapter__image-item">
              <img
                src={image.chapter_image_link}
                alt={image.chapter_id}
                loading="lazy"
                className="chapter__image"
              />
            </li>
          ))
          : "Loading"}
      </ol>
      <nav className="chapter__nav">
        <h3>
          {chapter.chapter_name ? chapter.chapter_name : <progress value="70" max="100">
            Loading... 70%
          </progress>

          }
        </h3>

      </nav>
      <ul className="chapter__menu">
        <li className="chapter__menu-item">
          <button
            onClick={() => isChapterOption(`${prevChapterUrl}`)}
            className="chapter__menu-link"
            disabled={!prevChapterUrl} // tambahkan disabled saat prevChapterUrl tidak ada
          ><AiOutlineArrowLeft /></button>
        </li>
        <li className="chapter__menu-item">
          <button
            title="lanjut"
            onClick={() => isChapterOption(`${nextChapterUrl}`)}
            className="chapter__menu-link"
            disabled={!nextChapterUrl} // tambahkan disabled saat nextChapterUrl tidak ada
          ><AiOutlineArrowRight /></button>
        </li>

      </ul>
    </main>

  );
};

export default Chapter;
