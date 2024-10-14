import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import axios from "axios";
import { AUTH_HEADERS } from "../../redux/constants/custom-headers";
import InfoInput from "./components/infoInput";
import EditProfileModal from "./components/modals/editProfileModal";
import { useMessage } from "../../hooks/alertMessage";
import OrderModal from "./components/modals/orderModal";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false);
  const [openOrders, setOpenOrders] = useState<boolean>(false);
  const [updated, setUpdated] = useState<boolean>(false);
  const navigate = useNavigate();

  const { MessageComponent, showMessage } = useMessage();

  const baseUrl = import.meta.env.VITE_BACK_URL;

  const fetchUser = async () => {
    try {
      const user = (
        await axios.get(`${baseUrl}/v1/user/detail`, {
          headers: AUTH_HEADERS,
        })
      ).data;
      setUserData(user);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(true);
    }
  };

  const handleEditProfile = () => {
    setOpenEditProfile(!openEditProfile);
  };

  const handleOrders = () => {
    setOpenOrders(!openOrders);
  };

  useEffect(() => {
    if (!userData) {
      fetchUser();
    }
    if (updated) {
      showMessage("success", "Perfil actualizado correctamente", 3000);
      setUpdated(false);
    }
  }, [userData]);

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

    const logOut = () => {
      localStorage.removeItem('user');
      navigate('/');
    };

  if (error) return <div>Error: </div>;

  return (
    <div className="h-screen overflow-hidden pt-12 pb-12 md:pb-0">
      {openEditProfile && (
        <EditProfileModal
          setOpenEditProfile={setOpenEditProfile}
          user={userData}
          setUserData={setUserData}
          setUpdated={setUpdated}
        />
      )}
      {openOrders && <OrderModal closeModal={handleOrders} orders={userData.orders} />}
      <div className="h-screen flex md:justify-center items-center flex-col">
        <InfoInput title={"Nombre"} value={userData.name} />
        <InfoInput title={"Correo electrónico"} value={userData.email} />
        <InfoInput title={"Número de celular"} value={userData.phone} />
        <button
          className="w-80 h-12 border border-dymOrange text-dymAntiPop rounded-full mt-5 text-xl"
          onClick={handleOrders}
        >
          Mis compras
        </button>
        <button
          className="w-80 h-12 border border-dymOrange text-dymAntiPop rounded-full mt-5 text-xl"
          onClick={handleEditProfile}
        >
          Editar perfil
        </button>
        <button
          className="block md:hidden w-80 h-12 bg-dymOrange text-dymAntiPop rounded-full mt-5 text-xl"
          onClick={() => logOut()}
        >
          Cerrar sesión
        </button>
      </div>
      {MessageComponent && <MessageComponent />}
    </div>
  );
};

export default Profile;
