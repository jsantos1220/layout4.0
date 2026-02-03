import Dialog from '@mui/material/Dialog'
import { X } from 'lucide-react'
import { JSX } from 'react'

export type DialogsType = {
	open: boolean
	content: JSX.Element | null
	handleClose: () => void
}

export default function Dialogs({ open, handleClose, content }: DialogsType) {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			scroll={'paper'}
			fullWidth={true}
			maxWidth={'md'}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
			className='lightbox'
		>
			<button onClick={handleClose} className='boton-cerrar'>
				<X />
			</button>

			{content}
		</Dialog>
	)
}
