// /components/GalleryComponent/GalleryComponent.jsx
"use client";

import React, { useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Image from "next/image";

const GalleryComponent = ({ images, title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef(null);

  // Нормализуем массив изображений
  const safeImages = Array.isArray(images)
    ? images.filter(
        (img) =>
          img &&
          typeof img === "object" &&
          typeof img.original === "string" &&
          typeof img.thumbnail === "string"
      )
    : [];

  const galleryItems = safeImages.map((image) => ({
    original: `/uploads/${image.original}`,
    thumbnail: `/uploads/${image.thumbnail}`,
  }));

  const hasImages = galleryItems.length > 0;

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const changeMainImage = (index) => {
    setCurrentIndex(index);
    if (galleryRef.current) {
      galleryRef.current.slideToIndex(index);
    }
  };

  // Основная картинка
  const renderImage = (item) => (
    <div
      className="relative w-full cursor-pointer"
      style={{
        paddingTop: "75%", // 4:3
        overflow: "hidden",
        borderRadius: "8px",
      }}
      onClick={() => openModal(currentIndex)}
    >
      <Image
        src={item.original}
        alt={title || "Фото товара"}
        fill
        className="absolute inset-0 w-full h-full object-cover"
      />

      
    </div>
  );

  return (
    <div className="mt-8">
      <div className="relative">
        <div className="relative">
          {hasImages ? (
            <ImageGallery
              ref={galleryRef}
              items={galleryItems}
              // ОТКЛЮЧАЕМ встроенный fullscreen и play,
              // чтобы не было ситуации без кнопки выхода
              showFullscreenButton={false}
              showPlayButton={false}
              showThumbnails={false}
              startIndex={currentIndex}
              onSlide={(index) => setCurrentIndex(index)}
              renderItem={renderImage}
            />
          ) : (
            <Image
              src="/svg/image-grey.svg"
              className="mx-auto"
              alt="Изображения у данного товара нет"
              width={300}
              height={300}
            />
          )}
        </div>

        {hasImages && (
          <div className="flex overflow-x-scroll mt-4 space-x-2">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className={`min-w-28 min-h-20 cursor-pointer ${
                  currentIndex === index ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => changeMainImage(index)}
                style={{
                  position: "relative",
                  width: "112px",
                  height: "84px",
                  overflow: "hidden",
                  borderRadius: "8px",
                }}
              >
                <Image
                  src={item.thumbnail}
                  width={112}
                  height={84}
                  alt={title || "Превью товара"}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Наш собственный фуллскрин-модал с явной кнопкой ✕ */}
      {isModalOpen && hasImages && (
        <div className="modal modal-open">
          <div
            className="modal-box relative w-11/12"
            style={{ background: "transparent" }}
          >
            <button
              onClick={closeModal}
              className="btn btn-sm border-none text-black btn-circle bg-white absolute right-2 top-2 text-2xl"
            >
              ✕
            </button>

            <img
              src={galleryItems[currentIndex].original}
              alt={title || "Фото товара"}
              className="rounded-none w-full h-auto"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() =>
                  setCurrentIndex(
                    (currentIndex - 1 + galleryItems.length) %
                      galleryItems.length
                  )
                }
                className="btn btn-success"
              >
                &#10094; Назад
              </button>
              <button
                onClick={() =>
                  setCurrentIndex(
                    (currentIndex + 1) % galleryItems.length
                  )
                }
                className="btn btn-success"
              >
                Вперед &#10095;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryComponent;
