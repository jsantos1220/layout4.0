import { CircleX, CloudUpload } from 'lucide-react'
import React, { useRef } from 'react'

type ImageFileInputType = {
	nombre: string
	file: File | undefined
	setFile:
		| React.Dispatch<React.SetStateAction<File | undefined>>
		| ((imagen: File | undefined) => void)
}

export default function ImageFileInput({ nombre, file, setFile }: ImageFileInputType) {
	const inputRef = useRef<HTMLInputElement>(null)

	const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e?.target.files || e?.target.files.length === 0) {
			setFile(undefined)
			return
		}

		console.log(e.target.files[0])

		setFile(e.target.files[0])
	}

	const handleClear = () => {
		setFile(undefined)
		if (inputRef.current) {
			inputRef.current.value = ''
		}
	}

	const handleButtonClick = () => {
		if (inputRef.current) {
			inputRef.current.click() // Abrir el selector de archivos
		}
	}

	return (
		<div className='image-input'>
			{file && (
				<div className='img-preview'>
					<button className='cerrar' onClick={handleClear}>
						<CircleX />
					</button>

					<img src={URL.createObjectURL(file)} />
				</div>
			)}

			<button className='subir-archivo' onClick={handleButtonClick}>
				<CloudUpload /> Subir archivo
			</button>

			<input
				ref={inputRef}
				name={nombre}
				type='file'
				onChange={onSelectFile}
				accept='.jpg, .jpeg, .png, .webp, .svg'
				style={{ display: 'none' }}
			/>
		</div>
	)
}
