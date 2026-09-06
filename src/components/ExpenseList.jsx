import { useState } from 'react';
import categories from '../data/iconPool.js';
import earnings from '../data/earnings.js';
import MonthlyAnalysis from './MonthlyAnalysis.jsx';

export default function ExpenseList({ transactions, onDelete, onEdit, onOpenAnalysis }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [openMonth, setOpenMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );

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

    const groupedByMonth = {};

    transactions.forEach((transaction) => {
        const monthKey = transaction.date.slice(0, 7);
        if (!groupedByMonth[monthKey]) {
            groupedByMonth[monthKey] = {};
        }
        if (!groupedByMonth[monthKey][transaction.date]) {
            groupedByMonth[monthKey][transaction.date] = [];
        }
        groupedByMonth[monthKey][transaction.date].push(transaction);
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
    function formatMonth(monthString) {
        const date = new Date(monthString + "-01T00:00:00");

        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
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
                <div className='flex items-start justify-between gap-5'>
                    <div>
                        <p className='text-sm font-medium text-zinc-500'>
                            Current Balance
                        </p>
                        <p className='mt-1 text-3xl font-semibold tracking-tight text-zinc-800'>
                            {formatMoney(currentBalance)}
                        </p>
                    </div>
                    <button
                        onClick={onOpenAnalysis}
                        className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-400 transition hover:text-indigo-600"
                    >
                        <span>Monthly Analysis</span>
                        <span className="text-base">→</span>
                    </button>
                </div>
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
                {Object.entries(groupedByMonth)
                    .sort(([monthA], [monthB]) => monthB.localeCompare(monthA))
                    .map(([month, dates]) => (
                        <div key={month}>
                            <div className='flex w-full items-center justify-between py-3'>
                                <span className='font-semibold text-zinc-700'>{formatMonth(month)}</span>
                                <button type='button' onClick={() => setOpenMonth(openMonth === month ? null : month)}
                                    className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100'>
                                    {openMonth === month ? "▲" : "▼"}
                                </button>
                            </div>
                            {openMonth === month &&
                                (<div>
                                    {Object.entries(dates)
                                        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                                        .map(([date, items]) => (
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
                                        ))
                                    }
                                </div>)}
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