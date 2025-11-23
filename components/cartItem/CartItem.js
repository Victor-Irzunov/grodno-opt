// /components/cartItem/CartItem.jsx — ПОЛНОСТЬЮ
import Link from "next/link";
import { RiAddFill, RiSubtractFill } from "react-icons/ri";
import { transliterate } from "@/transliterate/transliterate";

function CartItem({ product, onDelete, onDecrement, onIncrement }) {
  console.log("🚀 🚀 🚀  _ CartItem _ product:", product);

  if (!product) {
    return null;
  }

  const handleDelete = () => {
    onDelete(product.id);
  };

  const handleDecrement = () => {
    onDecrement(product.id);
  };

  const handleIncrement = () => {
    onIncrement(product.id);
  };

  // Универсальный slug для категорий/названий (строго латиница)
  const slugify = (raw) => {
    if (!raw) return "";
    let s = transliterate(String(raw)).toLowerCase();
    s = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    s = s.replace(/&/g, " i ");
    s = s.replace(/[^a-z0-9]+/g, "-");
    s = s.replace(/-+/g, "-").replace(/^-|-$/g, "");
    return s;
  };

  // Собираем ссылку на страницу товара:
  // /catalog/{kategoriyaSlug}/{titleSlug}/{articleSlug}
  const buildProductUrl = (product) => {
    if (!product) return "#";

    // категория из product.category.title → displei
    const kategoriyaTitle =
      product.category?.title ||
      product.group?.category?.title ||
      "katalog";
    const kategoriyaSegment = slugify(kategoriyaTitle) || "katalog";

    // название товара → displei-dlya-xiaomi-redmi-note-12-4g-modul-chernii-oled
    const titleSegment = slugify(product.title) || "tovar";

    // артикул: строго латиница, нижний регистр, сохраняем дефисы/цифры
    const rawArticle = (product.article || "").toString();
    const articleSegment = rawArticle
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "");

    return `/catalog/${kategoriyaSegment}/${titleSegment}/${articleSegment}`;
  };

  const productUrl = buildProductUrl(product);

  return (
    <div className="flex flex-col xs:flex-row gap-6 border-b pb-3">
      <div className="w-full xs:w-[7rem] h-[7rem] rounded-lg overflow-hidden border border-gray-300">
        <img
          src={product.img ? product.img : "/svg/image-grey.svg"}
          alt={product.title || ""}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 mt-4 xs:mt-0">
        <h2 className="text-lg">
          <Link href={productUrl}>
            {product.title}
          </Link>
        </h2>

        <div className="flex items-center gap-3 mt-5">
          <button
            className="btn btn-xs text-red-500 uppercase btn-ghost font-light"
            onClick={handleDelete}
          >
            Удалить
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end mt-4 xs:mt-0">
        <strong className="text-2xl font-medium text-gray-800">
          {(product.price * product.quantity).toFixed(2)}$
        </strong>

        <div className="join pt-5">
          <button
            className="join-item btn btn-sm px-2 border border-gray-300"
            onClick={handleDecrement}
          >
            <RiSubtractFill fontSize={20} />
          </button>
          <button className="btn btn-sm px-4 join-item pointer-events-none bg-white border border-gray-300">
            {product.quantity}
          </button>
          <button
            className="join-item btn btn-sm px-2 border border-gray-300"
            onClick={handleIncrement}
          >
            <RiAddFill fontSize={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
