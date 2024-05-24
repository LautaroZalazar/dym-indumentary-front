
export interface IInputProps {
	name: string;
	type: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	preImage?: string;
	children?: React.ReactNode;
	onFocus?:  React.Dispatch<React.SetStateAction<boolean>>;
	onBlur?:  React.Dispatch<React.SetStateAction<boolean>>;
}
