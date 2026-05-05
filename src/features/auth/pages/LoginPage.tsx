import { useState, type FormEvent } from 'react';
import { navigate } from '../../../app/router';
import { routes } from '../../../config/routes';
import { resolveErrorMessage } from '../../../utils/errorUtils';
import { useAuth } from '../../../hooks/useAuth';
import AuthLayout from '../../../components/layout/AuthLayout';
import { Input } from '../../../components/ui/Input';

export function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<Key extends keyof typeof form>(key: Key, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(routes.dashboard);
    } catch (caughtError) {
      setError(resolveErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout tagline="Portal de acceso">
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-green-950">Iniciar sesión</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Ingresa tus credenciales para acceder a tu panel.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          field={{
            id: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            autoComplete: 'email',
          }}
          value={form.email}
          onChange={update}
        />

        <Input
          field={{
            id: 'password',
            label: 'Contraseña',
            type: 'password',
            required: true,
            minLength: 6,
            autoComplete: 'current-password',
          }}
          value={form.password}
          onChange={update}
        />

        <button
          className="flex w-full items-center justify-center rounded-lg bg-green-800 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            "Ingresar"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        No tienes cuenta?{" "}
        <button
          className="font-extrabold text-green-700 hover:text-green-950"
          type="button"
          onClick={() => navigate(routes.register)}
        >
          Registrate aquí
        </button>
      </p>
    </AuthLayout>
  );
}
