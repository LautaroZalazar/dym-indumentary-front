import React from 'react';
import email from '../../../assets/SVG/email.svg';
import Input from '../../../components/Input';
import Button from '../../../components/button';
import { useState } from 'react';
import { IRecoveryPassword } from '../models/recovery-password.interface';
import ValidationToolTip from '../components/validationToolTip';
import { validationEmail } from '../utils/validations/password.validation';
import { useAuthRecoveryPasswordMutation } from '../../../redux/slices/auth.slice';
import ErrorModal from '../../../components/modals/error.modal';

const RecoveryPassword: React.FC<IRecoveryPassword> = ({ setIsSelected }) => {
	const initialState = {
		email: '',
	};
	const [form, setForm] = useState(initialState);

	const [showTooltip, setShowTooltip] = useState({
		email: false,
	});

	const [error, setError] = useState({
		email: true,
	});
	const [showModalError, setShowModalError] = useState('');

	const [authRecoveryPassword] = useAuthRecoveryPasswordMutation();

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			const response = await authRecoveryPassword(form);

			if (response.error) {
				setShowModalError('Ha ocurrido un error!');
			}
			alert(response.data.msg);

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
		if (error.email) {
			return true;
		}
		return false;
	};

	return (
		<div className="bg-transparent">
			<div className="flex flex-col items-center justify-center mt-4">
				<form className="flex flex-col items-center">
					<Input
						name="email"
						type="email"
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
							base="email"
						/>
					)}
					{showModalError && <ErrorModal message={showModalError} />}
					<div className="mt-8 flex flex-col items-center">
						<Button
							primary={true}
							name="Recuperar Contraseña"
							onClick={handleSubmit}
							disabled={validateError()}
						/>
					</div>
					<div className="mt-4 flex flex-col items-center">
						<p className="">
							Ya tienes una cuenta?
							<button
								onClick={() => {
									setIsSelected('LogIn');
								}}
								className="text-[#F26426]"
							>
								&nbsp;Inicia sesión
							</button>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RecoveryPassword;
