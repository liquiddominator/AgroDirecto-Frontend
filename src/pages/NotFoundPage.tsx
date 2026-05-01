import { navigate } from '../app/router';
import { routes } from '../config/routes';

export function NotFoundPage() {
  return (
    <main className="screen-message">
      <h1>Pagina no encontrada</h1>
      <button type="button" className="primary-button" onClick={() => navigate(routes.login)}>
        Volver
      </button>
    </main>
  );
}
