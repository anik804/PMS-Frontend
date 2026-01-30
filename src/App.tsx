import { ConfigProvider, theme } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import type { RootState } from './store';

const ThemedApp: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const { defaultAlgorithm, darkAlgorithm } = theme;

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
        },
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return <ThemedApp />;
};

export default App;
