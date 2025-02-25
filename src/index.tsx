import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyle from '@/styles/global';
import { GlobalFontStyles } from '@/styles/font';
import { worker } from '@/mocks/worker';

worker.start();

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<GlobalFontStyles />
		<GlobalStyle />
		<App />
	</React.StrictMode>
);
