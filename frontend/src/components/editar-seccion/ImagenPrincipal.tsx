import ImageFileInput from '@components/inputs/FileInput'
import { Seccion } from '@/index'
import pb from '@lib/pocketbase'

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
	const imagen_principal = pb.files.getURL(seccion, seccion?.imagen_principal)
	const placeholder = '../../../images/placeholder.jpg'

	return (
		<div className='cotenido-panel'>
			<div className='contenedor-imagen'>
				{seccion?.imagen_principal == '' ? (
					<img src={placeholder} alt='Imagen principal' />
				) : (
					<img
						src={imagen_principal == '' ? placeholder : imagen_principal}
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
