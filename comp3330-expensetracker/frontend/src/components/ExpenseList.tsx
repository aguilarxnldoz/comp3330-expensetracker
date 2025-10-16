import {useQuery} from "@tanstack/react-query";

export default function ExpensesList() {
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["expenses"],
        queryFn: async () => {
            const res = await fetch("/api/expenses", {credentials: "include"});
            if (!res.ok) throw new Error("Failed to fetch expenses");
            return res.json() as Promise<{expenses: {id: number; title: string; amount: number; fileUrl: string | null}[]}>;
        },
    });

    if (isLoading) return <p className="text-sm text-gray-500">Loading…</p>;
    if (isError) return <p className="text-sm text-red-600">{(error as Error).message}</p>;

    return (
        <>
            <ul className="mt-4 space-y-2">
                {data!.expenses.map((e) => (
                    <li
                        key={e.id}
                        className="flex items-center justify-between rounded border bg-background text-foreground p-3 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-medium">{e.title}</span>
                            {e.fileUrl ? (
                                <a
                                    href={e.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs underline text-primary hover:opacity-90"
                                >
                                    Download
                                </a>
                            ) : (
                                <span className="text-xs text-muted-foreground">Receipt not uploaded</span>
                            )}
                        </div>
                        <span className="tabular-nums">${e.amount}</span>
                    </li>
                ))}
            </ul>
        </>
    );
}
