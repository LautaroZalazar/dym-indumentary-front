import { ILogin } from '../models/login.interface';
import lock from '../../../assets/SVG/lock.svg';
import human from '../../../assets/SVG/human.svg';
import email from '../../../assets/SVG/email.svg';
import Input from '../../../components/Input';
import VisibilityEyeButton from '../../../components/VisibilityEye';
import { useState } from 'react';
import Button from '../components/button';
import { useUserRegisterMutation } from '../../../redux/slices/user.slice';
import {
	validationPassword,
	validationName,
	validationEmail,
} from '../utils/validations/password.validation';
import ValidationToolTip from '../components/validationToolTip';

const Signin: React.FC<ILogin> = () => {
	const [passwordVisibility, setPasswordVisibility] = useState('password');
	const [showTooltip, setShowTooltip] = useState({
		name: false,
		email: false,
		password: false,
	});
	const [error, setError] = useState({
		name: true,
		email: true,
		password: true,
	});

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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleError = (base: string, hasError: boolean) => {
		setError({ ...error, [base]: hasError });
	};

	const validateError = () => {
		if (error.name || error.email || error.password) {
			return true;
		}
		return false;
	};

	return (
		<div className='bg-transparent'>
			<div className='flex flex-col items-center justify-center mt-4'>
				<form className='flex flex-col items-center'>
					<div className='relative mb-2'>
						<Input
							name='name'
							type='text'
							value={form.name}
							onChange={handleChange}
							preImage={human.toString()}
							onFocus={() => {
								setShowTooltip({ ...showTooltip, name: true });
							}}
							onBlur={() => {
								setShowTooltip({ ...showTooltip, name: false });
							}}
						/>
						{showTooltip.name && (
							<ValidationToolTip
								validate={validationName(form.name)}
								setError={handleError}
								error={error.name}
								base='name'
							/>
						)}
					</div>

					<div className='relative mb-2'>
						<Input
							name='email'
							type='email'
							value={form.email}
							onChange={handleChange}
							preImage={email.toString()}
							onFocus={() => {
								setShowTooltip({ ...showTooltip, email: true });
							}}
							onBlur={() => {
								setShowTooltip({
									...showTooltip,
									email: false,
								});
							}}
						/>
						{showTooltip.email && (
							<ValidationToolTip
								validate={validationEmail(form.email)}
								setError={handleError}
								error={error.email}
								base='email'
							/>
						)}
					</div>

					<div className='relative mb-2'>
						<Input
							name='password'
							type={passwordVisibility}
							value={form.password}
							onChange={handleChange}
							preImage={lock.toString()}
							onFocus={() => {
								setShowTooltip({
									...showTooltip,
									password: true,
								});
							}}
							onBlur={() => {
								setShowTooltip({
									...showTooltip,
									password: false,
								});
							}}>
							<VisibilityEyeButton
								visibility={passwordVisibility}
								setVisibility={setPasswordVisibility}
							/>
						</Input>
						{showTooltip.password && (
							<ValidationToolTip
								validate={validationPassword(form.password)}
								setError={handleError}
								error={error.password}
								base='password'
							/>
						)}
					</div>

					<div className='flex w-full items-start m-2'>
						<div className='flex items-center h-5'>
							<input
								id='newsletter'
								type='checkbox'
								checked={form.newsletter}
								onChange={(e) => {
									setForm({
										...form,
										newsletter: e.target.checked,
									});
								}}
								className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800'
								required
							/>
						</div>
						<label
							htmlFor='newsletter'
							className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
							Newsletter subscription
						</label>
					</div>
					<div className='mt-8'>
						<Button
							primary={true}
							name='Sign In'
							onClick={handleSubmit}
							disabled={validateError()}
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Signin;
