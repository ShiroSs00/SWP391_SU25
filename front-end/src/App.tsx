import { Header, Footer } from './components/layout';
import { HomePage } from './features/pages/HomePage';

function App() {
    return (
        <>
            <Header />
            <main>
                <HomePage />
            </main>
            <Footer />
        </>
    );
}

export default App;