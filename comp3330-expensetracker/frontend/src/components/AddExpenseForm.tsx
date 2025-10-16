import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {type Expense} from "@/routes/expenses.list";
import {Button} from "./ui/button";

export default function AddExpenseForm() {
    const qc = useQueryClient();
    const [title, setTitle] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);

    const createExpense = useMutation({
        mutationFn: async (payload: {title: string; amount: number}) => {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const message = await res.text().catch(() => "");
                throw new Error(message || "Failed to add expense");
            }
            return (await res.json()) as {expense: Expense};
        },
        onMutate: async (newItem) => {
            await qc.cancelQueries({queryKey: ["expenses"]});
            const previous = qc.getQueryData<{expenses: Expense[]}>(["expenses"]);
            if (previous) {
                const optimistic: Expense = {
                    id: Date.now(),
                    title: newItem.title,
                    amount: newItem.amount,
                    fileUrl: null,
                };
                qc.setQueryData(["expenses"], {
                    expenses: [...previous.expenses, optimistic],
                });
            }
            return {previous};
        },
        onError: (_err, _newItem, ctx) => {
            if (ctx?.previous) qc.setQueryData(["expenses"], ctx.previous);
        },
        onSettled: () => {
            qc.invalidateQueries({queryKey: ["expenses"]});
            setTitle("");
            setAmount("");
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formError) return;
        setFormError(null);
        if (!title.trim()) return setFormError("Title is required");
        if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
            return setFormError("Amount must be greater than 0");
        }

        createExpense.mutate({title: title.trim(), amount});
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 flex gap-2"
        >
            <input
                className="w-1/2 rounded border p-2 bg-background"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                className="w-40 rounded border p-2 bg-background"
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
            <Button>
                <button
                    className="rounded bg-background px-4 py-2 text-foreground disabled:opacity-50"
                    disabled={createExpense.isPending}
                >
                    {formError && <p className="text-sm text-red-600">{formError}</p>}
                    {createExpense.isError && <p className="text-sm text-red-600">{createExpense.error?.message ?? "Could not add expense."}</p>}
                    {createExpense.isPending ? (
                        <span className="flex items-center gap-2">
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
                            Adding…
                        </span>
                    ) : (
                        "Add Expense"
                    )}
                </button>
            </Button>
        </form>
    );
}
