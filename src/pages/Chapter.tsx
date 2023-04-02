import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChapterManga, DetailManga } from "../api/weebkomik";

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
    <main>
      <nav>
        <h1>
          {chapter.chapter_name ? chapter.chapter_name : "Masih Loading..."}
        </h1>
        <ul>
          <li>
            <label
              title="daftar chapter" onClick={() => alert('fitur belum tersedia')}
            ></label>
          </li>
          <li>
            <button
              onClick={() => isChapterOption(`${prevChapterUrl}`)}
            ></button>
          </li>
          <li>
            <button
              title="lanjut"
              onClick={() => isChapterOption(`${nextChapterUrl}`)}
            ></button>
          </li>
        </ul>
      </nav>
      <span></span>
      <ol>
        {chapter.chapter_image
          ? chapter.chapter_image.map((image) => (
            <li key={image.chapter_id}>
              <img
                src={image.chapter_image_link}
                alt={image.chapter_id}
                loading="lazy"
              />
            </li>
          ))
          : "Loading"}
      </ol>
    </main>
  );
};

export default Chapter;
