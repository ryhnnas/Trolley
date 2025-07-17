import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import { jwtDecode } from 'jwt-decode';
import { Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';
import HeaderLogin from '../components/HeaderLogin';
import HeaderNoLogin from '../components/HeaderNoLogin';
import Footer from '../components/Footer';

const MainLayout = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
      if (isLoggedIn) {
          const token = localStorage.getItem('token');
          const user = jwtDecode(token);
          socket.connect();
          socket.emit('add_user', user.id);

          const handleNewNotification = () => {
              setUnreadChats(prev => prev + 1);
              toast('Anda punya pesan baru!', { icon: '💬' });
          };
          socket.on('new_message_notification', handleNewNotification);

          return () => {
              socket.off('new_message_notification', handleNewNotification);
              socket.disconnect();
          }
      }
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn ? <HeaderLogin unreadChatCount={unreadChats} /> : <HeaderNoLogin />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;