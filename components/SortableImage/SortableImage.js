// components/ImageUploader.js
import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Компонент для каждого загружаемого изображения
function SortableImage({ id, image, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="image-item">
      <img src={image.original} alt="Car" className="thumbnail" />
      <button onClick={() => onRemove(id)}>Удалить</button>
    </div>
  );
}

// Главный компонент загрузки и сортировки изображений
export default function ImageUploader() {
  const [images, setImages] = useState([]);

  // Обработка загрузки изображения
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      const url = URL.createObjectURL(file);
      return {
        id: url,
        original: url,
        thumbnail: url,
      };
    });
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Удаление изображения
  const handleRemoveImage = (id) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  // Обработка перетаскивания
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((prevImages) => {
        const oldIndex = prevImages.findIndex((image) => image.id === active.id);
        const newIndex = prevImages.findIndex((image) => image.id === over.id);
        return arrayMove(prevImages, oldIndex, newIndex);
      });
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleImageUpload} />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((image) => image.id)} strategy={verticalListSortingStrategy}>
          <div className="image-grid">
            {images.map((image) => (
              <SortableImage key={image.id} id={image.id} image={image} onRemove={handleRemoveImage} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
