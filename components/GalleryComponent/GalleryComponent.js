"use client"
import ImageGallery from 'react-image-gallery'
import React, { useRef, useState } from 'react'
import 'react-image-gallery/styles/css/image-gallery.css'
import Image from 'next/image'

const GalleryComponent = ({ images, title }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)
	const galleryRef = useRef(null)

	// Constructing items array for ImageGallery using the images prop
	const galleryItems = images.map((image) => ({
		original: `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${image.original}`,
		thumbnail: `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${image.thumbnail}`,
	}))

	// Open modal
	const openModal = (index) => {
		setCurrentIndex(index)
		setIsModalOpen(true)
	}

	// Close modal
	const closeModal = () => setIsModalOpen(false)

	// Change the main image in the gallery
	const changeMainImage = (index) => {
		setCurrentIndex(index)
		if (galleryRef.current) {
			galleryRef.current.slideToIndex(index)
		}
	}

	// Custom render function for main image with fixed aspect ratio
	const renderImage = (item) => (
		<div
			className="relative w-full"
			style={{
				paddingTop: '75%', // Соотношение сторон 4:3 (100 / 4 * 3)
				overflow: 'hidden',
				borderRadius: '8px',
			}}
		>
			<Image
				src={item.original}
				alt={title}
				layout="fill"
				objectFit="cover"
				className="absolute inset-0 w-full h-full"
			/>
		</div>
	)

	return (
		<div className='mt-8'>
			<div className="relative">
				<div className="relative rounded-lg overflow-hidden">
					<ImageGallery
						ref={galleryRef}
						items={galleryItems}
						showFullscreenButton={true}
						showPlayButton={true}
						showThumbnails={false}
						startIndex={currentIndex}
						onClick={() => openModal(currentIndex)}
						onSlide={(index) => setCurrentIndex(index)}
						renderItem={renderImage} // Используем кастомную функцию рендеринга изображения
					/>
				</div>

				<div className="flex overflow-x-scroll mt-4 space-x-2">
					{galleryItems.map((item, index) => (
						<div
							key={index}
							className={`min-w-28 min-h-20 cursor-pointer ${currentIndex === index ? 'border-2 border-blue-500' : ''}`}
							onClick={() => changeMainImage(index)}
							style={{
								position: 'relative',
								width: '112px',
								height: '84px',
								overflow: 'hidden',
								borderRadius: '8px',
							}}
						>
							<Image
								src={item.thumbnail}
								width={112}
								height={84}
								alt={title}
								className="object-cover w-full h-full"
							/>
						</div>
					))}
				</div>
			</div>

			{isModalOpen && (
				<div className="modal modal-open">
					<div className="modal-box relative w-11/12" style={{background:'transparent'}}>
						<button
							onClick={closeModal}
							className="btn btn-sm border-none text-black btn-circle bg-white absolute right-2 top-2 text-2xl"
						>
							✕
						</button>
						<img
							src={galleryItems[currentIndex].original}
							alt={title}
							className="rounded-lg w-full h-auto" // В модальном окне оригинальный формат
						/>
						<div className="flex justify-between mt-4">
							<button
								onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
								className="btn btn-outline"
							>
								&#10094; Назад
							</button>
							<button
								onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
								className="btn btn-outline"
							>
								Вперед &#10095;
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default GalleryComponent
