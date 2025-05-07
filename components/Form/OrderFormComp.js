import { forwardRef } from "react"
import FormOrderKorzina2 from "./FormOrderKorzina2"


const OrderFormComp = forwardRef((props, ref) => {

	return (
		<div ref={ref} className="rounded-lg border border-gray-300 p-4 bg-white flex flex-col gap-3 mb-32">
			<FormOrderKorzina2 data={props.data} user={props.user} setData={props.setData} setIsActive={props.setIsActive} />
		</div>
	)
})


export default OrderFormComp