import useAuthStore from '@context/useAuthContext'
import React from 'react'
import { Link } from 'react-router'

const Home: React.FC = () => {
	const { user } = useAuthStore()

	return (
		<div className='home-page'>
			<div className='hero'>
				<h1>Welcome to Our App</h1>
				<p>A secure authentication system with user profiles</p>

				<div className='welcome-user'>
					<h2>Welcome back, {user?.name}!</h2>
					<p>
						<Link to='/profile' className='btn'>
							View Your Profile
						</Link>
					</p>
				</div>
			</div>

			<div className='features'>
				<div className='feature'>
					<h3>Secure Authentication</h3>
					<p>JWT-based authentication system for secure user sessions.</p>
				</div>
				<div className='feature'>
					<h3>User Profiles</h3>
					<p>Customizable user profiles with profile pictures and bio.</p>
				</div>
				<div className='feature'>
					<h3>Image Optimization</h3>
					<p>Automatic image compression for optimal performance.</p>
				</div>
			</div>
		</div>
	)
}

export default Home
