import ThemeToggle from "./components/theme-toggle";
import AppCard from "./components/AppCard";

export default function App() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-4xl p-6">
                <header className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Expenses App</h1>
                    <nav className="flex items-center gap-4">
                        {/* links… */}
                        <ThemeToggle />
                    </nav>
                </header>
                {/* rest of page content */}
            </div>
            <AppCard />
        </main>
    );
}
