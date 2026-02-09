import { Seccion } from '@/index'
import pb from '@lib/pocketbase'

export function SeccionDragagle({ seccion }: { seccion: Seccion }) {
	const imagen_principal = pb.files.getURL(seccion, seccion?.imagen_principal)
	const placeholder = '../../../images/placeholder.jpg'

	return (
		<div className='seccion'>
			{seccion?.imagen_principal == '' ? (
				<img src={placeholder} alt='Imagen principal' />
			) : (
				<img
					src={imagen_principal == '' ? placeholder : imagen_principal}
					alt='Imagen principal'
				/>
			)}
		</div>
	)
}
