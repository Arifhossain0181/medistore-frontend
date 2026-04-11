import SmartSearchBar from '../SmartSerach/SmartSearchBar';

const SmartSearchPage = () => {
  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">AI Smart Search</h1>
          <p className="mt-2 text-sm text-slate-600">
            Search bar-এ symptom বা medicine লিখুন। AI keywords বানাবে, matching medicines দেখাবে, আর এখান থেকেই cart-এ add করতে পারবেন।
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <SmartSearchBar />
        </div>
      </div>
    </section>
  );
};

export default SmartSearchPage;
