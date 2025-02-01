import { DatePicker, ConfigProvider, Button, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/ru';
import locale from 'antd/lib/locale/ru_RU';

moment.locale('ru');

const { RangePicker } = DatePicker;

const FormSchet = () => {
	const handleReset = () => {
		// Логика для сброса значений формы
		console.log('Сброс формы');
	};

	const handleFilter = () => {
		// Логика для фильтрации данных
		console.log('Фильтрация данных');
	};

	return (
		<ConfigProvider locale={locale}>
			<form className='flex sd:flex-row xz:flex-col sd:space-x-3 xz:space-x-0'>
				<RangePicker className='rounded-sm' placeholder={['Дата от', 'Дата до']} />
				<div className='flex space-x-3 sd:mt-0 xz:mt-3 justify-end'>
					<Button type="primary" className='rounded-sm' onClick={handleFilter}>Фильтр</Button>
					<Button className='rounded-sm' onClick={handleReset}>Сброс</Button>
				</div>
			</form>
		</ConfigProvider>
	);
}

export default FormSchet;
