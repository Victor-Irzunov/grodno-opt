import Image from "next/image";
import TekushchieZakazy from "./TekushchieZakazy";
import IstoriyaZakazov from "./IstoriyaZakazov";
import LichnyeDannye from "./LichnyeDannye";
import LichnyjSchet from "./LichnyjSchet";

const items = [
  { src: '/svg/order.svg', text: 'Текущие заказы', page: 'TekushchieZakazy' },
  { src: '/svg/card.svg', text: 'Личный счёт', page: 'LichnyjSchet' },
  { src: '/svg/user3.svg', text: 'Личные данные', page: 'LichnyeDannye' },
  { src: '/svg/order2.svg', text: 'История заказов', page: 'IstoriyaZakazov' },
];

const MojKabinet = ({ setActiveComponent, setActiveTitle }) => {
  return (
    <div className='grid sd:grid-cols-2 xz:grid-cols-2 gap-4'>
      {items.map((item, index) => (
        <div
          onClick={() => {
            setActiveComponent(item.page)
            setActiveTitle(item.text)
          }}
          key={index}
          className='hover:bg-slate-50 hover-transition cursor-pointer border flex flex-col justify-center items-center rounded-sm hover:shadow-xl sd:p-8 xz:p-4'
        >
          <div>
            <Image src={item.src} alt={item.text} width={40} height={40} />
          </div>
          <div className='mt-4'>
            <p>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MojKabinet;
