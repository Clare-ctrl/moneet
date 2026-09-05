import { useState } from 'react';
import categories from '../data/categories.js';
import earnings from '../data/earnings.js';

export default function ExpenseList({ transactions, onDelete, onEdit }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const totalExpense = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

    const totalIncome = transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const startingBalance = 0;
    const currentBalance = startingBalance + totalIncome - totalExpense;

    const groupedTransactions = {};
    transactions.forEach((transaction) => {
        if (!groupedTransactions[transaction.date]) {
            groupedTransactions[transaction.date] = [];
        }

        groupedTransactions[transaction.date].push(transaction);
    });

    function formatDate(dateString) {
        const date = new Date(dateString + "T00:00:00");
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
        });
    }
    function formatMoney(amount, type) {
        if (type === "expense") {
            return `-$${Math.abs(amount).toFixed(2)}`;
        }
        return `$${amount.toFixed(2)}`;
    }

    function getCategoryIcon(transaction) {
        const list =
            transaction.type === "expense"
                ? categories
                : earnings;
        return list.find(
            (item) => item.name === transaction.category)?.icon;
    }

    return (
        <div className="flex flex-col gap-4 py-2">
            <div className='mb-6 rounded-2xl bg-indigo-50 p-5'>
                <p className='text-sm font-medium text-zinc-500'>
                    Current Balance
                </p>
                <p className='mt-1 text-3xl font-semibold tracking-tight text-zinc-800'>
                    {formatMoney(currentBalance)}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className='rounded-xl bg-white p-4'>
                        <p className="text-xs font-medium text-zinc-400">
                            Total income
                        </p>
                        <p className="mt-1 text-lg font-semibold text-indigo-600">
                            {formatMoney(totalIncome, "income")}
                        </p>
                    </div>
                    <div className='rounded-xl bg-white p-4'>
                        <p className="text-xs font-medium text-zinc-400">
                            Total expense
                        </p>
                        <p className="mt-1 text-lg font-semibold text-indigo-600">
                            {formatMoney(totalExpense, "expense")}
                        </p>
                    </div>
                </div>
            </div>
            <h2 className="mb-3 text-sm font-semibold text-zinc-500">Recent transactions</h2>
            <div className="max-h-96 overflow-y-auto pr-2">
                {Object.entries(groupedTransactions).map(([date, items]) => (
                    <div key={date} className="mb-5">
                        <h3 className="mb-1 text-xs font-semibold text-zinc-400">{formatDate(date)}</h3>
                        {items.map((transaction) => (
                            <div key={transaction.id}
                                onClick={() => setSelectedTransaction(transaction)}
                                className="flex cursor-pointer items-center justify-between border-b border-zinc-100 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                                        {getCategoryIcon(transaction)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-zinc-800">{transaction.category}</p>
                                        <p className="text-sm text-zinc-400">{transaction.note}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-zinc-800">{formatMoney(transaction.amount, transaction.type)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {selectedTransaction && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'
                    onClick={() => setSelectedTransaction(null)}>
                    <div className='w-72 rounded-2xl bg-white p-6 shadow-xl'
                        onClick={(e) => e.stopPropagation()}>
                        <p className='mb-4 font-medium text-zinc-800'>
                            {selectedTransaction.category}
                        </p>
                        <div className='flex gap-3'>
                            <button
                                onClick={() => {
                                    onEdit(selectedTransaction);
                                    setSelectedTransaction(null);
                                }}
                                className='flex-1 rounded-xl border py-2 hover:bg-indigo-200 border-zinc-50'>
                                Edit
                            </button>
                            <button className='flex-1 rounded-xl border hover:bg-indigo-200 border-zinc-50 py-2'
                                onClick={() => {
                                    onDelete(selectedTransaction.id);
                                    setSelectedTransaction(null);
                                }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}