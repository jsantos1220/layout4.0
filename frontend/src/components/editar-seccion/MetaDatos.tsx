import { Seccion } from '@/index'
import InputSwitch from '../inputs/InputSwitch'

type MetadatosType = {
	seccion: Seccion | undefined
	setSeccion: React.Dispatch<React.SetStateAction<Seccion | undefined>>
}

export default function MetaDatos({ seccion, setSeccion }: MetadatosType) {
	return (
		<div className='cotenido-panel'>
			<div className='meta-dato'>
				<div className='doble-label'>
					<h4>Imagen de background</h4>
					<p>La sección cuenta con imagen de fondo</p>
				</div>

				<InputSwitch
					name='imagen-background'
					onChange={e =>
						setSeccion(seccion => {
							if (!seccion) return
							const imagen_background = e.target.checked
							return { ...seccion, imagen_background }
						})
					}
					checked={seccion?.imagen_background}
				/>
			</div>

			<div className='meta-dato'>
				<div className='doble-label'>
					<h4>Título principal</h4>
					<p>Título de entre 20 y 70 caracteres</p>
				</div>

				<InputSwitch
					name='titulo-principal'
					onChange={e =>
						setSeccion(seccion => {
							if (!seccion) return
							const titulo = e.target.checked
							return { ...seccion, titulo }
						})
					}
					checked={seccion?.titulo}
				/>
			</div>

			<div className='meta-dato'>
				<div className='doble-label'>
					<h4>Sub título</h4>
					<p>Sub título de entre 20 a 120 caracteres</p>
				</div>

				<InputSwitch
					name='sub-titulo'
					onChange={e =>
						setSeccion(seccion => {
							if (!seccion) return
							const subtitulo = e.target.checked
							return { ...seccion, subtitulo }
						})
					}
					checked={seccion?.subtitulo}
				/>
			</div>

			<div className='meta-dato'>
				<div className='doble-label'>
					<h4>Descripción</h4>
					<p>Párrafo que puede tener de 2 a 5 líneas</p>
				</div>

				<InputSwitch
					name='descripcion'
					onChange={e =>
						setSeccion(seccion => {
							if (!seccion) return
							const descripcion = e.target.checked
							return { ...seccion, descripcion }
						})
					}
					checked={seccion?.descripcion}
				/>
			</div>

			<div className='meta-dato'>
				<div className='doble-label'>
					<h4>Call to Action</h4>
					<p>Texto del botón de llamado a la acción</p>
				</div>

				<InputSwitch
					name='cta'
					onChange={e =>
						setSeccion(seccion => {
							if (!seccion) return
							const cta = e.target.checked
							return { ...seccion, cta }
						})
					}
					checked={seccion?.cta}
				/>
			</div>

			<div className='meta-dato'>
				<div className='doble-label'>
					<h4>Items</h4>
					<p>Cada Item tiene una imagen, título, sub título y una descripción</p>
				</div>

				<input
					name='items'
					type='number'
					value={seccion?.items ?? 0}
					onChange={e =>
						setSeccion(seccion => {
							if (!seccion) return
							const items = +e.target.value
							return { ...seccion, items }
						})
					}
				/>
			</div>
		</div>
	)
}
