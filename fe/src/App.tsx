
import { Suspense } from 'react';
import { AppRouter } from './routes/router';
import { PageSpinner } from './components/ui/spinner';
// import { AuthProvider } from './context/auth-context';


export default function App() {
  return (
    <>
      <Suspense fallback={<PageSpinner />}>
        <AppRouter />
      </Suspense>
    </>
  );
}

