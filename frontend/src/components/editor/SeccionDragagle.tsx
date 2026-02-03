import { Seccion } from 'index'

export function SeccionDragagle({ seccion }: { seccion: Seccion }) {
	return (
		<div className='seccion'>
			<img
				src={
					import.meta.env.VITE_BACKEND_URL + '/uploads/' + seccion.imagen_principal
				}
			/>
		</div>
	)
}
