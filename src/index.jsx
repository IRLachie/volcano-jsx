import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
	<ChakraProvider>
		<StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</StrictMode>
	</ChakraProvider>
);
