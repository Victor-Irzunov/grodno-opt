import FormOrder from "../Form/FormOrder";

const Modal = ({ selectedProduct, closeModal, isFormSubmitted, setIsFormSubmitted, index }) => {

	return (
		<dialog id={`my_modal_${index}`} className="modal">
			{!isFormSubmitted ?
				(
					<div className="modal-box bg-white">
						<p className="font-semibold text-black text-lg">{selectedProduct ? `${selectedProduct}` : 'Заказать звонок'}</p>
						<p className="py-1 mt-3 text-sm text-gray-600">
							Пожалуйста, заполните форму, и менеджер свяжется с вами в ближайшее время.
						</p>
						<form method="dialog">
							<button className="btn btn-lg btn-circle btn-ghost text-black absolute right-0 top-0">✕</button>
						</form>
						<FormOrder
							selectedProduct={selectedProduct}
							closeModal={closeModal}
							setIsFormSubmitted={setIsFormSubmitted}
							btn='Отправить'
						/>
					</div>
				)
				:
				(
					<div className="modal-box">
						<p className="text-xl">Ваш заказ успешно отправлен!</p>
					</div>
				)
			}
		</dialog>
	)
}

export default Modal;