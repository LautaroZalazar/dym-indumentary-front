import axios from "axios";
import { useState } from "react";
import { AUTH_HEADERS } from "../../../../redux/constants/custom-headers";
import { useMessage } from "../../../../hooks/alertMessage";

interface EditProfileModalProps {
  setOpenEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserEditProps;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  setUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserEditProps {
  name: string;
  phone: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  setOpenEditProfile,
  user,
  setUserData,
  setUpdated,
}) => {
  const [form, setForm] = useState<UserEditProps>({
    name: user.name || "",
    phone: user.phone || "",
  });
  const { showMessage } = useMessage();
  const baseUrl = import.meta.env.VITE_BACK_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await axios.put(
      `${baseUrl}/v1/user`,
      { ...form, phone: form.phone.toString() },
      { headers: AUTH_HEADERS }
    );
    if (res.status === 200) {
      setUserData(res.data);
      setUpdated(true);
      setOpenEditProfile(false);
    } else {
      showMessage("error", "Error al actualizar el perfil", 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50">
      <form className="flex flex-col bg-dymBlack border px-2 py-6 rounded-md">
        <div className="w-3/4">
          <label htmlFor="name" className={`text-dymOrange block pl-3 pb-1 text-sm`}>
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            className={`bg-dymBlack border w-[23rem] h-9 rounded-md pl-3 text-sm`}
          />
        </div>
        <div className="w-3/4 pt-3">
          <label htmlFor="name" className={`text-dymOrange block pl-3 pb-1 text-sm`}>
            Número de celular
          </label>
          <input
            id="phone"
            name="phone"
            type="number"
            value={form.phone}
            onChange={handleChange}
            placeholder="Número de celular"
            className={`bg-dymBlack border w-[23rem] h-9 rounded-md pl-3 text-sm`}
          />
        </div>
        <div className="flex justify-evenly">
          <button
            type="button"
            className="w-40 h-10 bg-dymAntiPop text-dymBlack rounded-full mt-5 text-xl"
            onClick={() => setOpenEditProfile(false)}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-40 h-10 bg-dymOrange text-dymAntiPop rounded-full mt-5 text-xl"
            onClick={handleSubmit}
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileModal;
