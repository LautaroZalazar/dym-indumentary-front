import logo from "../assets/SVG/logo.svg";

const Loader = () => {
    return (
        <div className="flex fixed inset-0 justify-center items-center bg-[#18151A] z-50">
			<img className='animate-flipHorizontal backface-visibility-hidden preserve-3d' src={logo.toString()} alt='hola' />
		</div>
    )
}

export default Loader;