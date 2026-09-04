import { useState, useRef, useEffect } from 'react'
import './App.css'
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import ExpenseList from './components/ExpenseList';
import AddTransactionButton from './components/AddTransactionButton';
import AddTransactionModal from './components/AddTransactionModal';
import initialTransactions from './data/fakedata.js';


function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }
    return [];
  });

  const modal = useRef();

  function handleAddTransaction() {
    modal.current.open();
  }
  function handleSaveTransaction(newTransaction) {
    setTransactions((prev) => [
      ...prev,
      newTransaction
    ]);
  }
  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  return (
    <>
      <AddTransactionModal ref={modal} onSave={handleSaveTransaction} />
      <div className='min-h-screen bg-zinc-100 p-4 sm:p-6'>
        <div className='mx-auto mt-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white'>
          <Header />
          <main className='pt-6 px-6 mx-5'>
            {transactions.length === 0 ? (
              <EmptyState />
            ) : (
              <ExpenseList transactions={transactions} />
            )}
          </main>
          <div className='flex justify-center pb-12'>
            <AddTransactionButton onClick={handleAddTransaction} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App
