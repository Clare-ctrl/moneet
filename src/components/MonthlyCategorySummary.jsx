import iconPool from "../data/iconPool";

export default function MonthlyCategorySummary({
    transactions,
    type,
    onCategoryClick,
}) {
    const filteredTransactions = transactions.filter(
        (transaction) => transaction.type == type
    );

    const total = filteredTransactions.reduce(
        (sum, transaction) => sum + transaction.amount, 0
    );

    const groupedByCategory = {};

    filteredTransactions.forEach(
        (transaction) => {
            const category = transaction.category;
            if (!groupedByCategory[category]) {
                groupedByCategory[category] = 0;
            }
            groupedByCategory[category] += transaction.amount;
        }
    );

    function formatMoney(amount) {
        return `${type === "expense" ? "-" : ""}$${Math.abs(amount).toFixed(2)}`;
    }

    function getCategoryIcon(category) {
        return iconPool.find((item) => item.name === category)?.icon || "•••";
    }

    return (
        <div className="py-5 px-5">
            <div className="mb-4">
                <p className="text-xs font-medium capitalize text-zinc-400">
                    {type}
                </p>
                <p className="mt-1 text-xl font-semibold text-indigo-600">
                    {formatMoney(total)}
                </p>
            </div>


            <div className="space-y-1">
                {Object.entries(groupedByCategory).map(([category, total]) => (
                    <button key={category}
                        className="group flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-indigo-50"
                        onClick={() => onCategoryClick(category, type)}
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-base">
                            {getCategoryIcon(category)}
                        </div>
                        <p className="flex-1 text-sm font-medium text-zinc-700">{category}</p>
                        <p className="text-sm font-semibold text-zinc-700">{formatMoney(total)}</p>
                        <span className="ml-1 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-400">
                            ›
                        </span>
                    </button>
                ))
                }
            </div>
        </div>
    );
}