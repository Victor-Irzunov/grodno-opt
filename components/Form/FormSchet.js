import { DatePicker, ConfigProvider, Button } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import locale from 'antd/locale/ru_RU';

const { RangePicker } = DatePicker;

const FormSchet = ({ onFilter, onReset, dateRange, setDateRange }) => {
  return (
    <ConfigProvider locale={locale}>
      <form className='flex sd:flex-row xz:flex-col sd:space-x-3 xz:space-x-0'>
        <RangePicker
          className='rounded-sm'
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          placeholder={['Дата от', 'Дата до']}
        />
        <div className='flex space-x-3 sd:mt-0 xz:mt-3 justify-end'>
          <Button type="primary" className='rounded-sm' onClick={onFilter}>
            Фильтр
          </Button>
          <Button className='rounded-sm' onClick={onReset}>
            Сброс
          </Button>
        </div>
      </form>
    </ConfigProvider>
  );
};

export default FormSchet;
