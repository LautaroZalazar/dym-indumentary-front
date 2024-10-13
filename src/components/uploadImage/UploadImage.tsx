import axios from 'axios';
import React, { useState } from 'react';
import ImageCrop from './utils/ImageCrop';
import { IPreset } from './models/upload-image-preset.interface';
import { IUploadImageResponse } from './models/upload-image-response.interface';

interface CroppedFilesState {
	croppedImages: Blob[];
}

const UploadImage: React.FC<IPreset> = ({
	preset,
	setUrl,
	form,
	handleMouseEnter,
	handleMouseLeave,
}) => {
	const [isInputShow, setInputShow] = useState(false);
	const [croppingFiles, setCroppingFiles] = useState<File[]>([]);
	const [croppedFiles, setCroppedFiles] = useState<CroppedFilesState>({
		croppedImages: [],
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (e.target.files) {
			setCroppingFiles([...Array.from(e.target.files)]);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files) {
			setCroppingFiles([...Array.from(e.dataTransfer.files)]);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleUpload = async (croppedImages: Blob[]) => {
		const uploadedImageUrls: IUploadImageResponse[] = [];

		try {
			await Promise.all(
				croppedImages.map(async (croppedImage) => {
					const formData = new FormData();
					formData.append('file', croppedImage);
					formData.append('upload_preset', preset);
					formData.append('folder', 'products/' + form.name);

					const response = await axios.post(
						`https://api.cloudinary.com/v1_1/dym/image/upload`,
						formData,
						{
							headers: {
								'Content-Type': 'multipart/form-data',
							},
						}
					);

					const imageUrl = response.data.secure_url;
					const publicId = response.data.public_id;
					uploadedImageUrls.push({url: imageUrl, public_id: publicId});
				})
			);
			setUrl({ ...form, image: uploadedImageUrls });
		} catch (error: any) {
			throw new Error(error)
		}
	};

	const handleCropComplete = (croppedImages: Blob[]) => {
		setCroppedFiles((prevState) => ({
			croppedImages: [...prevState.croppedImages, ...croppedImages],
		}));
		setCroppingFiles([]);
	};

	const handleClickUpload = () => {
		if (croppedFiles.croppedImages.length > 0) {
			handleUpload(croppedFiles.croppedImages);
			setCroppedFiles({ croppedImages: [] });
		}
	};

	const handleCropCancel = () => {
		setCroppingFiles([]);
	};

	const handleImageChargeCancel = () => {
		setCroppedFiles({ croppedImages: [] });
		setInputShow(false);
	};

	return (
		<div
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className='w-full flex justify-center'>
			<button
				type='button'
				className={`bg-dymBlack text-dymAntiPop h-12 w-36 rounded-md border ${
					isInputShow && 'hidden'
				}`}
				onClick={() => setInputShow(!isInputShow)}>
				Cargar imágenes
			</button>
			{isInputShow && (
				<>
					{form.name ? (
						<div
							className='flex flex-col items-center justify-center w-full'
							onDrop={handleDrop}
							onDragOver={handleDragOver}>
							<label
								htmlFor='dropzone-file'
								className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer'>
								<div className='flex flex-col items-center justify-center pt-5 pb-6 h-full'>
									<svg
										className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
										aria-hidden='true'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 20 16'>
										<path
											stroke='currentColor'
											stroke-linecap='round'
											stroke-linejoin='round'
											stroke-width='2'
											d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
										/>
									</svg>
									<p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
										<span className='font-semibold'>
											Click aqui para subir archivo
										</span>{' '}
										o arrastra aquí
									</p>
									<p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
										<span className='font-semibold'>
											Selecciono{' '}
											{croppedFiles.croppedImages.length}{' '}
											archivo/s
										</span>
									</p>
								</div>
								<input
									id='dropzone-file'
									type='file'
									className='hidden'
									onChange={handleFileChange}
									multiple
								/>
								<div className='w-full h-20 cursor-default flex items-end justify-around bg-dymBlack p-2'>
									<button
										type='button'
										onClick={handleClickUpload}
										className='bg-dymBlack text-dymAntiPop h-12 w-36 rounded-md border p-2'>
										Subir imágen
									</button>
									<button
										type='button'
										onClick={handleImageChargeCancel}
										className='bg-dymBlack text-dymAntiPop h-12 w-36 rounded-md border p-2'>
										Cancelar
									</button>
								</div>
							</label>
						</div>
					) : (
						<span className='text-red-600 text-xs block mt-1'>
							Debes agregar un nombre al producto antes de cargar
							imágenes
						</span>
					)}
				</>
			)}
			{croppingFiles.length > 0 ? (
				<ImageCrop
					files={croppingFiles}
					onCropComplete={handleCropComplete}
					onCancel={handleCropCancel}
				/>
			) : null}
		</div>
	);
};

export default UploadImage;
