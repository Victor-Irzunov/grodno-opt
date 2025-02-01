import React from 'react'
import AddOneProductForm from '../FormsAdmin/AddOneProductForm'

const AddOneProductAdmin = () => {
	return (
		<div className="pt-10 px-12 text-white pb-20">
			<p className='text-3xl mb-16'>
				Добавить Товар
			</p>

			<div className=''>
				<AddOneProductForm />
			</div>
		</div>
	)
}

export default AddOneProductAdmin