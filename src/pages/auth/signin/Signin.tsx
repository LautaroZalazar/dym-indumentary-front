import { ILogin } from '../models/login.interface';
import lock from '../../../assets/SVG/lock.svg';
import human from '../../../assets/SVG/human.svg';
import email from '../../../assets/SVG/email.svg';
import Input from '../../../components/Input';
import VisibilityEyeButton from '../../../assets/SVG/visibilityEye.svg';
import { useState } from 'react';
import Button from '../components/button';
import { useUserRegisterMutation } from '../../../redux/slices/user.slice';

const Signin: React.FC<ILogin> = () => {
	const [passwordVisibility, setPasswordVisibility] = useState('password');
	
	const initialState = {
		name: '',
		email: '',
		password: '',
		phone: '3413113502',
		newsletter: false,
	};

	const [form, setForm] = useState(initialState);

	const [userRegister] = useUserRegisterMutation();

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			await userRegister(form);

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
						name="name"
						type="text"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						preImage={human.toString()}
					/>
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
						<Button primary={true} name="Sign In" onClick={handleSubmit} />
					</div>
				</form>
			</div>
		</div>
	);
};

export default Signin;
