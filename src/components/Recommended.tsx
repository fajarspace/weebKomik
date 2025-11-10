import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Tabs, Spin, Carousel } from "antd";
import { EyeOutlined, HeartOutlined, StarFilled } from "@ant-design/icons";

type FormatType = "manga" | "manhwa" | "manhua";

interface Manga {
  manga_id: string;
  title: string;
  cover_portrait_url: string;
  cover_image_url: string;
  latest_chapter_number: number;
  user_rate: number;
  view_count: number;
  bookmark_count: number;
  country_id: string;
  rank: number;
  taxonomy: {
    Genre?: Array<{ name: string }>;
  };
}

interface MangaCardProps {
  manga: Manga;
  onClick: () => void;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const MangaCard: React.FC<MangaCardProps> = ({ manga, onClick }) => (
  <div className="px-2">
    <Card
      hoverable
      onClick={onClick}
      className="group h-full overflow-hidden rounded-xl border !border-gray-700 !bg-gray-800 shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/30"
      cover={
        <div className="relative overflow-hidden">
          {/* Cover Image */}
          <img
            alt={manga.title}
            src={manga.cover_portrait_url || manga.cover_image_url}
            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-72"
          />

          {/* Recommended Badge */}
          <div className="absolute left-2 top-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
            REKOMENDASI
          </div>

          {/* Rating Badge */}
          {manga.user_rate && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
              <StarFilled className="text-xs" />
              {manga.user_rate}
            </div>
          )}

          {/* Overlay Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3">
            <div className="flex items-center justify-between">
              <div className="rounded-md bg-gray-900/90 px-2 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                {manga.country_id}
              </div>
              {manga.latest_chapter_number && (
                <div className="rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                  Ch. {manga.latest_chapter_number}
                </div>
              )}
            </div>
          </div>
        </div>
      }
    >
      {/* Title */}
      <div className="mb-3 h-10 overflow-hidden">
        <h3 className="line-clamp-2 text-sm font-bold text-white">
          {manga.title}
        </h3>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between border-t border-gray-700 pt-2 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <EyeOutlined className="text-blue-400" />
          <span className="font-semibold">
            {formatNumber(manga.view_count)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <HeartOutlined className="text-red-400" />
          <span className="font-semibold">
            {formatNumber(manga.bookmark_count)}
          </span>
        </div>
      </div>
    </Card>
  </div>
);

const RecommendedManga: React.FC = () => {
  const navigate = useNavigate();
  const [format, setFormat] = useState<FormatType>("manga");
  const [list, setList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [format]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.shngm.io/v1/manga/list?format=${format}&page=1&page_size=12&is_recommended=true&sort=latest&sort_order=desc`
      );
      const data = await res.json();
      if (data.retcode === 0) setList(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const carouselSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    ],
  };

  const tabItems = [
    { label: "Manga", key: "manga" },
    { label: "Manhwa", key: "manhwa" },
    { label: "Manhua", key: "manhua" },
  ];

  return (
    <div className="bg-gray-900 py-6">
      <div className="mb-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Rekomendasi
          </h1>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs
            type="card"
            activeKey={format}
            onChange={(key) => setFormat(key as FormatType)}
            items={tabItems}
            className="font-semibold [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-tab]:!text-gray-400 [&_.ant-tabs-tab]:font-semibold [&_.ant-tabs-tab:hover]:text-blue-400 [&_.ant-tabs-tab-active]:text-blue-500 [&_.ant-tabs-ink-bar]:bg-blue-500"
          />
        </div>

        {/* Carousel */}
        <Spin
          spinning={loading}
          size="large"
          className="[&_.ant-spin-dot-item]:bg-blue-500"
        >
          <Carousel
            {...carouselSettings}
            className="[&_.slick-prev]:before:text-blue-500 [&_.slick-prev]:before:text-2xl [&_.slick-next]:before:text-blue-500 [&_.slick-next]:before:text-2xl [&_.slick-dots_li_button]:bg-gray-600 [&_.slick-dots_li.slick-active_button]:bg-blue-500"
          >
            {list.map((manga) => (
              <MangaCard
                key={manga.manga_id}
                manga={manga}
                onClick={() => navigate(`/detail/${manga.manga_id}`)}
              />
            ))}
          </Carousel>
        </Spin>
      </div>
    </div>
  );
};

export default RecommendedManga;
