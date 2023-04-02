import axios from "axios";

const apiKey = "http://localhost:4000/api";

export const searchKomik = async (q: string) => {
  try {
    const search = await axios.get(`${apiKey}/search/${q}`)
    return search.data.komik_list
  } catch (err) {
    console.log(err);
    return err
  }
}

export const popularKomik = async () => {
  try {
    const popular = await axios.get(`${apiKey}/komik/popular/1`);
    return popular.data.komik_list
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const RekomenKomik = async () => {
  try {
    const recomd = await axios.get(`${apiKey}/recommended`);
    return recomd.data.komik_list
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const GenreKomik = async () => {
  try {
    const genre = await axios.get(`${apiKey}/genres`);
    console.log({ genre: genre.data.list_genre });
    return genre.data.list_genre;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const DetailKomik = async (endpoint: string) => {
  try {
    const detail = await axios.get(
      `${apiKey}/komik/detail/${endpoint}`
    );
    return detail.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const ChapterKomik = async (endpoint: string) => {
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