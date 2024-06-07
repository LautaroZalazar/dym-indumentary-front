import React from 'react';
import { IErrorModal } from '../../models/modals/error.modal.interface';

const ErrorModal: React.FC<IErrorModal> = ({ message }) => {
	return <p className="text-red-600 p-2">{message}</p>;
};

export default ErrorModal;
