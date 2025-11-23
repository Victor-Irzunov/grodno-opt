// /components/FormsAdmin/AddOneProductForm.js
"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Upload, Radio, Empty } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  createOneProduct,
  getAllCategory,
  getAllGroupOneCategory,
} from "@/http/adminAPI";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Resizer from "react-image-file-resizer";

const { TextArea } = Input;

const resizeFile = (file, width, height, quality = 60) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      "WEBP",
      quality,
      0,
      async (uri) => {
        const res = await fetch(uri);
        const blob = await res.blob();
        const resizedFile = new File([blob], file.name, {
          type: "image/webp",
        });
        resolve(resizedFile);
      },
      "base64"
    );
  });

const SortableImage = ({ id, image, onRemove, isMain }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleDelete = (e) => {
    e.stopPropagation();
    onRemove(id);
  };

  const imageUrl =
    image.original instanceof File ? URL.createObjectURL(image.original) : null;

  return (
    <div className="sd:mr-2 xz:mr-1 relative">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="sortable-image-item mt-4 relative"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="upload" className="sd:w-24 xz:w-16" />
        ) : (
          <span>Ошибка загрузки изображения</span>
        )}
        {isMain && (
          <div className="absolute top-0.5 left-0.5 bg-green-600 bg-opacity-60 p-0.5 rounded flex items-center">
            <img
              src="/svg/scraper.svg"
              alt="scraper icon"
              className="w-3 h-3 mr-1"
            />
            <span className="text-[10px] text-white">Главное</span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleDelete}
        className="text-xs text-red-500"
      >
        Удалить
      </button>
    </div>
  );
};

const AddOneProductForm = () => {
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // antd message без варнинга
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    getAllCategory().then((data) => setCategories(data));
  }, []);

  const handleCategoryChange = async (id) => {
    setSelectedCategory(id);
    const groupsData = await getAllGroupOneCategory(id);
    setGroups(groupsData.groupsOneCategory);
  };

  const handleRemoveImage = (id) =>
    setImageList((prevList) => prevList.filter((file) => file.uid !== id));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setImageList((prevList) => {
      const oldIndex = prevList.findIndex((file) => file.uid === active.id);
      const newIndex = prevList.findIndex((file) => file.uid === over.id);
      return arrayMove(prevList, oldIndex, newIndex);
    });
  };

  const handleImageUpload = async ({ fileList }) => {
    const processedImages = await Promise.all(
      fileList.map(async (file) => {
        const original = await resizeFile(
          file.originFileObj || file,
          1280,
          720,
          70
        );
        const thumbnail = await resizeFile(
          file.originFileObj || file,
          300,
          169,
          85
        );
        return {
          original,
          thumbnail,
          uid: file.uid,
        };
      })
    );
    setImageList(processedImages);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("article", values.article);
    formData.append("count", values.count);
    formData.append("price", values.price);
    formData.append("status", values.status || "В наличии");
    formData.append("categoryId", values.categoryId);
    formData.append("groupId", selectedGroup);
    formData.append("description", values.description || "");

    imageList.forEach((file) => {
      formData.append("originalImages", file.original);
      formData.append("thumbnailImages", file.thumbnail);
    });

    try {
      const data = await createOneProduct(formData);
      if (data) {
        messageApi.success("Товар успешно добавлен");
        form.resetFields();
        setImageList([]);
        setSelectedCategory(null);
        setSelectedGroup(null);
      }
    } catch (e) {
      console.error(e);
      messageApi.error("Ошибка при добавлении товара");
    }
  };

  const handleGroupChange = (groupId) => setSelectedGroup(groupId);

  return (
    <div className="pt-3">
      {contextHolder}
      <Form
        form={form}
        name="createProduct"
        onFinish={onFinish}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item
          name="categoryId"
          label={<span style={{ color: "white" }}>Категория</span>}
          rules={[{ required: true, message: "Выберите категорию" }]}
        >
          <Radio.Group>
            {categories.map((cat) => (
              <Radio.Button
                key={cat.id}
                value={cat.id}
                style={{
                  backgroundColor:
                    selectedCategory === cat.id ? "#0171E3" : "#191919",
                  color: "white",
                  borderRadius: 0,
                }}
                onChange={() => handleCategoryChange(cat.id)}
                className="m-1"
              >
                {cat.title}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="groupId"
          label={<span style={{ color: "white" }}>Группа</span>}
          rules={[{ required: true, message: "Выберите группу" }]}
        >
          {groups.length ? (
            <div className="flex flex-col">
              {groups.map((group) => (
                <label
                  className="label cursor-pointer flex justify-start space-x-2"
                  key={group.id}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedGroup === group.id}
                    onChange={() => handleGroupChange(group.id)}
                  />
                  <span className="label-text text-white">
                    {group.title}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <Empty
              description={
                <p className="text-white/70">Выберите категорию</p>
              }
            />
          )}
        </Form.Item>

        <Form.Item
          name="title"
          label={<span style={{ color: "white" }}>Название товара</span>}
          rules={[{ required: true, message: "Введите название товара!" }]}
        >
          <Input
            size="large"
            style={{ backgroundColor: "#191919", color: "white" }}
          />
        </Form.Item>

        <Form.Item
          name="article"
          label={<span style={{ color: "white" }}>Артикул</span>}
          rules={[{ required: true, message: "Введите Артикул товара!" }]}
        >
          <Input
            size="large"
            style={{ backgroundColor: "#191919", color: "white" }}
          />
        </Form.Item>

        <Form.Item
          name="count"
          label={<span style={{ color: "white" }}>Кол-во</span>}
          rules={[{ required: true, message: "Введите кол-во товара!" }]}
        >
          <Input
            type="number"
            size="large"
            style={{ backgroundColor: "#191919", color: "white" }}
          />
        </Form.Item>

        <Form.Item
          name="price"
          label={
            <span style={{ color: "white" }}>Цена за шт. (USD)</span>
          }
          rules={[{ required: true, message: "Введите цену!" }]}
        >
          <Input
            type="number"
            size="large"
            style={{ backgroundColor: "#191919", color: "white" }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={<span style={{ color: "white" }}>Статус</span>}
        >
          <Radio.Group>
            <Radio.Button
              value="В наличии"
              style={{ backgroundColor: "#191919", color: "white" }}
            >
              В наличии
            </Radio.Button>
            <Radio.Button
              value="Под заказ"
              style={{ backgroundColor: "#191919", color: "white" }}
            >
              Под заказ
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        {/* Описание товара */}
        <Form.Item
          name="description"
          label={<span style={{ color: "white" }}>Описание товара</span>}
        >
          <TextArea
            rows={6}
            placeholder="Краткое описание, характеристики, совместимость и т.д."
            style={{ backgroundColor: "#191919", color: "white" }}
          />
        </Form.Item>

        {/* === ИЗОБРАЖЕНИЯ (ОБЯЗАТЕЛЬНО ОДИН РУТ-ДОЧЕРНИЙ ЭЛЕМЕНТ ВНУТРИ Form.Item) === */}
        <Form.Item
          label={<span style={{ color: "white" }}>Изображения</span>}
          name="images"
        >
          <div>
            <Upload
              accept="image/*"
              multiple
              beforeUpload={() => false}
              onChange={handleImageUpload}
              // анtd формально ожидает UploadFile[], но мы используем свой рендер
              fileList={[]}
              showUploadList={false}
            >
              <Button
                color="primary"
                variant="outlined"
                style={{ backgroundColor: "#191919" }}
                icon={<UploadOutlined />}
              >
                Загрузить изображения
              </Button>
            </Upload>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={imageList.map((file) => file.uid)}
                strategy={verticalListSortingStrategy}
              >
                <div className="sortable-images flex flex-wrap">
                  {imageList.map((file, index) => (
                    <SortableImage
                      key={file.uid}
                      id={file.uid}
                      image={file}
                      onRemove={handleRemoveImage}
                      isMain={index === 0}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </Form.Item>

        <Form.Item className="mt-12">
          <Button
            color="primary"
            variant="outlined"
            style={{ backgroundColor: "#191919" }}
            htmlType="submit"
          >
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddOneProductForm;
