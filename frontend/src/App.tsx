import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Proyectos from '@pages/proyectos/Proyectos'
import Proyecto from '@pages/proyectos/Proyecto'
import Secciones from '@pages/secciones/Secciones'
import Plantillas from '@pages/Plantillas'
import Clientes from '@pages/clientes/Clientes'
import NuevoProyecto from '@pages/proyectos/NuevoProyecto'
import Seccion from '@pages/secciones/Seccion'
import Categorias from '@pages/secciones/Categorias'
import Opciones from '@pages/secciones/Opciones'
import Cliente from '@pages/clientes/Cliente'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import theme from '@styles/theme'
import useAuthStore from '@context/useAuthContext'
import { useEffect } from 'react'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
		},
	},
})

export default function App() {
	//Asigna usuario en localstore a zustand
	const init = useAuthStore(s => s.init)

	useEffect(() => {
		init()
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<Router>
					<Routes>
						<Route path='/login' element={<Login />} />

						<Route element={<ProtectedRoute />}>
							<Route path='/' element={<Home />} />

							<Route path='/proyectos' element={<Proyectos />} />
							<Route path='/proyectos/:proyecto_id' element={<Proyecto />} />
							<Route path='/proyectos/nuevo' element={<NuevoProyecto />} />

							<Route path='/secciones' element={<Secciones />} />
							<Route path='/secciones/:seccion_id' element={<Seccion />} />
							<Route path='/categorias' element={<Categorias />} />
							<Route path='/opciones' element={<Opciones />} />

							<Route path='/clientes' element={<Clientes />} />
							<Route path='/clientes/:cliente_id' element={<Cliente />} />

							<Route path='/plantillas' element={<Plantillas />} />
						</Route>

						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
				</Router>
			</ThemeProvider>
		</QueryClientProvider>
	)
}
