import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { io } from "socket.io-client";

import { QueryClient, QueryClientProvider } from "react-query";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Login, Register, Home } from "pages";
import { useAuth } from "./contexts/Auth/AuthContext";
import { useSettingsChanger } from "./hooks";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import {
    WalletModalProvider,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

const queryClient: QueryClient = new QueryClient();
export const socket: any = io("http://localhost:3001");

function App(): JSX.Element {
    const { user } = useAuth();
    const { color_theme } = useSettingsChanger();

    const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
    // Only the wallets you configure here will be compiled into your application
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <QueryClientProvider client={queryClient}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets}>
                    <WalletModalProvider>
                        <div className={color_theme}>
                            <Router>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            user ? (
                                                <Home socket={socket} />
                                            ) : (
                                                <Register />
                                            )
                                        }
                                    />
                                    <Route
                                        path='/wallet'
                                        element = {
                                            <WalletMultiButton/>
                                        }
                                    />
                                    <Route
                                        path="/login"
                                        element={
                                            user ? (
                                                <Navigate to="/" />
                                            ) : (
                                                <Login />
                                            )
                                        }
                                    />
                                    <Route
                                        path="/register"
                                        element={
                                            user ? (
                                                <Navigate to="/" />
                                            ) : (
                                                <Register />
                                            )
                                        }
                                    />
                                </Routes>
                            </Router>
                        </div>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </QueryClientProvider>
    );
}

export default App;
