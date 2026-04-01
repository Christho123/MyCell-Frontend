import AuthProvider from './auth/AuthContext'
import AppShell from './layout/AppShell'

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App
