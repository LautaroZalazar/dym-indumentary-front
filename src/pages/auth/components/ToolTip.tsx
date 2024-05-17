import React from 'react';
import { validationPassword } from '../utils/validations/password.validation';

const ToolTip: React.ElementType = ({ validatePassword, setDisable }): any => {
	const error = () => {
		if (validatePassword.length > 0) {
			const errors = validationPassword(validatePassword).map(
				(validation) => {
					return validation.condition;
				}
			);
			if (errors.includes(false)) {
				setDisable(true);
			} else setDisable(false);
		}
	};

	error();

	return (
		<div className='absolute w-3/4 top-60 left-50 mt-2 p-2 rounded bg-gray-300 border border-gray-300'>
			{validationPassword(validatePassword).map((validation, index) => (
				<p
					key={index}
					className={`text-sm ${
						validation.condition ? 'text-green-600' : 'text-red-600'
					}`}>
					{validation.message}
				</p>
			))}
		</div>
	);
};

export default ToolTip;
