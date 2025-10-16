// /frontend/src/routes/expenses.list.tsx
import {useQuery} from "@tanstack/react-query";
import {Link} from "@tanstack/react-router";
import ExpensesList from "@/components/ExpenseList";

export type Expense = {id: number; title: string; amount: number; fileUrl: string | null};

// Use "/api" if you configured a Vite proxy in dev; otherwise use
// const API = "http://localhost:3000/api";
const API = "/api";

export default function ExpensesListPage() {
    const {isLoading, isError, error, refetch, isFetching} = useQuery({
        queryKey: ["expenses"],
        queryFn: async () => {
            const res = await fetch(`${API}/expenses`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => "");
                throw new Error(`HTTP ${res.status}: ${txt || res.statusText}`);
            }
            return (await res.json()) as {expenses: Expense[]};
        },
        staleTime: 5_000,
        retry: 1,
    });

    if (isLoading)
        return (
            <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
                <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
                Loading expenses…
            </div>
        );
    if (isError)
        return (
            <div className="p-6">
                <p className="text-sm text-red-600">Failed to fetch: {(error as Error).message}</p>
                <button
                    className="mt-3 rounded border px-3 py-1"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    Retry
                </button>
            </div>
        );

    return (
        <section className="mx-auto max-w-3xl p-6">
            <header className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Expenses</h2>
                <button
                    className="rounded border px-3 py-1 text-sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    {isFetching ? "Refreshing…" : "Refresh"}
                </button>
            </header>

            <ExpensesList />
        </section>
    );
}
