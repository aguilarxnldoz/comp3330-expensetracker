import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {Link} from "@tanstack/react-router";
import {type Expense} from "@/routes/expenses.list";
const API = "/api";

export default function ExpensesList() {
    const tanstackQuery = useQueryClient();

    const {data, isLoading, isError, refetch} = useQuery({
        queryKey: ["expenses"],
        queryFn: async () => {
            const res = await fetch("/api/expenses", {credentials: "include"});
            if (!res.ok) throw new Error("Failed to fetch expenses");
            return res.json() as Promise<{expenses: {id: number; title: string; amount: number; fileUrl: string | null}[]}>;
        },
    });

    const deleteExpense = useMutation({
        mutationFn: async (id: number) => {
            const expenseDeleted = await fetch(`${API}/expenses/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!expenseDeleted.ok) throw new Error("Failed to delete expense");
            return id;
        },
        onMutate: async (id) => {
            await tanstackQuery.cancelQueries({queryKey: ["expenses"]});
            const previousQuery = tanstackQuery.getQueryData<{expenses: Expense[]}>(["expenses"]);

            if (previousQuery) {
                tanstackQuery.setQueryData(["expenses"], {
                    expenses: previousQuery.expenses.filter((item) => item.id !== id),
                });
            }
            return {previousQuery};
        },
        onError: (_err, _id, ctx) => {
            if (ctx?.previousQuery) tanstackQuery.setQueryData(["expenses"], ctx.previousQuery);
        },
        onSettled: () => {
            tanstackQuery.invalidateQueries({queryKey: ["expenses"]});
        },
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
    {
        isError && (
            <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <p>Could not load expenses. Please try again.</p>
                <button
                    className="mt-2 rounded border border-red-300 px-3 py-1 text-xs text-red-700"
                    onClick={() => refetch()}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (data?.expenses.length === 0)
        return (
            <div className="rounded border bg-background p-6 text-center">
                <h3 className="text-lg font-semibold">No expenses yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">Start by adding your first expense using the form above.</p>
            </div>
        );

    return (
        <>
            <ul className="mt-4 space-y-2">
                {data?.expenses.map((expense) => (
                    <li
                        key={expense.id}
                        className="flex items-center justify-between rounded border bg-background  p-3 shadow-sm"
                    >
                        <div className="flex flex-col">
                            <span className="font-medium">
                                <Link
                                    to={`/expenses/${expense.id}`}
                                    className="hover:underline"
                                >
                                    {expense.title}
                                </Link>
                            </span>
                            <span className="text-sm text-muted-foreground">${expense.amount}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {expense.fileUrl && (
                                <a
                                    href={expense.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 underline"
                                >
                                    Download
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={() => deleteExpense.mutate(expense.id)}
                                disabled={deleteExpense.isPending}
                                className="text-sm text-red-600 underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deleteExpense.isPending ? "Removing…" : "Delete"}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
