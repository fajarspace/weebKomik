// components/MangaSearchBar.tsx
import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

interface MangaSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  className?: string;
}

const MangaSearchBar: React.FC<MangaSearchBarProps> = ({
  onSearch,
  placeholder = "Cari manga...",
  size = "large",
  className = "",
}) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== undefined) {
        setLoading(true);
        onSearch(value);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Search
      placeholder={placeholder}
      allowClear
      enterButton={<SearchOutlined />}
      size={size}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onSearch={(val) => {
        setValue(val);
        onSearch(val);
      }}
      loading={loading}
      className={className}
    />
  );
};

export default MangaSearchBar;
