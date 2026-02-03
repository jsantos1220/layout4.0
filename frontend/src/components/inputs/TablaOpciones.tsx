import { useEffect, useRef, useState } from 'react'
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from '@mui/material'
import { Opcion } from 'index'
import formatDate from '@utils/formatDate'

interface Column {
	id: 'opcion_id' | 'nombre' | 'created_at' | 'updated_at' | 'acciones'
	label: string
	minWidth?: number
	width?: number
	align?: 'right'
	format?: (value: any) => string
}

const columns: readonly Column[] = [
	{ id: 'opcion_id', label: 'ID', minWidth: 40, width: 40 },
	{ id: 'nombre', label: 'Nombre', minWidth: 170, width: 100 },
	{ id: 'created_at', label: 'Creado', minWidth: 100, format: formatDate, width: 100 },
	{
		id: 'updated_at',
		label: 'Actualizado',
		minWidth: 100,
		format: formatDate,
		width: 100,
	},
	{ id: 'acciones', label: 'Acciones', minWidth: 150, align: 'right', width: 100 },
]

interface TablaProps {
	rows: Opcion[]
	onEdit?: (row: Opcion) => void
	onDelete?: (row: Opcion) => void
}

export default function TablaOpciones({ rows, onEdit, onDelete }: TablaProps) {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(25)
	const [editingId, setEditingId] = useState<number | string | null>(null)
	const [editValue, setEditValue] = useState('')
	const [confirmDeleteId, setConfirmDeleteId] = useState<number | string | null>(null)
	const [deleteEnabled, setDeleteEnabled] = useState(false)
	const deleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Manejo de Escape global para cancelar confirmación de borrado
	useEffect(() => {
		if (confirmDeleteId !== null) {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					setConfirmDeleteId(null)
					setDeleteEnabled(false)
					if (deleteTimeoutRef.current) {
						clearTimeout(deleteTimeoutRef.current)
					}
				}
			}
			window.addEventListener('keydown', handleKeyDown)
			return () => {
				window.removeEventListener('keydown', handleKeyDown)
			}
		}
	}, [confirmDeleteId])

	// Limpieza del timeout al desmontar
	useEffect(() => {
		return () => {
			if (deleteTimeoutRef.current) {
				clearTimeout(deleteTimeoutRef.current)
			}
		}
	}, [])

	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value)
		setPage(0)
	}

	const handleStartEdit = (row: Opcion) => {
		setEditingId(row.opcion_id)
		setEditValue(row.nombre)
	}

	const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: Opcion) => {
		if (e.key === 'Enter') {
			if (editValue.trim() && editValue !== row.nombre) {
				onEdit?.({ ...row, nombre: editValue })
			}
			setEditingId(null)
		}
		if (e.key === 'Escape') {
			setEditingId(null)
		}
	}

	const handleEditBlur = () => {
		setEditingId(null)
	}

	// Manejo del botón borrar
	const handleDeleteClick = (row: Opcion) => {
		if (confirmDeleteId === row.opcion_id && deleteEnabled) {
			setConfirmDeleteId(null)
			setDeleteEnabled(false)
			onDelete?.(row)
			return
		}

		setConfirmDeleteId(row.opcion_id)
		setDeleteEnabled(false)

		if (deleteTimeoutRef.current) {
			clearTimeout(deleteTimeoutRef.current)
		}

		//Timeout para borrar
		deleteTimeoutRef.current = setTimeout(() => {
			setDeleteEnabled(true)
		}, 800)

		//Desactivar capacidad de borrar
		deleteTimeoutRef.current = setTimeout(() => {
			setConfirmDeleteId(null)
			setDeleteEnabled(false)
		}, 2500)
	}

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer sx={{ maxHeight: '70vh' }}>
				<Table stickyHeader aria-label='sticky table' className='tabla-taxonomia'>
					<TableHead>
						<TableRow>
							{columns.map(column => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{ minWidth: column.minWidth, width: column.width }}
									className={column.id}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map(row => (
								<TableRow hover role='checkbox' tabIndex={-1} key={row.opcion_id}>
									{columns.map(column => {
										if (column.id === 'acciones') {
											return (
												<TableCell key={column.id} align={column.align}>
													<button
														className='btn-borrar'
														onClick={() => handleDeleteClick(row)}
														disabled={
															confirmDeleteId === row.opcion_id &&
															!deleteEnabled
														}
													>
														{confirmDeleteId === row.opcion_id
															? deleteEnabled
																? '¿Seguro de borrar?'
																: '¿Seguro de borrar?'
															: 'Borrar'}
													</button>
												</TableCell>
											)
										}
										if (column.id === 'nombre') {
											return (
												<TableCell key={column.id} align={column.align}>
													{editingId === row.opcion_id ? (
														<input
															type='text'
															value={editValue}
															autoFocus
															onChange={e => setEditValue(e.target.value)}
															onKeyDown={e => handleEditKeyDown(e, row)}
															onBlur={handleEditBlur}
														/>
													) : (
														<span
															style={{ cursor: 'pointer' }}
															onClick={() => handleStartEdit(row)}
														>
															{row.nombre}
														</span>
													)}
												</TableCell>
											)
										}
										const value = row[column.id]
										return (
											<TableCell
												className={column.id}
												key={column.id}
												align={column.align}
											>
												{column.format ? column.format(value) : value}
											</TableCell>
										)
									})}
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				className='tabla-taxonomia'
				rowsPerPageOptions={[10, 25, 100]}
				component='div'
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	)
}
