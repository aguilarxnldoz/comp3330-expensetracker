import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AppRouter} from "./router.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5_000,
            retry: 1,
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <StrictMode>
            <AppRouter />
        </StrictMode>
    </QueryClientProvider>
);
