import { useState, useRef, useEffect } from 'react'
import './App.css'
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import ExpenseList from './components/ExpenseList';
import AddTransactionButton from './components/AddTransactionButton';
import AddTransactionModal from './components/AddTransactionModal';
import initialTransactions from './data/fakedata.js';
import MonthlyAnalysis from './components/MonthlyAnalysis.jsx';

function App() {

  const [page, setPage] = useState("home");

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }
    return [];
  });

  const modal = useRef();
  const [editingTransaction, setEditingTransaction] = useState(null);

  function handleAddTransaction() {
    setEditingTransaction(null);
    modal.current.open();
  }
  function handleSaveTransaction(newTransaction) {
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === newTransaction.id
            ? newTransaction
            : transaction
        ));
      setEditingTransaction(null);
    } else {
      setTransactions((prev) => [
        ...prev,
        newTransaction
      ]);
    }
  }
  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  function handleDeleteTransaction(id) {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    );
  }

  function handleEditTransaction(transaction) {
    setEditingTransaction(transaction);
    modal.current.open();
  }

  return (
    <>
      <AddTransactionModal ref={modal} onSave={handleSaveTransaction} transaction={editingTransaction} />
      <div className='min-h-screen bg-zinc-100 p-4 sm:p-6'>
        <div className='mx-auto mt-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white'>
          <Header />
          <main className='pt-6 px-6 mx-5'>
            {transactions.length === 0 ? (
              <EmptyState />
            ) : (page === "home" ? (
              <ExpenseList transactions={transactions} onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
                onOpenAnalysis={() => setPage("analysis")} />
            ) : (
              <MonthlyAnalysis transactions={transactions} onBack={() => setPage("home")} />
            )
            )}
          </main>
          {page === "analysis" ? null : (
            <div className='flex justify-center pb-12'>
              <AddTransactionButton onClick={handleAddTransaction} />
            </div>)
          }

        </div>
      </div>
    </>
  );
}

export default App
