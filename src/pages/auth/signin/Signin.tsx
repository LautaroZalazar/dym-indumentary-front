import { ILogin } from '../models/login.interface';
import lock from '../../../assets/SVG/lock.svg';
import human from '../../../assets/SVG/human.svg';
import email from '../../../assets/SVG/email.svg';
import Input from '../../../components/Input';
import VisibilityEyeButton from '../../../components/VisibilityEye';
import { useState, useEffect } from 'react';
import Button from '../components/button';
import { useUserRegisterMutation } from '../../../redux/slices/user.slice';
import ToolTip from '../components/ToolTip';

const Signin: React.FC<ILogin> = () => {
	const [passwordVisibility, setPasswordVisibility] = useState('password');
  const [ disabled, setDisable ] = useState(true)

	const initialState = {
		name: '',
		email: '',
		password: '',
		phone: '3413113502',
		newsletter: false,
	};

	const [form, setForm] = useState(initialState);
	const [validatePassword, setValidatePassword] = useState('');
	const [showTooltip, setShowTooltip] = useState(false);

	const [userRegister] = useUserRegisterMutation();

	const handleChange = (e: any) => {
		const newPassword = e.target.value;
		setValidatePassword(newPassword);
		setForm({ ...form, password: newPassword });
	};

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
		<div className='bg-transparent'>
			<div className='flex flex-col items-center justify-center mt-4'>
				<form className='flex flex-col items-center'>
					<Input
						name='name'
						type='text'
						value={form.name}
						onChange={(e) =>
							setForm({ ...form, name: e.target.value })
						}
						preImage={human.toString()}
					/>
					<Input
						name='email'
						type='email'
						value={form.email}
						onChange={(e) =>
							setForm({ ...form, email: e.target.value })
						}
						preImage={email.toString()}
					/>
					<Input
						name='password'
						type={passwordVisibility}
						value={form.password}
						onChange={handleChange}
						preImage={lock.toString()}
						onFocus={() => {setShowTooltip(true)}}
						onBlur={() => {setShowTooltip(false)}}>
						<VisibilityEyeButton
							visibility={passwordVisibility}
							setVisibility={setPasswordVisibility}
						/>
					</Input>
					{showTooltip && <ToolTip validatePassword={validatePassword} setDisable={setDisable} />}
					<div className='flex w-full items-start m-3'>
						<div className='flex items-center h-5'>
							<input
								id='newsletter'
								type='checkbox'
								checked={form.newsletter}
								onChange={(e) =>
									setForm({
										...form,
										newsletter: e.target.checked,
									})
								}
								className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800'
								required
							/>
						</div>
						<label
							htmlFor='newsletter'
							className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
							News letter suscription
						</label>
					</div>
					<div className='mt-8'>
						<Button
							primary={true}
							name='Sign In'
							onClick={handleSubmit}
              disabled={disabled}
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Signin;
