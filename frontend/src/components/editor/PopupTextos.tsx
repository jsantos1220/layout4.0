export default function PopupTextos() {
	return (
		<div>
			<div className='left'>
				<h2>Paginas</h2>

				<button>Home</button>
				<button>Quienes somos</button>
				<button>Nuestros servicios</button>
				<button>Contactos</button>

				<button>Header</button>
				<button>Footer</button>
			</div>

			<div className='right'>
				<h3>Hero 12</h3>

				<form action=''>
					<label htmlFor=''>Título</label>
					<input
						type='text'
						placeholder='Comprometidos con el crecimiento agrícola Dominicano'
					/>

					<label htmlFor=''>Subtítulo</label>
					<textarea
						name=''
						id=''
						placeholder='Este es un subtitulo de prueba para tener algo que mostrar'
					></textarea>
				</form>
			</div>
		</div>
	)
}
