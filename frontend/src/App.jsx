import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Homepage from './pages/Homepage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CardsAndAddressesPage from './pages/CardsAndAddressesPage';
import WishlistPage from './pages/WishlistPage';
import StoreManagementPage from './pages/StoreManagementPage';
import SettingsPage from './pages/SettingsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import StoreProfilePage from './pages/StoreProfilePage';
import ChatPage from './pages/ChatPage';
import ChatInboxPage from './pages/ChatInboxPage';


function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#28a745',
              secondary: '#fff',
            },
            style: {
              background: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
            }
          },
          error: {
            style: {
              background: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb',
            }
          }
        }}
      />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<MainLayout />}>
          
          <Route path="/" element={<Homepage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/store/:storeId" element={<StoreProfilePage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/chat/:conversationId" element={<ChatPage />} />
            <Route path="/inbox" element={<ChatInboxPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<OrderHistoryPage />} />
              <Route path="addresses" element={<CardsAndAddressesPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="store" element={<StoreManagementPage />} />
              <Route path="inbox" element={<ChatInboxPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

      </Routes>
    </>
  );
}

export default App;