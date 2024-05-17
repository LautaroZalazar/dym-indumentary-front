import { IInputProps } from '../models/input.interface';

const Input: React.FC<IInputProps> = ({
	name,
	type,
	value,
	onChange,
	preImage,
	children,
	onFocus,
	onBlur
}) => {


	return (
		<div className='flex justify-between bg-transparent border-b-2 border-[#F26426] mt-2 w-72 h-10'>
			<div className='flex items-end' >
				{preImage && (
						<img
							src={preImage}
							alt='preImage'
							className='px-1 size-7'
						/>
				)}
				<div className='relative'>
					<input
						name={name}
						type={type}
						id={name}
						placeholder={
							name.charAt(0).toUpperCase() + name.slice(1)
						}
						value={value}
						onChange={onChange}
						className='text-white bg-transparent peer placeholder:text-transparent focus:outline-none'
						{...(onFocus ? { onFocus } : {})}
						{...(onBlur ? { onBlur } : {})}
					/>
					<label
						htmlFor={name}
						className={`pointer-events-none absolute top-0 left-2 text-sm ${
							value ? 'text-transparent' : 'text-white'
						} opacity-75 transition-all duration-200 ease-in-out peer-placeholder-shown:text-base peer-placeholder-shown:text-white peer-focus:-top-4 peer-focus:left-0 peer-focus:text-sm peer-focus:text-gray-400`}>
						{name.charAt(0).toUpperCase() + name.slice(1)}
					</label>
				</div>
			</div>
			{children || null}
		</div>
	);
};

export default Input;
