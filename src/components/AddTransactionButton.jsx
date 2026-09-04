export default function AddTransactionButton({ onClick }) {
    return (
        <button className="mt-6 rounded-lg bg-indigo-400 px-5 py-3 text-sm font-medium text-white
        transition hover:bg-indigo-600" onClick={onClick}>
            + Add transaction
        </button>
    );
}