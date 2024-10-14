import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import axios from "axios";
import { AUTH_HEADERS } from "../../redux/constants/custom-headers";
import InfoInput from "./components/infoInput";
import EditProfileModal from "./components/modals/editProfileModal";
import { useMessage } from "../../hooks/alertMessage";
import OrderModal from "./components/modals/orderModal";

const Profile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [openEditProfile, setOpenEditProfile] = useState<boolean>(false);
  const [openOrders, setOpenOrders] = useState<boolean>(false);
  const [updated, setUpdated] = useState<boolean>(false);

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

  if (error) return <div>Error: </div>;

  return (
    <div className="h-screen overflow-hidden">
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
          className="w-96 h-12 bg-dymOrange text-dymAntiPop rounded-full mt-5 text-xl"
          onClick={handleOrders}
        >
          Mis compras
        </button>
        <button
          className="w-96 h-12 bg-dymOrange text-dymAntiPop rounded-full mt-5 text-xl"
          onClick={handleEditProfile}
        >
          Editar perfil
        </button>
      </div>
      {MessageComponent && <MessageComponent />}
    </div>
  );
};

export default Profile;
