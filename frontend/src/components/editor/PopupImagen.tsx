import ImageFileInput from '@components/inputs/FileInput'
import useProjectContext from '@context/useProjectContext'
import pb from '@lib/pocketbase'

export default function PopupImagen() {
	const backendUrl = import.meta.env.VITE_BACKEND_URL
	const { proyecto, nuevaImagen, setNuevaImagen } = useProjectContext()

	pb.files.getURL(proyecto, proyecto?.imagen)

	return (
		<div>
			<div className='contenedor-imagen'>
				{proyecto?.imagen == '' ? (
					<img src={backendUrl + '/uploads/placeholder.jpg'} alt='Imagen principal' />
				) : (
					<img src={pb.files.getURL(proyecto, proyecto?.imagen)} alt='Imagen principal' />
				)}
			</div>
			<div className='separador'></div>

			<div className='nueva-imagen'>
				<p>Tamaño ideal de la imagen es de 1920px </p>

				<ImageFileInput nombre='imagen-principal' file={nuevaImagen} setFile={setNuevaImagen} />
			</div>
		</div>
	)
}
