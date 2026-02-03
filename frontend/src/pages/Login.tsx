import { useNavigate } from 'react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import authClient from '@lib/auth-client'

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

type LoginForm = z.infer<typeof schema>

export default function Login() {
	const navigate = useNavigate()
	const { data: session } = authClient.useSession()

	if (session) navigate('/dashboard')

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({
		defaultValues: {
			email: '',
		},
		resolver: zodResolver(schema),
	})

	const onSubmit: SubmitHandler<LoginForm> = async data => {
		try {
			const { data: _signinData, error } = await authClient.signIn.email({
				email: data.email, // required
				password: data.password,
				callbackURL: '/dashboard',
			})

			if (error) throw new Error(error.message)
		} catch (error) {
			//console.log(error)
			setError('root', {
				message: error.message,
			})
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
							<input {...register('email')} placeholder='email@email.com' type='email' />
							{errors.email && <div className='error-message'>{errors.email.message}</div>}
						</div>

						<div className='form-group'>
							<label htmlFor='password'>Password</label>

							<input {...register('password')} type='password' placeholder='Password' />

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
