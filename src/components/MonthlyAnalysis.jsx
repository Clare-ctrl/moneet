import { useState } from "react";
import iconPool from "../data/iconPool";

export default function MonthlyAnalysis({ transactions, onBack }) {
    const [selectedMonth, setSelectedMonth] = useState("2026-09");

    const monthlyTransaction = transactions
        .filter((transaction) => transaction.date.startsWith(selectedMonth));

    const totalMonthlyExpense = monthlyTransaction
        .filter((transaction) => transaction.type === "expense")
        .reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

    const totalMonthlyIncome = monthlyTransaction
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    function formatMoney(amount, type) {
        if (type === "expense") {
            return `-$${Math.abs(amount).toFixed(2)}`;
        }
        return `$${amount.toFixed(2)}`;
    }
    function formatMonth(monthString) {
        const date = new Date(monthString + "-01T00:00:00");

        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    }


    function goBackOneMonth() {
        const date = new Date(selectedMonth + "-01T00:00:00");
        date.setMonth(date.getMonth() - 1);
        return (
            date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0")
        );
    }

    function forwardOneMonth() {
        const date = new Date(selectedMonth + "-01T00:00:00");
        date.setMonth(date.getMonth() + 1);
        return (
            date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0")
        );
    }

    const groupedByCategory = {};

    monthlyTransaction.forEach((transaction) => {
        if (transaction.type !== "expense") return;

        const cat = transaction.category;

        if (!groupedByCategory[cat]) {
            groupedByCategory[cat] = 0;
        }
        groupedByCategory[cat] += transaction.amount;
    });

    function getCategoryIcon(category) {
        return iconPool.find((item) => item.name === category)?.icon || "•••";
    }

    return (
        <div className="flex flex-col gap-4 py-2">
            <h2 className="text-sm font-medium text-zinc-500">Monthly Analysis</h2>
            <div className='mb-6 rounded-2xl bg-indigo-50 p-5'>
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setSelectedMonth(goBackOneMonth())}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-indigo-500 hover:bg-indigo-100">←</button>
                    <h2>{formatMonth(selectedMonth)}</h2>
                    <button
                        onClick={() => setSelectedMonth(forwardOneMonth())}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-indigo-500 hover:bg-indigo-100">→</button>
                </div>
                <div className="mt-5">
                    <p className="text-xs text-zinc-500">
                        Total monthly expense
                    </p>
                    <p className="mt-1 text-xl font-semibold text-indigo-600">
                        {formatMoney(totalMonthlyExpense, "expense")}
                    </p>
                </div>
                <div className="divide-y divide-zinc-100">
                    {Object.entries(groupedByCategory).map(([category, total]) => (
                        <div key={category} className="flex items-center gap-4 pt-3">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                                {getCategoryIcon(category)}
                            </div>
                            <p className="flex-1 text-sm font-medium text-zinc-700">{category}</p>
                            <p className="text-sm font-semibold text-zinc-800">{formatMoney(total, "expense")}</p>
                        </div>
                    ))
                    }
                </div>
            </div>
            {/* income part */}
            


            <div className="flex justify-center pb-12">
                <button className="mt-8 self-start text-sm font-medium text-indigo-500 hover:text-indigo-600"
                    onClick={onBack}>
                    ← Back
                </button>
            </div>

        </div>
    );
}