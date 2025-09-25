import { Grid } from './components';
import { I18nProvider } from './i18n';

function App() {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-background">
        <main>
          <Grid />
        </main>
      </div>
    </I18nProvider>
  )
}

export default App
