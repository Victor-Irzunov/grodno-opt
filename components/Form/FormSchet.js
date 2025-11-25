import { DatePicker, ConfigProvider, Button } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import locale from 'antd/locale/ru_RU';

const { RangePicker } = DatePicker;

const FormSchet = ({ onFilter, onReset, dateRange, setDateRange }) => {
  return (
    <ConfigProvider locale={locale}>
      <form className='flex sd:flex-row xz:flex-col sd:space-x-4 xz:space-x-1'>
        <RangePicker
          className='rounded-sm mx-1'
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          placeholder={['Дата от', 'Дата до']}
        />
        <div className='flex sd:mt-0 xz:mt-3 sd:ml-1.5 xz:ml-0'>
          <Button type="primary" className='rounded-sm' onClick={onFilter}>
            Фильтр
          </Button>
          <div className='mx-1'/>
          <Button className='rounded-sm' onClick={onReset}>
            Сброс
          </Button>
        </div>
      </form>
    </ConfigProvider>
  );
};

export default FormSchet;
