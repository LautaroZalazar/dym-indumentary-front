import logo from '../../../assets/SVG/logo.svg';
import lock from '../../../assets/SVG/lock.svg';
import Input from '../../../components/Input';
import VisibilityEyeButton from '../../../components/VisibilityEye';
import Button from '../components/button';
import { useState } from 'react';
import { IResetPassword } from '../models/reset-password.interface';
import ValidationToolTip from '../components/validationToolTip';
import {
	validationPassword,
	validationSamePassword,
} from '../utils/validations/password.validation';
import { useAuthResetPasswordMutation } from '../../../redux/slices/auth.slice';
import ErrorModal from '../../../components/modals/error.modal';
import { useLocation } from 'react-router-dom';

const ResetPassword: React.FC<IResetPassword> = () => {
	const initialState = {
		password: '',
		confirmpassword: '',
	};

	const [showTooltip, setShowTooltip] = useState({
		password: false,
		confirmpassword: false,
	});

	const [error, setError] = useState({
		password: true,
		confirmpassword: true,
	});

	const [passwordVisibility, setPasswordVisibility] = useState('password');
	const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
		useState('confirmpassword');
	const [form, setForm] = useState(initialState);
	const [disabled, setDisabled] = useState(true);
	const [showModalError, setShowModalError] = useState('');

	const [authResetPassword] = useAuthResetPasswordMutation();

	const user = {
		token: '',
	};

	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const token = params.get('t') || '';
	user.token = token;

	localStorage.setItem('user', JSON.stringify(user));

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			const response = await authResetPassword({ password: form.password });

			if (response.error) {
				setShowModalError('Ha ocurrido un error');
			}
			alert(response.data.message);

			setForm(initialState);
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const updatedForm = { ...form, [name]: value };

		setForm(updatedForm);

		if (
			updatedForm.password &&
			updatedForm.confirmpassword &&
			updatedForm.password === updatedForm.confirmpassword
		) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const handleError = (base: string, hasError: boolean) => {
		setError({ ...error, [base]: hasError });
	};

	return (
		<div className="flex flex-col md:flex-row w-full h-screen md:items-center md:justify-center bg-[#18151A]">
			<div className="flex justify-center md:justify-end items-center w-full md:w-2/4 h-2/5 md:pr-24">
				<img src={logo.toString()} alt="logo" className="size-40 md:size-96" />
			</div>
			<div className="flex justify-center md:justify-start items-center w-full md:w-2/4 h-2/5 md:pl-24">
				<div className="flex flex-col items-center justify-center mt-4">
					<form className="flex flex-col items-center">
						<div className="relative mb-2">
							<Input
								name="password"
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
								}}
							>
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
									base="password"
								/>
							)}
							{showModalError && <ErrorModal message={showModalError} />}
						</div>

						<div className="relative mb-2">
							<Input
								name="confirmpassword"
								type={confirmPasswordVisibility}
								value={form.confirmpassword}
								onChange={handleChange}
								preImage={lock.toString()}
								onFocus={() => {
									setShowTooltip({
										...showTooltip,
										confirmpassword: true,
									});
								}}
								onBlur={() => {
									setShowTooltip({
										...showTooltip,
										confirmpassword: false,
									});
								}}
							>
								<VisibilityEyeButton
									visibility={confirmPasswordVisibility}
									setVisibility={setConfirmPasswordVisibility}
								/>
							</Input>
							{showTooltip.confirmpassword && (
								<ValidationToolTip
									validate={validationSamePassword(
										form.password,
										form.confirmpassword
									)}
									setError={handleError}
									error={error.confirmpassword}
									base="confirmpassword"
								/>
							)}
						</div>

						<div className="mt-8 flex flex-col items-center">
							<Button
								primary={true}
								name="Reset Password"
								onClick={handleSubmit}
								disabled={disabled}
							/>
							<p className="mt-4 hidden md:flex">
								Ya tienes una cuenta?
								<button>&nbsp;Inicia sesión</button>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
