import { useDraggable } from '@dnd-kit/core'
import { Seccion } from '@/index'
import { SeccionDragagle } from './SeccionDragagle'

export function DraggableSidebar({ seccion }: { seccion: Seccion }) {
	const { attributes, listeners, setNodeRef } = useDraggable({
		id: seccion.draggable_id ?? seccion.id,
		data: {
			adicional: true,
		},
	})

	return (
		<div ref={setNodeRef} {...listeners} {...attributes} className='seccion-ordenable'>
			<SeccionDragagle seccion={seccion} />
		</div>
	)
}
