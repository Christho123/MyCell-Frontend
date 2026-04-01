import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import AuthPage from '../pages/AuthPage'
import DashboardPage from '../pages/DashboardPage'

function AppShell() {
  const { isAuthenticated } = useAuth()
  const [activeSection, setActiveSection] = useState('productos')
  const [activeConfigSection, setActiveConfigSection] = useState('perfil')
  const [activeProductSection, setActiveProductSection] = useState('categoria')

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <DashboardPage
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      activeConfigSection={activeConfigSection}
      onConfigSectionChange={setActiveConfigSection}
      activeProductSection={activeProductSection}
      onProductSectionChange={setActiveProductSection}
    />
  )
}

export default AppShell
