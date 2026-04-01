import { useRef, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import {
  deleteProfilePhotoRequest,
  replaceProfilePhotoRequest,
  uploadProfilePhotoRequest,
} from '../profile/profileService'
import { resolveMediaUrl } from '../utils/url'

/* ── Iconos ── */
const IconBrand = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
)
const IconPackage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
)
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)
const IconSun = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" /><path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
)
const IconMoon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
)
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const IconCamera = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
)
const IconTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)
const IconSpinner = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="3" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" strokeDasharray="45 18" />
  </svg>
)

function Sidebar({
  activeSection,
  onSectionChange,
  activeConfigSection,
  onConfigSectionChange,
  activeProductSection,
  onProductSectionChange,
  profile,
  onProfileChanged,
  theme,
  onToggleTheme,
}) {
  const { user, logout, loading } = useAuth()
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isProductOpen, setIsProductOpen] = useState(true)
  const [photoLoading, setPhotoLoading] = useState(false)
  const fileInputRef = useRef(null)

  const displayName = profile?.user_name || profile?.name || user?.email || 'Usuario'
  const profilePhoto = resolveMediaUrl(profile?.profile_photo_url || profile?.photo_url)
  const initials = displayName.slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error al cerrar sesion:', error)
    }
  }

  const handleSelectPhoto = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPhotoLoading(true)
    try {
      const response = profilePhoto
        ? await replaceProfilePhotoRequest(file)
        : await uploadProfilePhotoRequest(file)

      onProfileChanged({
        profile_photo_url: response.photo_url,
        photo_url: response.photo_url,
      })
    } catch (error) {
      console.error('Error al subir foto:', error)
    } finally {
      setPhotoLoading(false)
      event.target.value = ''
    }
  }

  const handleDeletePhoto = async () => {
    if (!profilePhoto) return
    setPhotoLoading(true)
    try {
      await deleteProfilePhotoRequest()
      onProfileChanged({
        profile_photo_url: null,
        photo_url: null,
      })
    } catch (error) {
      console.error('Error al eliminar foto:', error)
    } finally {
      setPhotoLoading(false)
    }
  }

  return (
    <aside className="sidebar">
      {/* ═══ Marca ═══ */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <IconBrand />
        </div>
        <h2>KML Logistics International</h2>
      </div>

      {/* ═══ Perfil ═══ */}
      <div className="sidebar-top">
        <div className="profile-wrapper">
          <div className="profile-ring">
            <div className="profile-circle">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Foto de perfil" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="profile-camera-btn"
            onClick={handleSelectPhoto}
            disabled={photoLoading}
            title={profilePhoto ? 'Actualizar foto' : 'Subir foto'}
          >
            {photoLoading ? <IconSpinner /> : <IconCamera />}
          </button>
        </div>

        <p className="sidebar-name">{displayName}</p>
        <p className="sidebar-email">{user?.email}</p>

        <div className="photo-actions">
          <button
            type="button"
            onClick={handleSelectPhoto}
            disabled={photoLoading}
          >
            {photoLoading ? 'Procesando...' : profilePhoto ? 'Actualizar' : 'Subir foto'}
          </button>
          {profilePhoto && (
            <button
              type="button"
              className="photo-delete"
              onClick={handleDeletePhoto}
              disabled={photoLoading}
            >
              <IconTrash />
              <span>Eliminar</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden-input"
          onChange={handleFileChange}
        />
      </div>

      {/* ═══ Navegacion ═══ */}
      <nav className="sidebar-nav">
        {/* Productos */}
        <button
          type="button"
          className={`nav-item ${activeSection === 'productos' ? 'active' : ''}`}
          onClick={() => {
            if (activeSection === 'productos') {
              setIsProductOpen((prev) => !prev)
            } else {
              onSectionChange('productos')
              setIsProductOpen(true)
            }
          }}
        >
          <IconPackage />
          <span>Productos</span>
          <span className={`nav-chevron ${isProductOpen ? 'open' : ''}`}>
            <IconChevron />
          </span>
        </button>
        <div className={`nav-submenu ${isProductOpen ? 'open' : ''}`}>
          <button
            type="button"
            className={`nav-subitem ${activeProductSection === 'categoria' ? 'active' : ''}`}
            onClick={() => {
              onSectionChange('productos')
              onProductSectionChange('categoria')
            }}
          >
            Categoria
          </button>
          <button
            type="button"
            className={`nav-subitem ${activeProductSection === 'marca' ? 'active' : ''}`}
            onClick={() => {
              onSectionChange('productos')
              onProductSectionChange('marca')
            }}
          >
            Marca
          </button>
          <button
            type="button"
            className={`nav-subitem ${activeProductSection === 'proveedor' ? 'active' : ''}`}
            onClick={() => {
              onSectionChange('productos')
              onProductSectionChange('proveedor')
            }}
          >
            Proveedor
          </button>
          <button
            type="button"
            className={`nav-subitem ${activeProductSection === 'producto' ? 'active' : ''}`}
            onClick={() => {
              onSectionChange('productos')
              onProductSectionChange('producto')
            }}
          >
            Productos
          </button>
        </div>

        {/* Empleados */}
        <button
          type="button"
          className={`nav-item ${activeSection === 'empleados' ? 'active' : ''}`}
          onClick={() => onSectionChange('empleados')}
        >
          <IconUsers />
          <span>Empleados</span>
        </button>

        {/* Configuracion */}
        <button
          type="button"
          className={`nav-item ${activeSection === 'configuracion' ? 'active' : ''}`}
          onClick={() => {
            if (activeSection === 'configuracion') {
              setIsConfigOpen((prev) => !prev)
            } else {
              onSectionChange('configuracion')
              setIsConfigOpen(true)
            }
          }}
        >
          <IconSettings />
          <span>Configuracion</span>
          <span className={`nav-chevron ${isConfigOpen ? 'open' : ''}`}>
            <IconChevron />
          </span>
        </button>
        <div className={`nav-submenu ${isConfigOpen ? 'open' : ''}`}>
          <button
            type="button"
            className={`nav-subitem ${activeConfigSection === 'tipo-documento' ? 'active' : ''}`}
            onClick={() => {
              onSectionChange('configuracion')
              onConfigSectionChange('tipo-documento')
            }}
          >
            Tipo Documento
          </button>
          <button
            type="button"
            className={`nav-subitem ${activeConfigSection === 'roles' ? 'active' : ''}`}
            onClick={() => {
              onSectionChange('configuracion')
              onConfigSectionChange('roles')
            }}
          >
            Roles
          </button>
          <button
            type="button"
            className={`nav-subitem ${activeConfigSection === 'perfil' ? 'active' : ''}`}
            onClick={() => {
              onSectionChange('configuracion')
              onConfigSectionChange('perfil')
            }}
          >
            Perfil
          </button>
        </div>
      </nav>

      {/* ═══ Acciones inferiores ═══ */}
      <div className="sidebar-bottom">
        <div className="theme-toggle-row">
          <div className="theme-toggle-info">
            {theme === 'light' ? <IconSun /> : <IconMoon />}
            <span>{theme === 'light' ? 'Modo claro' : 'Modo oscuro'}</span>
          </div>
          <button
            type="button"
            className={`theme-switch ${theme === 'dark' ? 'on' : ''}`}
            onClick={onToggleTheme}
            aria-label="Cambiar tema"
          >
            <span className="theme-switch-thumb" />
          </button>
        </div>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
          disabled={loading}
        >
          <IconLogout />
          <span>{loading ? 'Cerrando...' : 'Cerrar sesion'}</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar