import logo from "../assets/SVG/logo.svg";

const Loader = () => {
    return (
        <div className="flex justify-center items-center w-full h-screen bg-[#18151A] z-50">
			<img className='animate-flipHorizontal backface-visibility-hidden preserve-3d' src={logo.toString()} alt='hola' />
		</div>
    )
}

export default Loader;