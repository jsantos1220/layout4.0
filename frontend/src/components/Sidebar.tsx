import useAuthStore from '@context/useAuthContext'
import {
	ArrowUpNarrowWide,
	ArrowUpWideNarrow,
	GalleryVertical,
	House,
	LayoutPanelLeft,
	LogOut,
	Users,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router'

export default function Sidebar() {
	const navigate = useNavigate()

	const { logout } = useAuthStore()

	const handleLogout = async () => {
		logout()
		navigate('/login')
	}

	return (
		<nav className='sidebar'>
			<div className='upper'>
				<Link to='/' className='logo'>
					<img src='../../images/menu-logo.svg' alt='Home' />
				</Link>

				<div className='menu'>
					<div className='item'>
						<Link to='/proyectos' className=''>
							<House />
						</Link>

						<div className='popover'>
							<p>Proyectos</p>
						</div>
					</div>

					<div className='item'>
						<Link to='/secciones' className=''>
							<GalleryVertical />
						</Link>

						<div className='popover'>
							<p>Secciones</p>

							<div className='group-link'>
								<Link to='/categorias'>
									<ArrowUpWideNarrow style={{ marginRight: '10px' }} /> Categorías
								</Link>
								<Link to='/opciones'>
									<ArrowUpNarrowWide style={{ marginRight: '10px' }} /> Opciones
								</Link>
							</div>
						</div>
					</div>

					<div className='item'>
						<Link to='/plantillas' className=''>
							<LayoutPanelLeft />
						</Link>

						<div className='popover'>
							<p>Plantillas</p>
						</div>
					</div>

					<div className='item'>
						<Link to='/clientes' className=''>
							<Users />
						</Link>

						<div className='popover'>
							<p>Clientes</p>
						</div>
					</div>
				</div>
			</div>

			<div className='logout'>
				<button onClick={handleLogout}>
					<LogOut />
				</button>
			</div>
		</nav>
	)
}
