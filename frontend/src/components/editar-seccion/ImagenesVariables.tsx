import React from 'react'
import { Seccion } from 'index'
import ImageFileInput from '../inputs/FileInput'

type ImagenesVariablesType = {
	seccion: Seccion | undefined
	nuevaImagenAmarilla: File | undefined
	setNuevaImagenAmarilla: React.Dispatch<React.SetStateAction<File | undefined>>
	nuevaImagenRoja: File | undefined
	setNuevaImagenRoja: React.Dispatch<React.SetStateAction<File | undefined>>
	nuevaImagenVerde: File | undefined
	setNuevaImagenVerde: React.Dispatch<React.SetStateAction<File | undefined>>
}

export default function ImagenesVariables({
	seccion,
	nuevaImagenAmarilla,
	setNuevaImagenAmarilla,
	nuevaImagenRoja,
	setNuevaImagenRoja,
	nuevaImagenVerde,
	setNuevaImagenVerde,
}: ImagenesVariablesType) {
	const backendUrl = import.meta.env.VITE_BACKEND_URL

	return (
		<div className='cotenido-panel tres-columnas'>
			{/* tres columnas */}
			<div className='columna'>
				<div className='titulo'>Imagen amarilla</div>

				<div className='contenedor-imagen'>
					{seccion?.imagen_amarilla == '' ? (
						<img
							src={backendUrl + '/uploads/placeholder.jpg'}
							alt='Imagen principal'
						/>
					) : (
						<img
							src={backendUrl + '/uploads/' + seccion?.imagen_amarilla}
							alt='Imagen principal'
						/>
					)}
				</div>

				<div className='separador'></div>

				<div className='nueva-imagen'>
					<ImageFileInput
						nombre='imagen-amarilla'
						file={nuevaImagenAmarilla}
						setFile={setNuevaImagenAmarilla}
					/>
				</div>
			</div>

			{/* tres columnas */}
			<div className='columna'>
				<div className='titulo'>Imagen roja</div>

				<div className='contenedor-imagen'>
					{seccion?.imagen_roja == '' ? (
						<img
							src={backendUrl + '/uploads/placeholder.jpg'}
							alt='Imagen principal'
						/>
					) : (
						<img
							src={backendUrl + '/uploads/' + seccion?.imagen_roja}
							alt='Imagen principal'
						/>
					)}
				</div>

				<div className='separador'></div>

				<div className='nueva-imagen'>
					<ImageFileInput
						nombre='imagen-principal'
						file={nuevaImagenRoja}
						setFile={setNuevaImagenRoja}
					/>
				</div>
			</div>

			{/* tres columnas */}
			<div className='columna'>
				<div className='titulo'>Imagen verde</div>

				<div className='contenedor-imagen'>
					{seccion?.imagen_verde == '' ? (
						<img
							src={backendUrl + '/uploads/placeholder.jpg'}
							alt='Imagen principal'
						/>
					) : (
						<img
							src={backendUrl + '/uploads/' + seccion?.imagen_verde}
							alt='Imagen principal'
						/>
					)}
				</div>

				<div className='separador'></div>

				<div className='nueva-imagen'>
					<ImageFileInput
						nombre='imagen-principal'
						file={nuevaImagenVerde}
						setFile={setNuevaImagenVerde}
					/>
				</div>
			</div>
		</div>
	)
}
