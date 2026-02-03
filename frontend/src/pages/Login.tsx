import { useNavigate } from 'react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
//import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import useAuthStore from '@context/useAuthContext'
import pb from '@lib/pocketbase'
import { Input } from '@styles/ui/Inputs'

/* 
   TODO: No se esta usando el validador de zod
*/
const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

type LoginForm = z.infer<typeof schema>

type FormData = {
	email: string
	password: string
}

export default function Login() {
	const navigate = useNavigate()
	const { user } = useAuthStore()

	useEffect(() => {
		if (user) {
			navigate('/')
		}
	}, [user, navigate])

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit: SubmitHandler<FormData> = async datos => {
		const { email, password } = datos
		try {
			await pb.collection('users').authWithPassword(email, password)
		} catch (error) {
			//console.log(error.status)
			setError('root', { message: 'Hubo un error en la autenticación' })
		}
	}

	return (
		<div className='auth-page'>
			<div className='left'>
				<div className='auth-container'>
					<img className='logo' src='../../images/logo.svg' alt='' />

					<h1>Log in</h1>

					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='form-group'>
							<label htmlFor='email'>Username or email *</label>
							<Input
								{...register('email', {
									required: 'Email is required',
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: 'Please enter a valid email',
									},
								})}
								placeholder='email@email.com'
								//type='email'
							/>
							{errors.email && <div className='error-message'>{errors.email.message}</div>}
						</div>

						<div className='form-group'>
							<label htmlFor='password'>Password</label>

							<Input
								{...register('password', {
									required: 'Password is required',
									minLength: {
										value: 8,
										message: 'Password must be at least 8 characters',
									},
								})}
								type='password'
								placeholder='Password'
							/>

							{errors.password && (
								<div className='error-message'>{errors.password.message}</div>
							)}
						</div>

						<button type='submit' className='btn btn-primary' disabled={isSubmitting}>
							{isSubmitting ? 'Logging in...' : 'Login'}
						</button>

						{errors.root && (
							<div className='error-message' style={{ marginTop: 10 }}>
								{errors.root.message}
							</div>
						)}
					</form>
				</div>
			</div>

			<div className='right'>{/*<img src='../../images/login-bg.jpg' alt='' />*/}</div>
		</div>
	)
}
