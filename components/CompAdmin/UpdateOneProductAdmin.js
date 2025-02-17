import GetOneProductForm from "../FormsAdmin/GetOneProductForm"
import UpdateOneProductForm from "../FormsAdmin/UpdateOneProductForm"


const UpdateOneProductAdmin = () => {
	return (
		<div className="pt-10 px-12 text-white pb-20">
			<p className='text-3xl mb-16'>
				Редактировать товар
			</p>

			<div className=''>
				<GetOneProductForm />
			</div>
		</div>
	)
}

export default UpdateOneProductAdmin