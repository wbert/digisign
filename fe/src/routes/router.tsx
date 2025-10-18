import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { routes } from "./route-config";

export function AppRouter() {
  const renderRoutes = (routes: any[]) =>
    routes.map(({ path, element, children }: any, index: number) => (
      <Route key={index} path={path || undefined} element={element}>
        {children && renderRoutes(children)}
      </Route>
    ));

  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(routes)}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
