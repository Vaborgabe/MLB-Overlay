import { createRoot } from 'react-dom/client';
import { SocketProvider } from './components/socketIOCtx/socketIOCtx';
import './player.css';
import PlayerPage from './playerPage';

createRoot(document.getElementById('root')!).render(
    <SocketProvider namespace='user'>
        <PlayerPage />
    </SocketProvider>
);