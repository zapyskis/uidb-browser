import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import DevicesListPage from './DevicesListPage';
import DeviceDetaislPage from './DeviceDetailsPage';
import App from '../App';

export const rootRoute = createRootRoute({
  component: App,
});

export const devicesListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DevicesListPage,
});

export const deviceDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/device/$deviceId',
  component: DeviceDetaislPage,
});

const routeTree = rootRoute.addChildren([devicesListRoute, deviceDetailsRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
