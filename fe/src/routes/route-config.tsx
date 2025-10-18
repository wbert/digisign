//@ts-nocheck
import AppLayout from "@/components/layout/AppLayout";
import { lazy } from "react";
// import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
// import { GuestLayout } from "@/components/layout/guest-layout";
// import { AdminOnly } from "@/components/protected-route/admin-only";
// import { UserOnly } from "@/components/protected-route/user-only";

// Pages
export const Home = lazy(() => import("../pages/home/home.tsx"));
export const About = lazy(() => import("../pages/about/index.tsx"));
export const Features = lazy(() => import("../pages/features/index.tsx"));
export const Demo = lazy(() => import("../pages/demo/index.tsx"));

// Route definitions
export const routes = [
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/features", element: <Features /> },
      { path: "/demo", element: <Demo /> },
    ],
  },
  // {
  //   element: <AuthenticatedLayout />,
  //   children: [
  //     { path: "/dashboard", element: (<AdminOnly><DashboardPage /></AdminOnly>) },
  //     { path: "/profile", element: <ProfilePage /> },
  //     { path: "/barber", element: (<AdminOnly><BarberPage /></AdminOnly>) },
  //     { path: "/service", element: (<AdminOnly><ServicePage /></AdminOnly>) },
  //     { path: "/booking", element: (<AdminOnly><BookingPage /> </AdminOnly>) },
  //     { path: "/booking/completed", element: (<AdminOnly><BookingCompletedPage /></AdminOnly>) },
  //     { path: "/booking/canceled", element: (<AdminOnly><BookingCanceledPage /></AdminOnly>) },
  //     { path: "/booking/create", element: (<AdminOnly><BookingFormPage /></AdminOnly>) },
  //     { path: "/user", element: (<AdminOnly><UserPage /></AdminOnly>) },
  //     { path: "/user/dashboard", element: (<UserOnly><UserDashboard /></UserOnly>) },
  //     { path: "/user/booking", element: (<UserOnly><UserBookingForm /></UserOnly>) },
  //   ],
  // },
];
