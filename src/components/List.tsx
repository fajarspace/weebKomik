import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Pagination,
  Spin,
  Row,
  Col,
  Tag,
  Space,
  Input,
  Empty,
} from "antd";
import {
  EyeOutlined,
  HeartOutlined,
  StarFilled,
  SearchOutlined,
  FireOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Meta } = Card;

interface Manga {
  manga_id: string;
  title: string;
  cover_portrait_url: string;
  latest_chapter_number: number;
  latest_chapter_time: string;
  user_rate: number;
  view_count: number;
  bookmark_count: number;
  country_id: string;
  taxonomy: {
    Genre?: Array<{ name: string }>;
  };
}

const MangaList: React.FC = () => {
  const navigate = useNavigate();
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const pageSize = 24;

  useEffect(() => {
    if (searchMode) {
      fetchSearchResults(currentPage, searchQuery);
    } else {
      fetchMangaList(currentPage);
    }
  }, [currentPage, searchMode]);

  const fetchMangaList = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.shngm.io/v1/manga/list?type=project&page=${page}&page_size=${pageSize}&is_update=true&sort=latest&sort_order=desc`
      );
      const data = await res.json();
      if (data.retcode === 0) {
        setMangaList(data.data);
        setTotal(data.meta.total_record);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async (page: number, query: string) => {
    if (!query.trim()) {
      setSearchMode(false);
      fetchMangaList(page);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.shngm.io/v1/manga/list?page=${page}&page_size=${pageSize}&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      if (data.retcode === 0) {
        setMangaList(data.data);
        setTotal(data.meta.total_record);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    if (value.trim()) {
      setSearchMode(true);
      fetchSearchResults(1, value);
    } else {
      setSearchMode(false);
      fetchMangaList(1);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchMode(false);
    setCurrentPage(1);
    fetchMangaList(1);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar dengan Search */}
      <nav className="sticky top-0 z-50 border-b !border-gray-700 !bg-gray-800 shadow-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo/Title */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                {searchMode ? "Hasil Pencarian" : "Dikin Sembelit"}
              </h1>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl flex-1">
              <Search
                placeholder="Cari..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                loading={loading}
                className="[&_.ant-input]:bg-gray-700/80 [&_.ant-input]:border-gray-600 [&_.ant-input]:text-white [&_.ant-input]:placeholder-gray-400 [&_.ant-input:hover]:border-blue-800 [&_.ant-input:focus]:border-blue-800 [&_.ant-input:hover]:bg-gray-700 [&_.ant-input:focus]:bg-gray-700 [&_.ant-btn-primary]:bg-blue-800 [&_.ant-btn-primary]:border-blue-800 [&_.ant-btn-primary:hover]:bg-blue-700"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-800 via-blue-900 to-blue-950 shadow-xl">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm sm:p-4">
              <FireOutlined className="text-3xl !text-white sm:text-4xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg sm:text-4xl">
                Terbaru
              </h1>
              <p className="mt-1 text-sm text-blue-100 sm:mt-2 sm:text-base">
                Baru diupdate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      {/* <div className="border-b !border-gray-700 !bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-300">
              {searchMode
                ? `Ditemukan ${total} hasil untuk "${searchQuery}"`
                : "Temukan manga favorit yang baru diupdate"}
            </p>
            {searchMode && (
              <button
                onClick={handleClearSearch}
                className="text-sm text-blue-400 transition-colors hover:text-blue-300"
              >
                ← Kembali ke daftar manga
              </button>
            )}
          </div>
        </div>
      </div> */}

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Spin spinning={loading} size="large">
          {mangaList.length === 0 && !loading ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-200">
                  {searchMode
                    ? `Tidak ada hasil untuk "${searchQuery}"`
                    : "Tidak ada manga tersedia"}
                </span>
              }
            >
              {searchMode && (
                <button
                  onClick={handleClearSearch}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Lihat Semua Manga
                </button>
              )}
            </Empty>
          ) : (
            <Row gutter={[16, 16]}>
              {mangaList.map((manga) => (
                <Col xs={12} sm={8} md={6} lg={4} key={manga.manga_id}>
                  <Card
                    hoverable
                    className="h-full !border-gray-700 !bg-gray-800 transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
                    cover={
                      <div className="relative overflow-hidden">
                        <img
                          alt={manga.title}
                          src={manga.cover_portrait_url}
                          className="h-72 w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <Tag
                          color="gold"
                          icon={<StarFilled />}
                          className="absolute right-2 top-2 shadow-lg"
                        >
                          {manga.user_rate}
                        </Tag>
                        <Tag className="absolute left-2 top-2 border-0 bg-gray-900/90 text-white shadow-lg backdrop-blur-sm">
                          {manga.country_id}
                        </Tag>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3">
                          <p className="text-xs font-bold text-white">
                            Ch. {manga.latest_chapter_number}
                          </p>
                          <p className="text-xs text-gray-300">
                            {formatDate(manga.latest_chapter_time)}
                          </p>
                        </div>
                      </div>
                    }
                    onClick={() => navigate(`/detail/${manga.manga_id}`)}
                  >
                    <Meta
                      title={
                        <div className="h-10 overflow-hidden">
                          <p className="line-clamp-2 text-sm font-semibold text-white">
                            {manga.title}
                          </p>
                        </div>
                      }
                      description={
                        <Space
                          direction="vertical"
                          size="small"
                          className="w-full"
                        >
                          <Space wrap>
                            {manga.taxonomy.Genre?.slice(0, 2).map((g, i) => (
                              <Tag
                                key={i}
                                color="secondary"
                                className="text-xs !text-black"
                              >
                                {g.name}
                              </Tag>
                            ))}
                          </Space>
                          <div className="flex items-center justify-between text-xs text-gray-200">
                            <span className="flex items-center gap-1">
                              <EyeOutlined className="text-blue-400" />
                              {formatNumber(manga.view_count)}
                            </span>
                            <span className="flex items-center gap-1">
                              <HeartOutlined className="text-red-400" />
                              {formatNumber(manga.bookmark_count)}
                            </span>
                          </div>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Spin>

        {mangaList.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="rounded-lg !bg-gray-800 px-6 py-3">
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showTotal={(total) =>
                  `Total ${total} ${searchMode ? "hasil" : "manga"}`
                }
                className="[&_.ant-pagination-item]:bg-gray-700 [&_.ant-pagination-item]:border-gray-600 [&_.ant-pagination-item_a]:text-gray-300 [&_.ant-pagination-item-active]:bg-blue-600 [&_.ant-pagination-item-active]:border-blue-600 [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-prev_button]:text-gray-300 [&_.ant-pagination-next_button]:text-gray-300 [&_.ant-pagination-total-text]:text-gray-300"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaList;
