// /components/CompAdmin/UpdateOneProductAdmin.jsx
import SearchProductForm from "../FormsAdmin/SearchProductForm";
import GetOneProductForm from "../FormsAdmin/GetOneProductForm"; // (оставляю импорт, если захочешь — можно удалить файл)
import UpdateOneProductForm from "../FormsAdmin/UpdateOneProductForm";
import { useState } from "react";

const UpdateOneProductAdmin = () => {
  const [product, setProduct] = useState(null);

  return (
    <div className="pt-10 px-12 text-white pb-20">
      <p className="text-3xl mb-16">Редактировать товар</p>

      {/* Новый быстрый поиск */}
      <SearchProductForm onPick={setProduct} />

      {/* Старую форму получения по одному ID можно скрыть или оставить ниже */}
      {/* <div className="mt-10">
        <GetOneProductForm />
      </div> */}

      <div className="mt-6">
        {product ? (
          <UpdateOneProductForm data={product} setProduct={setProduct} />
        ) : null}
      </div>
    </div>
  );
};

export default UpdateOneProductAdmin;
