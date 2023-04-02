import axios from "axios";

const apiKey = "http://localhost:4000/api";

export const searchManga = async (q: string) => {
  try {
    const search = await axios.get(`${apiKey}/search/${q}`)
    return search.data.manga_list
  } catch (err) {
    console.log(err);
    return err
  }
}

export const popularManga = async () => {
  try {
    const popular = await axios.get(`${apiKey}/manga/popular/1`);
    return popular.data.manga_list
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const RekomenManga = async () => {
  try {
    const recomd = await axios.get(`${apiKey}/recommended`);
    return recomd.data.manga_list
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const GenreManga = async () => {
  try {
    const genre = await axios.get(`${apiKey}/genres`);
    console.log({ genre: genre.data.list_genre });
    return genre.data.list_genre;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const DetailManga = async (endpoint: string) => {
  try {
    const detail = await axios.get(
      `${apiKey}/manga/detail/${endpoint}`
    );
    return detail.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const ChapterManga = async (endpoint: string) => {
  try {
    const detail = await axios.get(
      `${apiKey}/chapter/${endpoint}`
    );
    return detail.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}