import ThemeToggle from "./components/theme-toggle";
import AppCard from "./components/AppCard";
import ExpensesList from "./components/ExpenseList";
import AddExpenseForm from "./components/AddExpenseForm";

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
            <div className="mx-auto max-w-3xl p-6">
                <h1 className="text-3xl font-bold">Expenses</h1>
                <p className="mt-1 text-sm text-gray-600">Powered by TanStack Query</p>
                <AddExpenseForm />
                <ExpensesList />
            </div>
        </main>
    );
}
