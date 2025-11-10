import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { List, Pagination, Spin, Space, Button, Tag } from "antd";
import {
  EyeOutlined,
  ClockCircleOutlined,
  HeartFilled,
  StarFilled,
  PlayCircleOutlined,
  BookOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SearchOutlined,
  CloseOutlined,
} from "@ant-design/icons";

interface Chapter {
  chapter_id: string;
  chapter_number: number;
  chapter_title: string;
  thumbnail_image_url: string;
  view_count: number;
  release_date: string;
}

interface MangaDetail {
  manga_id: string;
  title: string;
  alternative_title: string;
  description: string;
  cover_image_url: string;
  cover_portrait_url: string;
  release_year: string;
  status: number;
  view_count: number;
  user_rate: number;
  bookmark_count: number;
  country_id: string;
  rank: number;
  latest_chapter_number: number;
  latest_chapter_id: string;
  taxonomy: {
    Author?: Array<{ name: string; slug: string }>;
    Artist?: Array<{ name: string; slug: string }>;
    Genre?: Array<{ name: string; slug: string }>;
    Format?: Array<{ name: string; slug: string }>;
  };
}

const MangaDetail: React.FC = () => {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const [mangaDetail, setMangaDetail] = useState<MangaDetail | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(true);
  const [loadingAllChapters, setLoadingAllChapters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);
  const pageSize = 24;

  useEffect(() => {
    if (mangaId) {
      fetchMangaDetail();
      fetchAllChapters();
    }
  }, [mangaId]);

  useEffect(() => {
    if (mangaId && !searchQuery) {
      fetchChapters(currentPage, sortOrder);
    }
  }, [mangaId, currentPage, sortOrder]);

  useEffect(() => {
    // Filter chapters based on search query
    if (searchQuery.trim() === "") {
      setFilteredChapters(chapters);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = allChapters.filter((chapter) => {
        // Exact match untuk chapter number
        const chapterNumberMatch = chapter.chapter_number.toString() === query;

        // Word boundary match untuk chapter title
        let titleMatch = false;
        if (chapter.chapter_title) {
          // Split title into words dan cek apakah ada kata yang match dengan query
          const titleWords = chapter.chapter_title.toLowerCase().split(/\s+/);
          titleMatch = titleWords.some(
            (word) =>
              word === query || // Exact word match
              word.startsWith(query) // Atau word yang diawali dengan query
          );
        }

        return chapterNumberMatch || titleMatch;
      });

      // Sort filtered results based on current sort order
      const sortedFiltered = [...filtered].sort((a, b) => {
        if (sortOrder === "desc") {
          return b.chapter_number - a.chapter_number;
        } else {
          return a.chapter_number - b.chapter_number;
        }
      });

      setFilteredChapters(sortedFiltered);
    }
  }, [searchQuery, chapters, allChapters, sortOrder]);

  const fetchMangaDetail = async () => {
    setDetailLoading(true);
    try {
      const res = await fetch(
        `https://api.shngm.io/v1/manga/detail/${mangaId}`
      );
      const data = await res.json();
      if (data.retcode === 0) {
        setMangaDetail(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDetailLoading(false);
    }
  };

  const fetchAllChapters = async () => {
    setLoadingAllChapters(true);
    try {
      // Fetch first page to get total
      const firstRes = await fetch(
        `https://api.shngm.io/v1/chapter/${mangaId}/list?page=1&page_size=100&sort_by=chapter_number&sort_order=desc`
      );
      const firstData = await firstRes.json();

      if (firstData.retcode === 0) {
        const totalPages = firstData.meta.total_page;
        let allChaptersData: Chapter[] = [...firstData.data];

        // Fetch remaining pages if any
        if (totalPages > 1) {
          const promises = [];
          for (let page = 2; page <= totalPages; page++) {
            promises.push(
              fetch(
                `https://api.shngm.io/v1/chapter/${mangaId}/list?page=${page}&page_size=100&sort_by=chapter_number&sort_order=desc`
              ).then((res) => res.json())
            );
          }

          const results = await Promise.all(promises);
          results.forEach((result) => {
            if (result.retcode === 0) {
              allChaptersData = [...allChaptersData, ...result.data];
            }
          });
        }

        setAllChapters(allChaptersData);
      }
    } catch (error) {
      console.error("Error fetching all chapters:", error);
    } finally {
      setLoadingAllChapters(false);
    }
  };

  const fetchChapters = async (page: number, order: "desc" | "asc") => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.shngm.io/v1/chapter/${mangaId}/list?page=${page}&page_size=${pageSize}&sort_by=chapter_number&sort_order=${order}`
      );
      const data = await res.json();
      if (data.retcode === 0) {
        setChapters(data.data);
        setFilteredChapters(data.data);
        setTotal(data.meta.total_record);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value as "desc" | "asc");
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const formatDate = (dateString: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (days === 0) return "Hari ini";
    if (days === 1) return "Kemarin";
    if (days < 7) return `${days} hari lalu`;
    if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
    return `${Math.floor(days / 30)} bulan lalu`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (detailLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <Spin size="large" className="[&_.ant-spin-dot-item]:bg-blue-500" />
      </div>
    );
  }

  if (!mangaDetail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <p className="mb-4">Manga tidak ditemukan</p>
          <Button onClick={() => navigate(-1)}>Kembali</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Button - Fixed on top */}
      <div className="sticky top-0 z-10 border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-sm">
        {/* <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="border-gray-600 bg-gray-700 text-white hover:border-blue-500 hover:bg-gray-600 hover:text-white"
          >
            Kembali
          </Button>
        </div> */}
      </div>

      {/* Hero Header with Background */}
      <div className="relative overflow-hidden border-b border-gray-700">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src={mangaDetail.cover_image_url}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <div className="relative mx-auto w-48 md:w-56 lg:w-64">
                <img
                  src={mangaDetail.cover_portrait_url}
                  alt={mangaDetail.title}
                  className="w-full rounded-xl shadow-2xl ring-2 ring-gray-700"
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-4">
              {/* Title */}
              <div>
                <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg">
                  {mangaDetail.title}
                </h1>
                {mangaDetail.alternative_title && (
                  <p className="mt-2 text-lg text-gray-300">
                    {mangaDetail.alternative_title}
                  </p>
                )}
              </div>

              {/* Action Buttons with Stats */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Primary Button */}
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={() =>
                    navigate(`/chapter/${mangaDetail.latest_chapter_id}`)
                  }
                  className="h-12 !bg-blue-600 px-6 hover:bg-purple-500"
                >
                  Baca
                </Button>

                {/* Stats */}
                <div className="ml-auto flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white">
                    <StarFilled className="text-orange-400" />
                    <span className="text-lg font-bold">
                      {mangaDetail.user_rate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <BookOutlined className="text-blue-400" />
                    <span className="text-lg font-bold">
                      {mangaDetail.latest_chapter_number}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <EyeOutlined className="text-gray-300" />
                    <span className="text-lg font-bold">
                      {formatNumber(mangaDetail.view_count)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <HeartFilled className="text-gray-500" />
                    <span className="text-lg font-bold">
                      {formatNumber(mangaDetail.bookmark_count)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-gray-200">
                <p
                  className={`leading-relaxed ${
                    !showFullDescription ? "line-clamp-3" : ""
                  }`}
                >
                  {mangaDetail.description}
                </p>
                {mangaDetail.description &&
                  mangaDetail.description.length > 200 && (
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="mt-2 text-gray-400 underline hover:text-white transition-colors"
                    >
                      {showFullDescription ? "Show Less" : "Read More..."}
                    </button>
                  )}
              </div>

              {/* Metadata Grid */}
              <div className="space-y-3">
                {/* Genre */}
                {mangaDetail.taxonomy.Genre &&
                  mangaDetail.taxonomy.Genre.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="min-w-[80px] font-semibold text-white">
                        Genre
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {mangaDetail.taxonomy.Genre.map((genre, idx) => (
                          <Tag
                            key={idx}
                            className="m-0 border-gray-700 bg-gray-800/80 px-3 py-1 text-white backdrop-blur-sm"
                          >
                            {genre.name}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Author */}
                {mangaDetail.taxonomy.Author &&
                  mangaDetail.taxonomy.Author.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="min-w-[80px] font-semibold text-white">
                        Author
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {mangaDetail.taxonomy.Author.map((author, idx) => (
                          <Tag
                            key={idx}
                            className="m-0 border-gray-700 bg-gray-800/80 px-3 py-1 text-white backdrop-blur-sm"
                          >
                            {author.name}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Artist */}
                {mangaDetail.taxonomy.Artist &&
                  mangaDetail.taxonomy.Artist.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="min-w-[80px] font-semibold text-white">
                        Artist
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {mangaDetail.taxonomy.Artist.map((artist, idx) => (
                          <Tag
                            key={idx}
                            className="m-0 border-gray-700 bg-gray-800/80 px-3 py-1 text-white backdrop-blur-sm"
                          >
                            {artist.name}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Format */}
                <div className="flex items-start gap-3">
                  <span className="min-w-[80px] font-semibold text-white">
                    Format
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {mangaDetail.taxonomy.Format?.map((format, idx) => (
                      <Tag
                        key={idx}
                        className="m-0 border-gray-700 bg-gray-800/80 px-3 py-1 text-white backdrop-blur-sm"
                      >
                        {format.name}
                      </Tag>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div className="flex items-start gap-3">
                  <span className="min-w-[80px] font-semibold text-white">
                    Type
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Tag className="m-0 border-gray-700 bg-gray-800/80 px-3 py-1 text-white backdrop-blur-sm">
                      {mangaDetail.status === 1 ? "Ongoing" : "Completed"}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter List Section */}
      <div className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Sort Controls & Search Bar - Flex Container */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Daftar Chapter</h2>
              <p className="mt-1 text-sm text-gray-400">
                Total {total} chapter tersedia
                {loadingAllChapters && (
                  <span className="ml-2 text-blue-400">
                    (Memuat semua chapter untuk pencarian...)
                  </span>
                )}
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex justify-between gap-4 w-full sm:w-auto content-center align-middle">
              <div className="flex-1 sm:max-w-md">
                <div className="relative">
                  <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 !text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari Chapter, Contoh: 69 atau 76"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    disabled={loadingAllChapters}
                    className="w-full pl-10 pr-10 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <CloseOutlined />
                    </button>
                  )}
                </div>
                {searchQuery && !loadingAllChapters && (
                  <p className="mt-2 text-sm text-gray-400">
                    Menampilkan {filteredChapters.length} dari{" "}
                    {allChapters.length} chapter
                  </p>
                )}
              </div>
              {/* Sort Controls */}
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-lg bg-gray-800 p-1">
                  <button
                    onClick={() => handleSortChange("desc")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      sortOrder === "desc"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <SortDescendingOutlined />
                    <span className="hidden sm:inline">Terbaru</span>
                  </button>
                  <button
                    onClick={() => handleSortChange("asc")}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      sortOrder === "asc"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <SortAscendingOutlined />
                    <span className="hidden sm:inline">Terlama</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Spin
            spinning={loading || loadingAllChapters}
            size="large"
            className="[&_.ant-spin-dot-item]:bg-blue-500"
          >
            <List
              className="rounded-lg border !border-gray-700 !bg-gray-800 [&_.ant-list-item]:!border-gray-700 [&_.ant-list-item:hover]:!bg-gray-700/50"
              itemLayout="horizontal"
              dataSource={filteredChapters}
              locale={{
                emptyText: (
                  <div className="py-8 text-center text-gray-400">
                    <SearchOutlined className="mb-2 text-4xl" />
                    <p>
                      Tidak ada chapter yang sesuai dengan pencarian "
                      {searchQuery}"
                    </p>
                  </div>
                ),
              }}
              renderItem={(chapter) => (
                <List.Item
                  className="cursor-pointer px-6 py-4 transition-all duration-200"
                  onClick={() => navigate(`/chapter/${chapter.chapter_id}`)}
                  extra={
                    <div className="hidden sm:block">
                      <img
                        src={chapter.thumbnail_image_url}
                        alt={`Chapter ${chapter.chapter_number}`}
                        className="h-24 w-16 rounded-lg object-cover shadow-lg transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <div className="block sm:hidden">
                        <img
                          src={chapter.thumbnail_image_url}
                          alt={`Chapter ${chapter.chapter_number}`}
                          className="h-16 w-12 rounded-lg object-cover shadow-lg"
                        />
                      </div>
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                          Ch. {chapter.chapter_number}
                        </span>
                        <span className="font-bold text-white">
                          Chapter {chapter.chapter_number}
                        </span>
                      </div>
                    }
                    description={
                      <Space
                        direction="vertical"
                        size="small"
                        className="mt-2 w-full"
                      >
                        {chapter.chapter_title && (
                          <p className="text-sm text-gray-300">
                            {chapter.chapter_title}
                          </p>
                        )}
                        <Space className="text-xs text-gray-400" split="|">
                          <span className="flex items-center gap-1">
                            <ClockCircleOutlined />
                            {formatDate(chapter.release_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <EyeOutlined className="text-blue-400" />
                            {formatNumber(chapter.view_count)} views
                          </span>
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Spin>

          {!searchQuery && chapters.length > 0 && !loadingAllChapters && (
            <div className="mt-8 flex justify-center">
              <div className="rounded-lg bg-gray-800 px-6 py-3">
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showTotal={(total) => `Total ${total} chapter`}
                  className="[&_.ant-pagination-item]:border-gray-600 [&_.ant-pagination-item]:bg-gray-700 [&_.ant-pagination-item-active]:border-blue-600 [&_.ant-pagination-item-active]:bg-blue-600 [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-item_a]:text-gray-300 [&_.ant-pagination-next_button]:text-gray-300 [&_.ant-pagination-prev_button]:text-gray-300 [&_.ant-pagination-total-text]:text-gray-300"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MangaDetail;
