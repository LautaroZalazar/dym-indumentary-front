import { useState } from 'react';
import lock from '@/assets/SVG/lock.svg';
import email from '@/assets/SVG/email.svg';
import Input from '../../../components/Input';
import VisibilityEyeButton from '../../../components/VisibilityEye';
import Button from '../components/button';
import { ILogin } from '../models/login.interface';
import { useUserLoginMutation } from '../../../redux/slices/user.slice';
import { useNavigate } from 'react-router-dom';

const Login: React.FC<ILogin> = () => {
	const [passwordVisibility, setPasswordVisibility] = useState('password');

	const initialState = {
		email: '',
		password: '',
	};
	const navigate = useNavigate();

	const [form, setForm] = useState(initialState);

	const [userLogin] = useUserLoginMutation();

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			const response = await userLogin(form);

			if (!response.error) {
				localStorage.setItem('user', JSON.stringify(response.data));
				navigate('/');
			}

			setForm(initialState);
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	return (
		<div className="bg-transparent">
			<div className="flex flex-col items-center justify-center mt-4">
				<form className="flex flex-col items-center">
					<Input
						name="email"
						type="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						preImage={email.toString()}
					/>
					<Input
						name="password"
						type={passwordVisibility}
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						preImage={lock.toString()}
					>
						<VisibilityEyeButton
							visibility={passwordVisibility}
							setVisibility={setPasswordVisibility}
						/>
					</Input>
					<div className="mt-8">
						<Button primary={true} name="Log In" onClick={handleSubmit} />
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
