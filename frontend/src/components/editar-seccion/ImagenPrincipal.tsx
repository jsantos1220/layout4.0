import ImageFileInput from '@components/inputs/FileInput'
import { Seccion } from 'index'

type ImagenPrincipalType = {
	seccion: Seccion | undefined
	nuevaImagenPrincipal: File | undefined
	setNuevaImagenPrincipal: React.Dispatch<React.SetStateAction<File | undefined>>
}

export default function ImagenPrincipal({
	seccion,
	nuevaImagenPrincipal,
	setNuevaImagenPrincipal,
}: ImagenPrincipalType) {
	const backendUrl = import.meta.env.VITE_BACKEND_URL

	return (
		<div className='cotenido-panel'>
			<div className='contenedor-imagen'>
				{seccion?.imagen_principal == '' ? (
					<img
						src={backendUrl + '/uploads/placeholder.jpg'}
						alt='Imagen principal'
					/>
				) : (
					<img
						src={backendUrl + '/uploads/' + seccion?.imagen_principal}
						alt='Imagen principal'
					/>
				)}
			</div>

			{/*<button className='borrar'>
				<Trash2 />
				Borrar
			</button>*/}

			<div className='separador'></div>

			<div className='nueva-imagen'>
				<p>Tamaño ideal de la imagen es de 1920px </p>

				<ImageFileInput
					nombre='imagen-principal'
					file={nuevaImagenPrincipal}
					setFile={setNuevaImagenPrincipal}
				/>
			</div>
		</div>
	)
}
