import { useState, type FormEvent } from 'react';
import { navigate } from '../../../app/router';
import { routes } from '../../../config/routes';
import { isApiError } from '../../../lib/api/apiError';
import { useAuth } from '../../../hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(routes.dashboard);
    } catch (caughtError) {
      setError(resolveErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <div className="auth-heading">
          <p>AgroDirecto</p>
          <h1 id="login-title">Iniciar sesion</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              autoComplete="email"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Contrasenia
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              required
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <button type="button" className="link-button" onClick={() => navigate(routes.register)}>
          Crear cuenta
        </button>
      </section>
    </main>
  );
}

function resolveErrorMessage(error: unknown) {
  if (isApiError(error)) {
    return error.message;
  }
  return 'No se pudo iniciar sesion. Intente nuevamente.';
}
