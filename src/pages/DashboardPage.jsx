import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import SectionContent from '../components/SectionContent'
import { useTheme } from '../hooks/useTheme'
import { getProfileRequest } from '../profile/profileService'

function DashboardPage({
  activeSection,
  onSectionChange,
  activeConfigSection,
  onConfigSectionChange,
  activeProductSection,
  onProductSectionChange,
}) {
  const { theme, toggleTheme } = useTheme()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileRequest()
        setProfile(data)
      } catch (error) {
        console.error('No se pudo cargar el perfil:', error)
      }
    }
    fetchProfile()
  }, [])

  const handleProfileChanged = (updatedData) => {
    setProfile((prev) => ({
      ...(prev || {}),
      ...updatedData,
    }))
  }

  return (
    <main className="dashboard-page">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        activeConfigSection={activeConfigSection}
        onConfigSectionChange={onConfigSectionChange}
        activeProductSection={activeProductSection}
        onProductSectionChange={onProductSectionChange}
        profile={profile}
        onProfileChanged={handleProfileChanged}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="dashboard-content">
        <SectionContent
          activeSection={activeSection}
          activeConfigSection={activeConfigSection}
          activeProductSection={activeProductSection}
          profile={profile}
          onProfileChanged={handleProfileChanged}
        />
        <div className="content-spacer" />
      </div>
    </main>
  )
}

export default DashboardPage
