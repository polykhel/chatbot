import MainLayout from 'Frontend/views/MainLayout.js';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import ChatView from "./views/chat/ChatView";
import StreamingChatView from "./views/streaming-chat/StreamingChatView";


export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    handle: { title: 'Main' },
    children: [
      { path: '/', element: <ChatView />, handle: { title: 'Chat' } },
      { path: '/streaming', element: <StreamingChatView />, handle: { title: 'Streaming Chat' } },
    ],
  },
];

export default createBrowserRouter(routes);
