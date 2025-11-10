import HeroCarousel from "../components/Carousel";
import MangaList from "../components/List";
import RecommendedManga from "../components/Recommended";

const Home = () => {
  return (
    <div>
      <HeroCarousel />
      <RecommendedManga />
      <MangaList />
    </div>
  );
};

export default Home;
