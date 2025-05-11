"use client";
import { fetchExchangeRates } from '@/Api-bank/api';
import { GetGoogle, uploadPriceProduct } from '@/http/adminAPI';
import { Button, Form, message, Input, Select, Radio } from 'antd';
import { useEffect, useState } from 'react';


const AddProductPrice = ({ setData, data }) => {
	const [form] = Form.useForm();
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [rates, setRates] = useState(null);
	const [customRate, setCustomRate] = useState('');
	const [selectedCurrency, setSelectedCurrency] = useState('');


		useEffect(() => {
			async function fetchData() {
				const response = await GetGoogle();
				console.log("🚀 🚀 🚀  _ fetchData _ response:", response)
				setData(response.data);
			}
			fetchData();
		}, []);


		useEffect(() => {
			const loadRates = async () => {
				const fetchedRates = await fetchExchangeRates();
				setRates(fetchedRates);
			};
			loadRates();
		}, []);

		const onFinish = async () => {
			try {
				if (data.length && selectedCurrency) {
					setIsLoading(true);
					const response = await uploadPriceProduct({
						data,
						currency: selectedCurrency,
						exchangeRate: parseFloat(customRate),
					});

					if (response.success === false) {
						message.warning(response.message || 'Этот прайс уже был загружен ранее');
					} else {
						message.success('Прайс успешно загружен');
						setData(response);
						setCustomRate('')
					}
				} else {
					message.warning('Выберите валюту')
				}
			} catch (error) {
				console.error('Ошибка при загрузке прайса:', error);
				message.error(error.response?.data?.message || 'Ошибка при добавлении товара');
			} finally {
				setIsLoading(false);
			}
		};

		return (
			<div className='pl-10'>
				<div className='mb-11'>
					<p className="mb-2">Курсы валют Национального банка РБ</p>
					{rates ? (
						<ul className='text-sm text-white/70'>
							<li>Российский рубль (RUB): {rates.RUBtoUSD.toFixed(4)} USD</li>
							<li>Китайский юань (CNY): {rates.CNYtoUSD.toFixed(4)} USD</li>
							<li>Белорусский рубль (BYN): {rates.BYNtoUSD.toFixed(4)} USD</li>
						</ul>
					) : (
						<p>Загрузка...</p>
					)}
				</div>

				<Form
					form={form}
					name="addCategory"
					onFinish={onFinish}
					labelCol={{ span: 24 }}
					wrapperCol={{ span: 24 }}
				>


					<Form.Item
						label={<span style={{ color: 'white' }}
						>
							Выберите валюту
						</span>}
						rules={[{ required: true, message: 'Выберите валюту' }]}
					>
						<Radio.Group
							value={selectedCurrency}
							onChange={(e) => setSelectedCurrency(e.target.value)}
							style={{ width: '100%' }}
						>
							<Radio.Button style={{ backgroundColor: '#191919', color: selectedCurrency === "RUB" ? '#1777FF' : 'white' }} value="RUB">Российский рубль (RUB)</Radio.Button>
							<Radio.Button style={{ backgroundColor: '#191919', color: selectedCurrency === "CNY" ? '#1777FF' : 'white' }} value="CNY">Китайский юань (CNY)</Radio.Button>
							<Radio.Button style={{ backgroundColor: '#191919', color: selectedCurrency === "BYN" ? '#1777FF' : 'white' }} value="BYN">Белорусский рубль (BYN)</Radio.Button>
						</Radio.Group>
					</Form.Item>


					<Form.Item
						label={<span style={{ color: 'white' }}>Курс валюты</span>}
						rules={[{ required: true, message: 'Введите курс валюты' }]}
					>
						<Input
							type="number"
							value={customRate}
							onChange={(e) => setCustomRate(e.target.value)}
							style={{ backgroundColor: '#191919', color: 'white', width: '200px' }}
						/>
					</Form.Item>

					<Form.Item wrapperCol={{ span: 12 }}>
						<Button
							color="primary"
							variant="outlined"
							style={{ backgroundColor: '#191919' }}
							htmlType="submit"
							disabled={isLoading}
						>
							{isLoading ?
								<span className='text-white/80'>Загрузка ....</span>
								:
								'Загрузить прайс'
							}
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	};

	export default AddProductPrice;
