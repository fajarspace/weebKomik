import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { List, Pagination, Spin, Space } from "antd";
import { EyeOutlined, ClockCircleOutlined } from "@ant-design/icons";

interface Chapter {
  chapter_id: string;
  chapter_number: number;
  chapter_title: string;
  thumbnail_image_url: string;
  view_count: number;
  release_date: string;
}

const MangaDetail: React.FC = () => {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 24;

  useEffect(() => {
    if (mangaId) fetchChapters(currentPage);
  }, [mangaId, currentPage]);

  const fetchChapters = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.shngm.io/v1/chapter/${mangaId}/list?page=${page}&page_size=${pageSize}&sort_by=chapter_number&sort_order=desc`
      );
      const data = await res.json();
      if (data.retcode === 0) {
        setChapters(data.data);
        setTotal(data.meta.total_record);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800 shadow-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Daftar Chapter</h1>
          <p className="mt-2 text-gray-400">Total {total} chapter tersedia</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Spin
          spinning={loading}
          size="large"
          className="[&_.ant-spin-dot-item]:bg-blue-500"
        >
          <List
            className="bg-gray-800 rounded-lg border border-gray-700 [&_.ant-list-item]:border-gray-700 [&_.ant-list-item:hover]:bg-gray-700/50"
            itemLayout="horizontal"
            dataSource={chapters}
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

        {chapters.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="rounded-lg bg-gray-800 px-6 py-3">
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showTotal={(total) => `Total ${total} chapter`}
                className="[&_.ant-pagination-item]:bg-gray-700 [&_.ant-pagination-item]:border-gray-600 [&_.ant-pagination-item_a]:text-gray-300 [&_.ant-pagination-item-active]:bg-blue-600 [&_.ant-pagination-item-active]:border-blue-600 [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-prev_button]:text-gray-300 [&_.ant-pagination-next_button]:text-gray-300 [&_.ant-pagination-total-text]:text-gray-300"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaDetail;
