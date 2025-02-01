"use client";
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Upload, Radio, Checkbox, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createCar } from '@/http/adminAPI';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Resizer from "react-image-file-resizer";
import { DataCar } from '@/constans/CarData';
import { carOptions } from '@/constans/carOptions';
import { optionLabels } from '@/constans/optionLabels';
import { transliterate } from '@/transliterate/transliterate';
import { dollarExchangeRate } from '@/Api-bank/api';

const { TextArea } = Input;
const { Option } = Select;

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
        const resizedFile = new File([blob], file.name, { type: "image/webp" });
        resolve(resizedFile);
      },
      "base64"
    );
  });

const engineOptions = ['Бензин', 'Дизель', 'Газ', 'Электро'];
const transmissionOptions = ['Автомат', 'Механика'];
const bodyTypeOptions = ['Седан', 'Универсал', 'Внедорожник', 'Минивэн', 'Хэтчбек', 'Микроавтобус', 'Купе', 'Кабриолет', 'Пикап', 'Другое'];
const driveOptions = ['Передний привод', 'Задний привод', 'Полный привод'];
const engineCapacityOptions = Array.from({ length: 81 }, (_, i) => `${(i + 10) / 10}л`);

const CreateCarForm = () => {
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [dollar, setDollar] = useState(null);

  useEffect(() => {
    dollarExchangeRate().then(data => {
      setDollar(data.data.Cur_OfficialRate);
    });
  }, []);

  const handleRemoveImage = (id) => setImageList((prevList) => prevList.filter((file) => file.uid !== id));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImageList((prevList) => {
        const oldIndex = prevList.findIndex((file) => file.uid === active.id);
        const newIndex = prevList.findIndex((file) => file.uid === over.id);
        return arrayMove(prevList, oldIndex, newIndex);
      });
    }
  };

  const SortableImage = ({ id, image, onRemove, isMain }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const handleDelete = (e) => {
      e.stopPropagation();
      onRemove(id);
    };

    const imageUrl = image.original instanceof File ? URL.createObjectURL(image.original) : null;

    return (
      <div className="sd:mr-2 xz:mr-1 relative">
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="sortable-image-item mt-4 relative">
          {imageUrl ? (
            <img src={imageUrl} alt="upload" className="sd:w-24 xz:w-16" />
          ) : (
            <span>Ошибка загрузки изображения</span>
          )}
          {isMain && (
            <div className="absolute top-0.5 left-0.5 bg-green-600 bg-opacity-60 p-0.5 rounded flex items-center">
              <img src="/svg/scraper.svg" alt="scraper icon" className="w-3 h-3 mr-1" />
              <span className="text-[10px] text-white">Главное</span>
            </div>
          )}
        </div>
        <button type="link" onClick={handleDelete} className="text-xs text-red-500">Удалить</button>
      </div>
    );
  };

  const handleImageUpload = async ({ fileList }) => {
    const processedImages = await Promise.all(
      fileList.map(async (file) => {
        if (file.originFileObj || file instanceof File) {
          const original = await resizeFile(file.originFileObj || file, 1280, 720, 70);
          const thumbnail = await resizeFile(file.originFileObj || file, 300, 169, 85);
          return { original, thumbnail, uid: file.uid };
        } else {
          return file;
        }
      })
    );

    setImageList(processedImages);
  };

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    setSelectedModel(null);
    setSelectedGeneration(null);
    form.setFieldsValue({ model: undefined, generation: undefined });
  };

  const handleModelChange = (value) => {
    setSelectedModel(value);
    form.setFieldsValue({ generation: undefined });
  };

  const handleGenerationChange = (value) => {
    setSelectedGeneration(value);
  };

  const onFinish = async (values) => {
    const preparedValues = { ...values };
    ['climate', 'safety', 'airbags', 'assistance', 'exterior', 'interior', 'lights', 'heating', 'multimedia', 'comfort'].forEach((field) => {
      preparedValues[field] = preparedValues[field] || [];
    });

    const formData = new FormData();
    const titleLink = transliterate(values.title).replace(/\s+/g, '-').toLowerCase();
    formData.append('titleLink', titleLink);

    Object.entries(preparedValues).forEach(([key, value]) => {
      formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
    });

    const priceUSD = parseFloat(values.priceUSD);
    const priceBYN = priceUSD * dollar;
    formData.append('priceBYN', priceBYN);

    if (imageList.length > 0) {
      imageList.forEach((file) => {
        if (file.original instanceof File && file.thumbnail instanceof File) {
          formData.append('originalImages', file.original);
          formData.append('thumbnailImages', file.thumbnail);
        }
      });
    }

    try {
      const response = await createCar(formData);
      message.success("Автомобиль успешно добавлен");
      form.resetFields();
      setImageList([]);
    } catch (error) {
      console.error("Ошибка при добавлении автомобиля:", error);
      message.error("Ошибка при добавлении автомобиля");
    }
  };

  return (
    <div className='pt-3'>
      <p className='text-right mb-3 text-xs'>
        Курс доллара НБ РБ на сегодня: {dollar}р.
      </p>

      <Form form={form} name="createCar" onFinish={onFinish} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>

        <Form.Item name="vip" label="Приоритет" valuePropName="checked">
          <Checkbox>VIP</Checkbox>
        </Form.Item>

        <Form.Item name="brand" label="Марка" rules={[{ required: true, message: 'Выберите марку' }]}>
          <Select placeholder="Выберите марку" onChange={handleBrandChange}>
            {DataCar.map((brand) => (
              <Option key={brand.id} value={brand.brand}>{brand.brand}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="model" label="Модель" rules={[{ required: true, message: 'Выберите модель' }]}>
          <Select placeholder="Выберите модель" onChange={handleModelChange} disabled={!selectedBrand}>
            {selectedBrand && DataCar.find((brand) => brand.brand === selectedBrand).type.map((model) => (
              <Option key={model.id} value={model.model}>{model.model}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="generation" label="Поколение">
          <Select placeholder="Выберите поколение" disabled={!selectedModel} onChange={handleGenerationChange}>
            {selectedModel &&
              DataCar.find((brand) => brand.brand === selectedBrand)
                .type.find((model) => model.model === selectedModel)
                .generations.map((generation, index) => (
                  <Option key={index} value={generation}>{generation}</Option>
                ))}
          </Select>
        </Form.Item>


        <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название автомобиля' }]}>
          <Input placeholder="Lada (ВАЗ) 2121 Нива I" />
        </Form.Item>

        <Form.Item name="priceUSD" label="Цена (USD)" rules={[{ required: true, message: 'Введите цену в USD' }]}>
          <Input placeholder="3000" />
        </Form.Item>

        <Form.Item name="mileage" label="Пробег" rules={[{ required: true, message: 'Введите пробег' }]}>
          <Input placeholder="75500" />
        </Form.Item>

        <Form.Item name="year" label="Год" rules={[{ required: true, message: 'Введите год выпуска' }]}>
          <Select placeholder="Выберите год">
            {Array.from({ length: 30 }, (_, i) => {
              const year = 2024 - i;
              return <Select.Option key={year} value={year}>{year}</Select.Option>;
            })}
          </Select>
        </Form.Item>

        <Form.Item name="engine" label="Двигатель" rules={[{ required: true, message: 'Выберите тип двигателя' }]}>
          <Radio.Group optionType="button" buttonStyle="solid">
            {engineOptions.map((option) => (
              <Radio.Button key={option} value={option}>{option}</Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="transmission" label="Коробка передач" rules={[{ required: true, message: 'Выберите коробку передач' }]}>
          <Radio.Group optionType="button" buttonStyle="solid">
            {transmissionOptions.map((option) => (
              <Radio.Button key={option} value={option}>{option}</Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="engineCapacity" label="Объём двигателя" rules={[{ required: true, message: 'Выберите объём двигателя' }]}>
          <Select placeholder="Выберите объём двигателя">
            {engineCapacityOptions.map((option) => (
              <Select.Option key={option} value={option}>{option}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="bodyType" label="Тип кузова" rules={[{ required: true, message: 'Выберите тип кузова' }]}>
          <Radio.Group optionType="button" buttonStyle="solid">
            {bodyTypeOptions.map((option) => (
              <Radio.Button key={option} value={option}>{option}</Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="drive" label="Привод" rules={[{ required: true, message: 'Выберите тип привода' }]}>
          <Radio.Group optionType="button" buttonStyle="solid">
            {driveOptions.map((option) => (
              <Radio.Button key={option} value={option}>{option}</Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="salon" label="Салон" rules={[{ required: true, message: 'Выберите тип салона' }]}>
          <Radio.Group optionType="button" buttonStyle="solid">
            {carOptions.salon.map((option) => (
              <Radio.Button key={option} value={option}>{option}</Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="material" label="Материал салона" rules={[{ required: true, message: 'Выберите материал салона' }]}>
          <Radio.Group optionType="button" buttonStyle="solid">
            {carOptions.material.map((option) => (
              <Radio.Button key={option} value={option}>{option}</Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <TextArea rows={4} placeholder="Описание автомобиля" />
        </Form.Item>



        {/* Checkbox для доп. опций */}
        {Object.keys(carOptions).filter(key => !['salon', 'material'].includes(key)).map((optionKey) => (
          <Form.Item key={optionKey} name={optionKey} label={optionLabels[optionKey]}>
            <Checkbox.Group
              options={carOptions[optionKey].map((option) => ({ label: option, value: option }))}
              style={{ display: 'flex', flexDirection: 'column' }}
            />
          </Form.Item>
        ))}

        <Form.Item label="Изображения" name="images">
          <Upload
            accept="image/*"
            multiple
            beforeUpload={() => false}
            onChange={handleImageUpload}
            fileList={imageList}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Загрузить изображения</Button>
          </Upload>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={imageList.map((file) => file.uid)} strategy={verticalListSortingStrategy}>
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
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button type="primary" htmlType="submit">Сохранить</Button>
        </Form.Item>
      </Form>

    </div>
  );
};

export default CreateCarForm;
