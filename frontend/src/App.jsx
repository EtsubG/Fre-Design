import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import PageLoader from './components/PageLoader';
import { ToastProvider } from './context/ToastContext';
import { initAuthListener } from './services/authService';

const HomePage = lazy(() => import('./pages/HomePage'));
const AlbumsPage = lazy(() => import('./pages/AlbumsPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  useEffect(() => {
    initAuthListener();
  }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <HomePage />
                  </Suspense>
                }
              />
              <Route
                path="/albums"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AlbumsPage />
                  </Suspense>
                }
              />
              <Route
                path="/albums/:albumSlug"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AlbumsPage />
                  </Suspense>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ProductDetailsPage />
                  </Suspense>
                }
              />
              <Route
                path="/about"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AboutPage />
                  </Suspense>
                }
              />
              <Route
                path="/contact"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ContactPage />
                  </Suspense>
                }
              />
              <Route
                path="/order"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <OrderPage />
                  </Suspense>
                }
              />
              <Route
                path="/order/confirmation"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <OrderConfirmationPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/login"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminLoginPage />
                  </Suspense>
                }
              />
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminDashboardPage />
                    </Suspense>
                  }
                />
              </Route>
              <Route
                path="*"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <NotFoundPage />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
