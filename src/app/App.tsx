import { AuthProvider } from './providers/AuthProvider';
import { Router } from './router';

export function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
