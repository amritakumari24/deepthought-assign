import Header from './components/Header.jsx';
import Layout from './components/Layout.jsx';
import AnalyzePage from './pages/AnalyzePage.jsx';

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 text-slate-950">
      <Header />
      <Layout>
        <div className="w-full">
          <AnalyzePage />
        </div>
      </Layout>
    </div>
  );
}

export default App;
