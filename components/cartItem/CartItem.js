import Link from "next/link";
import { RiAddFill, RiSubtractFill } from "react-icons/ri";

function CartItem({ product, onDelete, onDecrement, onIncrement }) {
    console.log("🚀 🚀 🚀  _ CartItem _ product:", product)
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

    return (
        <div className="flex flex-col xs:flex-row gap-6 border-b pb-3">
            <div className="w-full xs:w-[7rem] h-[7rem] rounded-lg overflow-hidden border border-gray-300">
                <img src={`${product.img ? product.img : '/svg/image-grey.svg'}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-1 mt-4 xs:mt-0">
                <h2 className="text-lg">
                    <Link href='/'>
                        {product.title}
                    </Link>
                </h2>
               
                <div className="flex items-center gap-3 mt-5">
                    <button className="btn btn-xs text-red-500 uppercase btn-ghost font-light" onClick={handleDelete}>
                        Удалить
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-end mt-4 xs:mt-0">
                <strong className="text-2xl font-medium text-gray-800">
                    ${(product.price * product.quantity).toFixed(2)}
                </strong>
                
                <div className="join pt-5">
                    <button className="join-item btn btn-sm px-2 border border-gray-300" onClick={handleDecrement}>
                        <RiSubtractFill fontSize={20} />
                    </button>
                    <button className="btn btn-sm px-4 join-item pointer-events-none bg-white border border-gray-300">
                        {product.quantity}
                    </button>
                    <button className="join-item btn btn-sm px-2 border border-gray-300" onClick={handleIncrement}>
                        <RiAddFill fontSize={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
