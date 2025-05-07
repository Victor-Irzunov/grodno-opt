import AddBalance from "../FormsAdmin/AddBalance"

const BalanceAdmin = () => {
	return (
		<div className="pt-10 px-12 text-white pb-28">
			<p className='text-3xl mb-16 text-primary'>
				Пополнение баланса клиента
			</p>
			<AddBalance />
		</div>
	)
}

export default BalanceAdmin
