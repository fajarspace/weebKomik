import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Button } from "antd";
import {
  RightOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

interface Badge {
  badge_id: number;
  badge_name: string;
  badge_color: string;
}

interface SliderItem {
  id: number;
  title: string;
  rating: string;
  background_image: string;
  chara_image: string;
  slider_link: string;
  blur_color: string;
  category: string;
  category_id: number;
  detail: string;
  badges: Badge[];
}

const HeroCarousel: React.FC = () => {
  const navigate = useNavigate();
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  // Ganti NodeJS.Timeout dengan number
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  // Auto slide effect
  useEffect(() => {
    if (isPlaying && sliders.length > 0) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sliders.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, sliders.length]);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://slider.shngm.io/v1/slider/explore-1");
      const data = await res.json();
      console.log("Slider data:", data);
      if (data.data && data.data.length > 0) {
        setSliders(data.data);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
    } finally {
      setLoading(false);
    }
  };

  // const goToPrevious = () => {
  //   setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
  // };

  // const goToNext = () => {
  //   setCurrentIndex((prev) => (prev + 1) % sliders.length);
  // };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const selectedSlider = sliders[currentIndex];

  return (
    <div className="bg-gray-900">
      <Spin spinning={loading} size="large">
        {selectedSlider && (
          <>
            {/* Hero Section with Background */}
            <div className="relative min-h-[600px] overflow-hidden lg:min-h-[700px]">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 transition-all duration-700">
                <img
                  key={selectedSlider.id}
                  src={selectedSlider.background_image}
                  alt={selectedSlider.title}
                  className="h-full w-full object-cover animate-fade-in"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              </div>

              {/* Navigation Buttons */}
              {/* <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2 sm:left-8">
                <Button
                  icon={<LeftOutlined />}
                  onClick={goToPrevious}
                  size="large"
                  className="h-12 w-12 rounded-full border-white/30 bg-black/50 text-white backdrop-blur-sm hover:border-white hover:bg-black/70 hover:text-white"
                />
              </div>
              <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2 sm:right-8">
                <Button
                  icon={<RightOutlined />}
                  onClick={goToNext}
                  size="large"
                  className="h-12 w-12 rounded-full border-white/30 bg-black/50 text-white backdrop-blur-sm hover:border-white hover:bg-black/70 hover:text-white"
                />
              </div> */}

              {/* Play/Pause Button */}
              <div className="absolute bottom-4 right-4 z-10 sm:bottom-8 sm:right-8">
                <Button
                  icon={
                    isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />
                  }
                  onClick={togglePlayPause}
                  size="large"
                  className="h-12 w-12 rounded-full border-white/30 bg-black/50 text-white backdrop-blur-sm hover:border-white hover:bg-black/70 hover:text-white"
                />
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {sliders.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Left Side - Info */}
                  <div className="flex flex-col justify-center space-y-6">
                    {/* Badges */}
                    {/* <div className="flex flex-wrap gap-2 animate-fade-in">
                      {selectedSlider.badges.map((badge) => (
                        <Tag
                          key={badge.badge_id}
                          style={{
                            backgroundColor: badge.badge_color,
                            borderColor: badge.badge_color,
                          }}
                          className="border-0 px-3 py-1 text-sm font-semibold text-white"
                        >
                          {badge.badge_name}
                        </Tag>
                      ))}
                    </div> */}

                    {/* Title */}
                    <h1 className="animate-fade-in text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                      {selectedSlider.title}
                    </h1>

                    {/* Rating */}
                    {/* <div className="flex items-center gap-3 animate-fade-in">
                      <div className="flex items-center gap-2 rounded-lg bg-yellow-500/20 px-4 py-2 backdrop-blur-sm">
                        <StarFilled className="text-2xl text-yellow-400" />
                        <span className="text-3xl font-bold text-white">
                          {selectedSlider.rating}
                        </span>
                      </div>
                    </div> */}

                    {/* Description */}
                    <p className="max-w-2xl animate-fade-in text-base leading-relaxed text-gray-300 md:text-lg">
                      {selectedSlider.detail}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 animate-fade-in">
                      <Button
                        type="primary"
                        size="large"
                        // icon={<RightOutlined />}
                        onClick={() =>
                          navigate(`/detail/${selectedSlider.slider_link}`)
                        }
                        className="!bg-blue-800 hover:bg-blue-500"
                      >
                        Lihat Detail <RightOutlined />
                      </Button>
                    </div>
                  </div>

                  {/* Right Side - Character Image */}
                  <div className="flex items-end justify-center lg:justify-end">
                    <img
                      key={selectedSlider.id}
                      src={selectedSlider.chara_image}
                      alt={selectedSlider.title}
                      className="max-h-[500px] w-auto animate-fade-in object-contain drop-shadow-2xl lg:max-h-[600px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && sliders.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-gray-400">Tidak ada data slider</p>
            </div>
          </div>
        )}
      </Spin>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
