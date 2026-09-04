import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import categories from '../data/categories.js';
import earnings from "../data/earnings";

const AddTransactionModal = forwardRef(function AddTransactionModal({ onClose, onSave }, ref) {
    const dialog = useRef();

    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            },
            close() {
                dialog.current.close();
            },
        };
    });
    const [type, setType] = useState("expense");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [note, setNote] = useState("");
    const [error, setError] = useState("");

    const currentCategories = type === "expense" ? categories : earnings;
    function handleTypeSelection(selectedType) {
        setType(selectedType);
        setCategory("");
    }

    function handleSave() {
        const newTransaction = {
            id: Date.now(),
            type,
            amount: Number(amount),
            category: category,
            date: date,
            note: note,
        };




        if (!amount || !category || !date) {
            return;
        }

        const selectedDate = new Date(date + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            setError("Expense date cannot be in the future.");
            return;
        }
        setError("");

        onSave(newTransaction);
        setAmount("");
        setCategory("");
        setDate("");
        setNote("");

        dialog.current.close();
    }

    return createPortal(
        <dialog ref={dialog}
            className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl shadow-xl overflow-hidden bg-white p-2 font-sans backdrop:bg-zinc-900/40">
            <div className="flex max-h-[90vh] flex-col">
                <div className="overflow-y-auto p-6">
                    <div className="mb-6 flex rounded-xl bg-zinc-100 p-1">
                        <button
                            type="button"
                            onClick={() => handleTypeSelection("expense")}
                            className={`flex-1 rounded-lg py-2 text-sm font-medium ${type === "expense"
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-zinc-500"
                                }`}>
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeSelection("income")}
                            className={`flex-1 rounded-lg py-2 text-sm font-medium ${type === "income"
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-zinc-500"
                                }`}>
                            Income
                        </button>
                    </div>
                    <div className="bg-indigo-50 my-5 p-5 rounded-2xl">
                        <label className="mb-2 block text-sm font-medium text-zinc-700">
                            {type === "expense" ? "Expense Amount" : "Income Amount"}
                            </label>
                        <input className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 outline-none transition
                     focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="my-5 bg-indigo-50 p-5 rounded-2xl">
                        <label className="mb-4 block text-sm font-semibold tracking-tight text-zinc-700">
                            {type === "expense" ? "Expense Category" : "Income Category"}
                            </label>
                        <div className='grid grid-cols-3 sm:grid-cols-4 gap-3'>
                            {currentCategories.map((item) => (
                                <button key={item.name} type='button' onClick={() => setCategory(item.name)}
                                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 transition
                    ${category === item.name
                                            ? "border-indigo-400 bg-indigo-100 text-indigo-600"
                                            : "border-zinc-200 bg-white text-zinc-600 hover:border-indigo-200 hover:bg-zinc-100"}`}>
                                    <span className='text-2xl'>{item.icon}</span>
                                    <span className='mt-1 text-xs font-medium'>{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-indigo-50 my-5 p-5 rounded-2xl">
                        <label className="mb-2 block text-sm font-medium text-zinc-700">
                            {type === "expense" ? "Expense Date" : "Income Date"}
                        </label>
                        <input className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 outline-none transition
                     focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-400">{error}</p>
                        )}
                    </div>

                    <div className="bg-indigo-50 my-5 p-5 rounded-2xl">
                        <label className="mb-2 block text-sm font-medium text-zinc-700">Note</label>
                        <textarea className="w-full resize-y rounded-xl border border-zinc-200
                        bg-white px-4 py-3 text-sm text-zinc-800
                        outline-none transition
                        focus:border-indigo-400
                        focus:ring-2
                        focus:ring-indigo-100"
                            rows="2"
                            placeholder="Add a note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)} />
                    </div>
                </div>
                <div className="flex shrink-0 justify-end gap-3 bg-white px-6 py-4">
                    <button onClick={() => dialog.current.close()}
                        className="rounded-xl px-5 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-100">
                        Close
                    </button>
                    <button className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-400"
                        onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </dialog>, document.body
    );
});

export default AddTransactionModal;