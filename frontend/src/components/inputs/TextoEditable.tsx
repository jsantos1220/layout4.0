import { useEffect, useRef, useState } from 'react'

type TextoEditableType = {
	texto: string
	setTexto: React.Dispatch<React.SetStateAction<string>>
	size: number
}

export default function TextoEditable({ texto, setTexto, size }: TextoEditableType) {
	const [editarTitulo, setEditarTitulo] = useState(false)
	const input = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		if (editarTitulo) {
			input.current?.focus()

			const handleKeyUp = (e: KeyboardEvent) => {
				if (e.key === 'Escape' || e.key === 'Enter') {
					setEditarTitulo(false)
				}
			}

			const inputEl = input.current
			inputEl?.addEventListener('keyup', handleKeyUp)

			return () => {
				inputEl?.removeEventListener('keyup', handleKeyUp)
			}
		}
	}, [editarTitulo])

	return (
		<div className={`titulo-principal`}>
			{!editarTitulo ? (
				<span
					style={{ cursor: 'pointer' }}
					onClick={() => setEditarTitulo(!editarTitulo)}
				>
					{texto}
				</span>
			) : (
				<input
					type='text'
					ref={input}
					value={texto}
					style={{ fontSize: `${size}px`, border: 0, width: '100%' }}
					onBlur={() => setEditarTitulo(!editarTitulo)}
					onChange={e => setTexto(e.target.value)}
				/>
			)}
		</div>
	)
}
