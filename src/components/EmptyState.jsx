import AddTransactionButton from "./AddTransactionButton";

export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center pt-10 pb-15 text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 text-2xl">
                $
            </div>
            <p className="text-lg font-semibold text-zinc-800">
                No transactions yet
            </p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                Start by adding your first expense
            </p>
            
        </div>

    );
}