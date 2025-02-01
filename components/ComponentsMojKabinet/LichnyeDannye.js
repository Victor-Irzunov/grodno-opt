import { useContext } from 'react';
import { MyContext } from '@/contexts/MyContextProvider';
import FormLichnyeDannye from '../Form/FormLichnyeDannye';



const LichnyeDannye = () => {
	const { user } = useContext(MyContext);

  return (
    <div className='border rounded-sm sd:p-6 xz:p-4'>
      <FormLichnyeDannye user={user.userData} />
    </div>
  );
};

export default LichnyeDannye;
