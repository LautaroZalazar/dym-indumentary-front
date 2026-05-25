import { useState } from 'react';
import { useCreateUserAdminMutation, useFecthAllAdminUsersQuery } from '../../../../redux/slices/admin.slice';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: any[];
}

export default function CreateUserModal({ isOpen, onClose, roles }: CreateUserModalProps) {
  const [createUser, { isLoading }] = useCreateUserAdminMutation();
  const { refetch } = useFecthAllAdminUsersQuery({ page: '1', limit: '10' });

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    roleId: '',
    isActive: true,
    newsletter: false,
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.roleId) {
      setError('Completá los campos obligatorios.');
      return;
    }

    try {
      await createUser(form).unwrap();
      refetch();
      setForm({ name: '', email: '', password: '', phone: '', roleId: '', isActive: true, newsletter: false });
      onClose();
    } catch (e: any) {
      setError(e?.data?.message ?? 'Error al crear el usuario.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1E1A21] border border-white/[0.07] rounded-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Crear nuevo usuario</h2>
          <button
            onClick={onClose}
            className="text-dymAntiPop/30 hover:text-dymAntiPop transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-dymAntiPop/60 mb-1">Nombre *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-dymOrange transition-colors"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dymAntiPop/60 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-dymOrange transition-colors"
              placeholder="usuario@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dymAntiPop/60 mb-1">Contraseña *</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-dymOrange transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dymAntiPop/60 mb-1">Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-dymOrange transition-colors"
              placeholder="+54 9 11 XXXX-XXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dymAntiPop/60 mb-1">Rol *</label>
            <select
              name="roleId"
              value={form.roleId}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-dymOrange transition-colors"
            >
              <option value="">Seleccionar rol...</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="rounded border-zinc-700 text-dymOrange focus:ring-dymOrange"
              />
              <span className="text-sm text-dymAntiPop/70">Activar usuario</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="newsletter"
                checked={form.newsletter}
                onChange={handleChange}
                className="rounded border-zinc-700 text-dymOrange focus:ring-dymOrange"
              />
              <span className="text-sm text-dymAntiPop/70">Suscribir a newsletter</span>
            </label>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 py-2 bg-dymOrange text-white rounded-lg font-semibold text-sm hover:bg-dymOrange/80 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creando...' : 'Crear usuario'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-white/10 text-dymAntiPop/60 rounded-lg font-semibold text-sm hover:border-white/20 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
