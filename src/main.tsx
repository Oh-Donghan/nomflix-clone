/* eslint-disable react-refresh/only-export-components */
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { RecoilRoot } from 'recoil';
import { theme } from './theme.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  html {
    ::-webkit-scrollbar {
      display: none;
    }
  }
  body {
    font-weight: 300;
    font-family: "Source Sans 3", sans-serif;
    color: ${props=> props.theme.white.darker};
    background-color: black;
    line-height: 1.2;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </RecoilRoot>
);
