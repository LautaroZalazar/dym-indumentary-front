import React, { useState, useEffect } from 'react';

type MessageType = 'success' | 'error';

interface MessageProps {
	type: MessageType;
	text: string;
	duration: number;
}

const Message: React.FC<MessageProps> = ({ type, text, duration }) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
		const timer = setTimeout(() => setIsVisible(false), duration - 300);
		return () => clearTimeout(timer);
	}, [duration]);

	const baseClasses =
		'px-4 py-3 rounded-md text-sm font-medium shadow-md transition-all duration-300 ease-in-out';
	const typeClasses =
		type === 'success'
			? 'bg-green-100 text-green-700'
			: 'bg-red-100 text-red-700';
	const visibilityClasses = isVisible
		? 'translate-y-0 opacity-100'
		: '-translate-y-full opacity-0';

	return React.createElement(
		'div',
		{
			className: `fixed top-10 left-1/2 transform -translate-x-1/2 transition ease-in-out z-50 duration-500 text-nowrap ${baseClasses} ${typeClasses} ${visibilityClasses}`,
			'data-duration': duration,
		},
		text
	);
};

interface UseMessageReturn {
	MessageComponent: React.FC<{}> | null;
	showMessage: (type: MessageType, text: string, duration?: number) => void;
}

export const useMessage = (): UseMessageReturn => {
	const [message, setMessage] = useState<MessageProps | null>(null);

	const showMessage = (type: MessageType, text: string, duration = 3000) => {
		setMessage({ type, text, duration });
	};

	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => {
				setMessage(null);
			}, message.duration);

			return () => clearTimeout(timer);
		}
	}, [message]);

	const MessageComponent: React.FC | null = message
		? () => React.createElement(Message, message)
		: null;

	return { MessageComponent, showMessage };
};
