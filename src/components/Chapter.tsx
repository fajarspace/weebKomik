import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Drawer, Input, List, Spin } from "antd";
import {
  SearchOutlined,
  CloseOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const { Search } = Input;

interface ChapterDetailData {
  chapter_id: string;
  manga_id: string;
  chapter_number: number;
  chapter_title: string;
  base_url: string;
  base_url_low: string;
  chapter: {
    path: string;
    data: string[];
  };
  thumbnail_image_url: string;
  view_count: number;
  prev_chapter_id: string | null;
  prev_chapter_number: number | null;
  next_chapter_id: string | null;
  next_chapter_number: number | null;
  release_date: string;
  created_at: string;
  updated_at: string;
}

interface ChapterDetailResponse {
  retcode: number;
  message: string;
  data: ChapterDetailData;
}

interface ChapterListItem {
  chapter_id: string;
  chapter_number: number;
  chapter_title: string;
}

const ChapterReader: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const [chapterData, setChapterData] = useState<ChapterDetailData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageQuality, setImageQuality] = useState<"high" | "low">("high");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [allChapters, setAllChapters] = useState<ChapterListItem[]>([]);
  const [filteredChapters, setFilteredChapters] = useState<ChapterListItem[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingChapters, setLoadingChapters] = useState(false);

  useEffect(() => {
    if (chapterId) {
      fetchChapterDetail();
      window.scrollTo(0, 0);
    }
  }, [chapterId]);

  // Handle scroll to show/hide navbar and footer
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Filter chapters when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChapters(allChapters);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const isNumericQuery = /^\d+$/.test(query);

      const filtered = allChapters.filter((chapter) => {
        if (isNumericQuery) {
          return chapter.chapter_number.toString() === query;
        } else {
          if (chapter.chapter_title) {
            return chapter.chapter_title.toLowerCase().includes(query);
          }
          return false;
        }
      });

      setFilteredChapters(filtered);
    }
  }, [searchQuery, allChapters]);

  const fetchChapterDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.shngm.io/v1/chapter/detail/${chapterId}`
      );
      const data: ChapterDetailResponse = await response.json();

      if (data.retcode === 0) {
        setChapterData(data.data);
      }
    } catch (error) {
      console.error("Error fetching chapter detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllChapters = async (mangaId: string) => {
    setLoadingChapters(true);
    try {
      const firstRes = await fetch(
        `https://api.shngm.io/v1/chapter/${mangaId}/list?page=1&page_size=100&sort_by=chapter_number&sort_order=desc`
      );
      const firstData = await firstRes.json();

      if (firstData.retcode === 0) {
        const totalPages = firstData.meta.total_page;
        let allChaptersData: ChapterListItem[] = firstData.data.map(
          (ch: any) => ({
            chapter_id: ch.chapter_id,
            chapter_number: ch.chapter_number,
            chapter_title: ch.chapter_title || "",
          })
        );

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
              const chapters = result.data.map((ch: any) => ({
                chapter_id: ch.chapter_id,
                chapter_number: ch.chapter_number,
                chapter_title: ch.chapter_title || "",
              }));
              allChaptersData = [...allChaptersData, ...chapters];
            }
          });
        }

        setAllChapters(allChaptersData);
        setFilteredChapters(allChaptersData);
      }
    } catch (error) {
      console.error("Error fetching all chapters:", error);
    } finally {
      setLoadingChapters(false);
    }
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
    if (chapterData?.manga_id && allChapters.length === 0) {
      fetchAllChapters(chapterData.manga_id);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSearchQuery("");
  };

  const handleChapterClick = (chapterId: string) => {
    handleCloseDrawer();
    navigate(`/chapter/${chapterId}`);
  };

  const getImageUrl = (filename: string) => {
    if (!chapterData) return "";
    const baseUrl =
      imageQuality === "high" ? chapterData.base_url : chapterData.base_url_low;
    return `${baseUrl}${chapterData.chapter.path}${filename}`;
  };

  const handlePrevChapter = () => {
    if (chapterData?.prev_chapter_id) {
      navigate(`/chapter/${chapterData.prev_chapter_id}`);
    }
  };

  const handleNextChapter = () => {
    if (chapterData?.next_chapter_id) {
      navigate(`/chapter/${chapterData.next_chapter_id}`);
    }
  };

  const handleBackToChapterList = () => {
    if (chapterData?.manga_id) {
      navigate(`/detail/${chapterData.manga_id}`);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300">Memuat chapter...</p>
        </div>
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-gray-300 mb-4">Chapter tidak ditemukan</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Header - Fixed with slide animation */}
      <div
        className={`fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToChapterList}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="hidden sm:inline">Kembali</span>
            </button>

            <div className="flex-1 mx-4 text-center">
              <h1 className="text-white font-semibold text-sm sm:text-base truncate">
                Chapter {chapterData.chapter_number}
                {chapterData.chapter_title && ` - ${chapterData.chapter_title}`}
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">
                Halaman {currentImageIndex + 1} /{" "}
                {chapterData.chapter.data.length}
              </p>
            </div>

            {/* Quality Toggle */}
            <button
              onClick={() =>
                setImageQuality((prev) => (prev === "high" ? "low" : "high"))
              }
              className="px-3 py-1.5 bg-gray-800 text-gray-300 hover:text-white rounded-md text-xs sm:text-sm transition-colors"
            >
              {imageQuality === "high" ? "HD" : "SD"}
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Info Banner */}
      <div className="pt-16 pb-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>{formatNumber(chapterData.view_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{chapterData.chapter.data.length} halaman</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Images */}
      <div className="max-w-2xl mx-auto px-0 sm:px-4 pb-20">
        <div className="space-y-0">
          {chapterData.chapter.data.map((image, index) => (
            <div
              key={index}
              className="relative bg-black"
              style={{ minHeight: "400px" }}
            >
              <img
                src={getImageUrl(image)}
                alt={`Page ${index + 1}`}
                className="w-full h-auto mx-auto"
                loading={index < 3 ? "eager" : "lazy"}
                onLoadStart={() => {
                  const observer = new IntersectionObserver(
                    (entries) => {
                      entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                          setCurrentImageIndex(index);
                        }
                      });
                    },
                    { threshold: 0.5 }
                  );

                  const img = document.querySelector(
                    `img[alt="Page ${index + 1}"]`
                  );
                  if (img) observer.observe(img);
                }}
              />

              {/* Page Number Overlay */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-md text-sm font-medium">
                {index + 1} / {chapterData.chapter.data.length}
              </div>
            </div>
          ))}
        </div>

        {/* End of Chapter Message */}
        {/* <div className="bg-gray-800 rounded-lg p-8 text-center mt-8 mx-4 sm:mx-0">
          <h3 className="text-white text-xl font-semibold mb-2">
            Akhir Chapter {chapterData.chapter_number}
          </h3>
          <p className="text-gray-400 mb-6">Terima kasih sudah membaca!</p>

   
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handlePrevChapter}
              disabled={!chapterData.prev_chapter_id}
              className="w-full sm:w-auto px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>
                {chapterData.prev_chapter_id
                  ? `Chapter ${chapterData.prev_chapter_number}`
                  : "Tidak ada chapter sebelumnya"}
              </span>
            </button>

            <button
              onClick={handleBackToChapterList}
              className="w-full sm:w-auto px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Daftar Chapter
            </button>

            <button
              onClick={handleNextChapter}
              disabled={!chapterData.next_chapter_id}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <span>
                {chapterData.next_chapter_id
                  ? `Chapter ${chapterData.next_chapter_number}`
                  : "Tidak ada chapter berikutnya"}
              </span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div> */}
      </div>

      {/* Bottom Navigation - Fixed with slide animation */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePrevChapter}
              disabled={!chapterData.prev_chapter_id}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>
                {chapterData.prev_chapter_id
                  ? `Chapter ${chapterData.prev_chapter_number}`
                  : "Tidak ada chapter sebelumnya"}
              </span>
            </button>

            <button
              onClick={handleOpenDrawer}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <span className="hidden sm:inline">
                {" "}
                <UnorderedListOutlined />
              </span>
              <span className="sm:hidden">
                <UnorderedListOutlined />
              </span>
            </button>

            <button
              onClick={handleNextChapter}
              disabled={!chapterData.next_chapter_id}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <span>
                {chapterData.next_chapter_id
                  ? `Chapter ${chapterData.next_chapter_number}`
                  : "Tidak ada chapter berikutnya"}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Show Navigation Trigger Areas */}
      <div
        className="fixed top-0 left-0 right-0 h-20 z-40"
        onMouseEnter={() => setIsVisible(true)}
      />
      <div
        className="fixed bottom-0 left-0 right-0 h-20 z-40"
        onMouseEnter={() => setIsVisible(true)}
      />

      {/* Chapter Search Drawer */}
      <Drawer
        title={null}
        placement="bottom"
        onClose={handleCloseDrawer}
        open={isDrawerOpen}
        height="80vh"
        closeIcon={<CloseOutlined className="!text-white text-xl" />}
        className="chapter-drawer"
        styles={{
          header: {
            background: "#1f2937",
            borderBottom: "none",
          },
          body: {
            background: "#1f2937",
            padding: "24px",
          },
        }}
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Chapter</h2>

          {/* Search Input */}
          <Search
            placeholder="Search"
            size="large"
            // prefix={<SearchOutlined className="text-gray-400" />}
            // suffix={<DownOutlined className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-6 [&_.ant-input]:bg-gray-700 [&_.ant-input]:text-white [&_.ant-input]:placeholder-gray-500 [&_.ant-input]:border-0 [&_.ant-input-affix-wrapper]:bg-gray-700 [&_.ant-input-affix-wrapper]:border-0 [&_.ant-input-affix-wrapper:hover]:bg-gray-600 [&_.ant-input-affix-wrapper-focused]:bg-gray-600 [&_.ant-input-affix-wrapper-focused]:shadow-none"
          />

          {/* Chapter List */}
          <Spin spinning={loadingChapters}>
            <div className="max-h-[calc(80vh-200px)] overflow-y-auto custom-scrollbar">
              <List
                dataSource={filteredChapters}
                locale={{
                  emptyText: (
                    <div className="py-8 text-center text-gray-400">
                      {searchQuery ? (
                        <>
                          <SearchOutlined className="mb-2 text-4xl" />
                          <p>
                            Tidak ada chapter yang sesuai dengan pencarian "
                            {searchQuery}"
                          </p>
                        </>
                      ) : (
                        <p>Tidak ada chapter tersedia</p>
                      )}
                    </div>
                  ),
                }}
                renderItem={(chapter) => (
                  <div
                    key={chapter.chapter_id}
                    onClick={() => handleChapterClick(chapter.chapter_id)}
                    className={`px-6 py-4 rounded-xl mb-2 cursor-pointer transition-all ${
                      chapter.chapter_id === chapterId
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    <div className="font-semibold">
                      Chapter {chapter.chapter_number}
                    </div>
                    {chapter.chapter_title && (
                      <div className="text-sm text-gray-300 mt-1">
                        {chapter.chapter_title}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </Spin>
        </div>
      </Drawer>

      <style>{`
        .chapter-drawer .ant-drawer-close {
          top: 16px;
          right: 16px;
        }
        .chapter-drawer .ant-drawer-close:hover {
          background-color: transparent;
        }
        .chapter-drawer .ant-drawer-header {
          padding: 16px 24px;
        }
      `}</style>
    </div>
  );
};

export default ChapterReader;
