import { useState } from "react";
import iconPool from "../data/iconPool";
import MonthlyCategorySummary from "./MonthlyCategorySummary";

export default function MonthlyAnalysis({ transactions, onBack }) {

    const today = new Date();

    const [selectedMonth, setSelectedMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const monthlyTransaction = transactions
        .filter((transaction) => transaction.date.startsWith(selectedMonth));

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

    function handleCategoryClick(cateogry, type) {
        setSelectedCategory(cateogry);
        setSelectedType(type);
    }

    const categoryTransactions = monthlyTransaction.filter(
        (transaction) =>
            transaction.type === selectedType &&
            transaction.category === selectedCategory
    );


    if (selectedCategory) {
        return (
            <div className="flex flex-col gap-4 py-2">
                <button
                    onClick={() => {
                        setSelectedCategory(null);
                        setSelectedType(null);
                    }}
                    className="self-start text-sm font-medium text-indigo-500">
                    ← Monthly Analysis
                </button>
                <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm ">
                    <div className="flex items-center gap-3 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl">
                            {iconPool.find(
                                (item) => item.name === selectedCategory)?.icon
                            }
                        </div>
                        <p className="font-semibold text-zinc-800">
                            {selectedCategory}
                        </p>
                        <p className="mt-0.5 text-xs capitalize text-zinc-400">
                            {selectedType} · {formatMonth(selectedMonth)}
                        </p>
                    </div>
                </div>
                <div className="border-t border-zinc-100 px-5">
                    {categoryTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between border-b border-zinc-100 py-4 last:border-b-0"
                        >
                            <div>
                                <p className="text-sm font-medium text-zinc-700">
                                    {transaction.note || transaction.category}
                                </p>
                                <p className="mt-1 text-xs text-zinc-400">
                                    {transaction.date}
                                </p>
                            </div>
                            <p className="text-sm font-semibold text-zinc-800">
                                {selectedType === "expense" ? "-" : ""}
                                ${transaction.amount.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 py-6">
            <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm py-5 ">
                <div className="flex items-center justify-between px-5 py-4">
                    <button
                        onClick={() => setSelectedMonth(goBackOneMonth())}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-500 hover:bg-indigo-50">←</button>
                    <h2 className="text-base font-semibold text-zinc-800"
                    >{formatMonth(selectedMonth)}</h2>
                    <button
                        onClick={() => setSelectedMonth(forwardOneMonth())}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-500 hover:bg-indigo-50">→</button>
                </div>

            </div>
            <div className="border-t border-zinc-100 bg-white">
                <MonthlyCategorySummary transactions={monthlyTransaction}
                    type="expense"
                    onCategoryClick={handleCategoryClick} />
            </div>

            <div className="border-t border-b border-zinc-100 bg-white">
                <MonthlyCategorySummary transactions={monthlyTransaction}
                    type="income"
                    onCategoryClick={handleCategoryClick} />
            </div>
            <button className="my-6 self-center text-sm font-medium text-indigo-500 hover:text-indigo-600"
                onClick={onBack}>
                ← Back
            </button>

        </div>
    );
}