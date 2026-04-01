import { useRef, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import {
  deleteProfilePhotoRequest,
  replaceProfilePhotoRequest,
  uploadProfilePhotoRequest,
} from '../profile/profileService'
import { resolveMediaUrl } from '../utils/url'

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
      <div className="sidebar-top">
        <h2>KML STORE</h2>
        <div className="profile-circle">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Foto de perfil" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <p className="sidebar-name">{displayName}</p>
        <p className="sidebar-email">{user?.email}</p>
        <div className="photo-actions">
          <button type="button" onClick={handleSelectPhoto} disabled={photoLoading}>
            {photoLoading ? 'Procesando...' : profilePhoto ? 'Actualizar foto' : 'Subir foto'}
          </button>
          <button type="button" onClick={handleDeletePhoto} disabled={!profilePhoto || photoLoading}>
            Eliminar foto
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden-input"
          onChange={handleFileChange}
        />
      </div>

      <nav className="sidebar-nav">
        <button
          type="button"
          className={
            activeSection === 'productos' ? 'active config-toggle' : 'config-toggle'
          }
          onClick={() => {
            onSectionChange('productos')
            setIsProductOpen((prev) => !prev)
          }}
        >
          Productos
          <span className={isProductOpen ? 'chevron open' : 'chevron'}>&gt;</span>
        </button>
        <div className={isProductOpen ? 'config-submenu open' : 'config-submenu'}>
          <button
            type="button"
            className={
              activeProductSection === 'categoria' ? 'active sub-item' : 'sub-item'
            }
            onClick={() => {
              onSectionChange('productos')
              onProductSectionChange('categoria')
            }}
          >
            Categoria
          </button>
          <button
            type="button"
            className={activeProductSection === 'marca' ? 'active sub-item' : 'sub-item'}
            onClick={() => {
              onSectionChange('productos')
              onProductSectionChange('marca')
            }}
          >
            Marca
          </button>
          <button
            type="button"
            className={
              activeProductSection === 'proveedor' ? 'active sub-item' : 'sub-item'
            }
            onClick={() => {
              onSectionChange('productos')
              onProductSectionChange('proveedor')
            }}
          >
            Proveedor
          </button>
          <button
            type="button"
            className={activeProductSection === 'producto' ? 'active sub-item' : 'sub-item'}
            onClick={() => {
              onSectionChange('productos')
              onProductSectionChange('producto')
            }}
          >
            Productos
          </button>
        </div>
        <button
          type="button"
          className={activeSection === 'empleados' ? 'active' : ''}
          onClick={() => onSectionChange('empleados')}
        >
          Empleados
        </button>
        <button
          type="button"
          className={activeSection === 'configuracion' ? 'active config-toggle' : 'config-toggle'}
          onClick={() => {
            onSectionChange('configuracion')
            setIsConfigOpen((prev) => !prev)
          }}
        >
          Configuracion
          <span className={isConfigOpen ? 'chevron open' : 'chevron'}>&gt;</span>
        </button>
        <div className={isConfigOpen ? 'config-submenu open' : 'config-submenu'}>
          <button
            type="button"
            className={activeConfigSection === 'tipo-documento' ? 'active sub-item' : 'sub-item'}
            onClick={() => {
              onSectionChange('configuracion')
              onConfigSectionChange('tipo-documento')
            }}
          >
            Tipo Documento
          </button>
          <button
            type="button"
            className={activeConfigSection === 'roles' ? 'active sub-item' : 'sub-item'}
            onClick={() => {
              onSectionChange('configuracion')
              onConfigSectionChange('roles')
            }}
          >
            Roles
          </button>
          <button
            type="button"
            className={activeConfigSection === 'perfil' ? 'active sub-item' : 'sub-item'}
            onClick={() => {
              onSectionChange('configuracion')
              onConfigSectionChange('perfil')
            }}
          >
            Perfil
          </button>
        </div>
      </nav>

      <div className="sidebar-actions">
        <button type="button" onClick={onToggleTheme}>
          {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        </button>
        <button type="button" onClick={handleLogout} disabled={loading}>
          {loading ? 'Cerrando...' : 'Cerrar sesion'}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
