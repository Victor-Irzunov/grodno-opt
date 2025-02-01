"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Popconfirm, Upload, Radio, Checkbox, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Resizer from "react-image-file-resizer";
import { DataCar } from '@/constans/CarData';
import { carOptions } from '@/constans/carOptions';
import { optionLabels } from '@/constans/optionLabels';
import { dollarExchangeRate } from '@/Api-bank/api';
import { updateOneCar } from "@/http/adminAPI";
import { transliterate } from "@/transliterate/transliterate";
import { deleteOneCar } from "@/http/adminAPI";

// Настройки полей формы
const engineOptions = ['Бензин', 'Дизель', 'Газ', 'Электро'];
const transmissionOptions = ['Автомат', 'Механика'];
const bodyTypeOptions = ['Седан', 'Универсал', 'Внедорожник', 'Минивэн', 'Хэтчбек', 'Микроавтобус', 'Купе', 'Кабриолет', 'Пикап', 'Другое'];
const driveOptions = ['Передний привод', 'Задний привод', 'Полный привод'];
const engineCapacityOptions = Array.from({ length: 81 }, (_, i) => `${(i + 10) / 10}л`);

const { TextArea } = Input;
const { Option } = Select;

const resizeFile = (file, width, height, quality = 60) =>
	new Promise((resolve, reject) => {
		// Проверка на наличие файла и соответствие типу File или Blob
		if (!(file instanceof Blob || file instanceof File)) {
			reject(new Error("Invalid file type"));
			return;
		}

		Resizer.imageFileResizer(
			file,
			width,
			height,
			"WEBP",
			quality,
			0,
			async (uri) => {
				try {
					const res = await fetch(uri);
					const blob = await res.blob();
					const resizedFile = new File([blob], file.name, { type: "image/webp" });
					resolve(resizedFile);
				} catch (error) {
					reject(error);
				}
			},
			"base64"
		);
	});

const EditCarForm = ({ carData, setProduct }) => {
	console.log("🚀 🚀 🚀  _ EditCarForm _ carData:", carData)
	const [form] = Form.useForm();
	const [imageList, setImageList] = useState([]);

	const [dollar, setDollar] = useState(null);
	const [selectedBrand, setSelectedBrand] = useState(null);
	const [selectedModel, setSelectedModel] = useState(null);
	const [selectedGeneration, setSelectedGeneration] = useState(null);

	// Запрос курса доллара
	useEffect(() => {
		dollarExchangeRate().then(data => {
			setDollar(data.data.Cur_OfficialRate);
		});
	}, []);

	useEffect(() => {
		if (carData) {
			const parsedImages = typeof carData.images === "string" ? JSON.parse(carData.images) : carData.images || [];
			const imagesWithUID = parsedImages.map((image, index) => ({
				...image,
				uid: image.uid || `__AUTO__${Date.now()}_${index}__`
			}));

			setImageList(imagesWithUID);

			const brandObj = DataCar.find(brand => brand.brand === carData.brand.name);
			setSelectedBrand(brandObj ? brandObj.id : null);

			const modelObj = brandObj ? brandObj.type.find(model => model.model === carData.model.name) : null;
			setSelectedModel(modelObj ? modelObj.id : null);

			const generation = modelObj && modelObj.generations.includes(carData.generation.name)
				? carData.generation.name
				: null;
			setSelectedGeneration(generation);

			form.setFieldsValue({
				...carData,
				brand: brandObj ? brandObj.id : null,
				model: modelObj ? modelObj.id : null,
				generation: generation,
				priceBYN: carData.priceUSD * dollar,
			});
		}
	}, [carData, dollar, form]);


	const handleRemoveImage = (id) => {
		setImageList((prevList) => {
			const updatedList = prevList.filter((file) => file.uid !== id);
			return updatedList;
		});
	};


	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (active.id !== over.id) {
			setImageList((prevList) => {
				const oldIndex = prevList.findIndex((file) => file.uid === active.id);
				const newIndex = prevList.findIndex((file) => file.uid === over.id);
				const newList = arrayMove(prevList, oldIndex, newIndex);
				return newList;
			});
		}
	};

	const handleImageUpload = async ({ fileList }) => {
		const processedImages = await Promise.all(
			fileList.map(async (file) => {
				if (file.originFileObj || file instanceof File) {
					const original = await resizeFile(file.originFileObj || file, 1280, 720, 70);
					const thumbnail = await resizeFile(file.originFileObj || file, 300, 169, 85);
					return { original, thumbnail, uid: file.uid };
				}
				return file;
			})
		);
		setImageList(processedImages);
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

		// Проверка: если image — это строка URL (blob), используем её напрямую, иначе добавляем статический путь
		const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;

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

	const handleBrandChange = (brandId) => {
		setSelectedBrand(brandId);
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
		console.log("🚀 🚀 🚀  _ onFinish _ values:", values);
		console.log("🚀 🚀 🚀  _ EditCarForm _ imageList:", imageList);

		const formData = new FormData();
		const titleLink = transliterate(values.title).replace(/\s+/g, '-').toLowerCase();
		formData.append('titleLink', titleLink);
		formData.append('carId', carData.id);

		Object.entries(values).forEach(([key, value]) => {
			formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
		});

		const priceBYN = parseFloat(values.priceUSD) * dollar;
		formData.append('priceBYN', priceBYN);

		// Разделяем изображения на существующие и новые
		const existingImages = imageList.filter(
			(file) => typeof file.original === 'string' && typeof file.thumbnail === 'string'
		);

		const newImages = imageList.filter(
			(file) => file.original instanceof File && file.thumbnail instanceof File
		);

		// Передаем существующие изображения в виде JSON строки
		if (existingImages.length > 0) {
			formData.append('existingImages', JSON.stringify(existingImages));
		}

		// Добавляем только новые изображения по одному, избегая дублирования
		newImages.forEach((file) => {
			formData.append('originalImages', file.original);
			formData.append('thumbnailImages', file.thumbnail);
		});

		try {
			const response = await updateOneCar(formData);
			message.success("Автомобиль успешно отредактирован!");
			form.resetFields();
			setImageList([]);
		} catch (error) {
			console.error("Ошибка при изменении автомобиля:", error);
			message.error("Ошибка при изменении автомобиля");
		}
	};


	const handleDeleteCar = async () => {
		try {
			await deleteOneCar(carData.id).then(data => {
				if (data) {
					message.success(`Автомобиль ${carData.title} успешно удален!`);
					form.resetFields();
					setImageList([]);
					setProduct({});
				}
			})
		} catch (error) {
			console.error("Ошибка при удалении автомобиля:", error);
			message.error("Ошибка при удалении автомобиля");
		}
	};


	const cancel = (e) => {
		message.error('Отмена удаления!');
	};


	return (
		<div className="pt-3">
			<p className="text-right mb-3 text-xs">
				Курс доллара НБ РБ на сегодня: {dollar}р.
			</p>

			<Form
				form={form}
				name="editCar"
				onFinish={onFinish}
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 24 }}
				initialValues={{
					...carData,
					brand: carData.brand.id,
					model: carData.model.id,
					generation: carData.generation.id,
					priceBYN: carData.priceUSD * dollar,
				}}
			>

				<Form.Item name="vip" label="VIP" valuePropName="checked">
					<Checkbox>VIP</Checkbox>
				</Form.Item>

				<Form.Item name="brand" label="Марка" rules={[{ required: true, message: 'Выберите марку' }]}>
					<Select placeholder="Выберите марку" onChange={handleBrandChange} value={selectedBrand}>
						{DataCar.map((brand) => (
							<Option key={brand.id} value={brand.id}>{brand.brand}</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name="model" label="Модель" rules={[{ required: true, message: 'Выберите модель' }]}>
					<Select placeholder="Выберите модель" onChange={handleModelChange} disabled={!selectedBrand}>
						{(DataCar.find((brand) => brand.id === selectedBrand)?.type || []).map((model) => (
							<Option key={model.id} value={model.id}>{model.model}</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name="generation" label="Поколение">
					<Select
						placeholder="Выберите поколение"
						disabled={!selectedModel}
						onChange={handleGenerationChange}
						value={selectedGeneration}
					>
						{(DataCar.find((brand) => brand.id === selectedBrand)?.type.find((model) => model.id === selectedModel)?.generations || []).map((generation) => (
							<Option key={generation} value={generation}>{generation}</Option>
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

				{/* Checkbox */}
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
										image={
											file.original instanceof File
												? URL.createObjectURL(file.original)
												: `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${file.original}`
										}
										onRemove={handleRemoveImage}
										isMain={index === 0}
									/>
								))}
							</div>
						</SortableContext>
					</DndContext>
				</Form.Item>


				<Form.Item>
					<Button type="primary" htmlType="submit">
						Сохранить
					</Button>
				</Form.Item>
			</Form>

			<div className='flex justify-end'>
				<Popconfirm
					title={`Удаление ${carData.title}`}
					description="Вы действительно хотите удалить?"
					onConfirm={handleDeleteCar}
					onCancel={cancel}
					okText="Да"
					cancelText="Нет"
				>
					<Button type="link" danger>
						Удалить {carData.title}
					</Button>
				</Popconfirm>
			</div>
		</div>
	);
};

export default EditCarForm;
