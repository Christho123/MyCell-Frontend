import { useEffect, useState } from 'react'
import EmployeeManager from './EmployeeManager'
import DocumentTypeManager from './DocumentTypeManager'
import RoleManager from './RoleManager'
import CategoryManager from './CategoryManager'
import BrandManager from './BrandManager'
import SupplierManager from './SupplierManager'
import ProductManager from './ProductManager'
import {
  getCountriesRequest,
  getDocumentTypesRequest,
  getProfileRequest,
  updateProfileRequest,
} from '../profile/profileService'

const defaultProfileForm = {
  name: '',
  paternal_lastname: '',
  maternal_lastname: '',
  phone: '',
  document_number: '',
  document_type: 1,
  sex: 'M',
  country: 426,
}

function SectionContent({
  activeSection,
  activeConfigSection,
  activeProductSection,
  profile,
  onProfileChanged,
}) {
  const [profileForm, setProfileForm] = useState(defaultProfileForm)
  const [documentTypes, setDocumentTypes] = useState([])
  const [countries, setCountries] = useState([])
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [docTypesData, countriesData] = await Promise.all([
          getDocumentTypesRequest(),
          getCountriesRequest(),
        ])
        setDocumentTypes(docTypesData)
        setCountries(countriesData)
      } catch (error) {
        console.error('No se pudieron cargar catalogos:', error)
      }
    }

    fetchCatalogs()
  }, [])

  useEffect(() => {
    if (!profile) return
    setProfileForm({
      name: profile.name || '',
      paternal_lastname: profile.paternal_lastname || '',
      maternal_lastname: profile.maternal_lastname || '',
      phone: profile.phone || '',
      document_number: profile.document_number || '',
      document_type: profile.document_type?.id || 1,
      sex: profile.sex || 'M',
      country: profile.country?.id || 426,
    })
  }, [profile])

  const handleChange = (key, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setFeedback('')
    setSaving(true)
    try {
      const response = await updateProfileRequest({
        ...profileForm,
        document_type: Number(profileForm.document_type),
        country: Number(profileForm.country),
      })
      setFeedback(response.message || 'Perfil actualizado.')
      const refreshed = await getProfileRequest()
      onProfileChanged(refreshed)
    } catch (error) {
      setFeedback(error.response?.data?.detail || 'No se pudo actualizar el perfil.')
    } finally {
      setSaving(false)
    }
  }

  if (activeSection === 'empleados') {
    return <EmployeeManager />
  }

  if (activeSection === 'configuracion') {
    if (activeConfigSection === 'tipo-documento') {
      return <DocumentTypeManager />
    }
    if (activeConfigSection === 'roles') {
      return <RoleManager />
    }

    return (
      <section className="content-card">
        <h1>Configuracion - Perfil</h1>
        <p>Completa o actualiza tus datos personales.</p>
        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <label htmlFor="name">Nombres</label>
          <input
            id="name"
            value={profileForm.name}
            onChange={(event) => handleChange('name', event.target.value)}
            required
          />

          <label htmlFor="paternal_lastname">Apellido paterno</label>
          <input
            id="paternal_lastname"
            value={profileForm.paternal_lastname}
            onChange={(event) => handleChange('paternal_lastname', event.target.value)}
            required
          />

          <label htmlFor="maternal_lastname">Apellido materno</label>
          <input
            id="maternal_lastname"
            value={profileForm.maternal_lastname}
            onChange={(event) => handleChange('maternal_lastname', event.target.value)}
            required
          />

          <label htmlFor="phone">Telefono</label>
          <input
            id="phone"
            value={profileForm.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            required
          />

          <label htmlFor="document_number">Numero de documento</label>
          <input
            id="document_number"
            value={profileForm.document_number}
            onChange={(event) => handleChange('document_number', event.target.value)}
            required
          />

          <label htmlFor="document_type">Tipo de documento</label>
          <select
            id="document_type"
            value={profileForm.document_type}
            onChange={(event) => handleChange('document_type', event.target.value)}
            required
          >
            {documentTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <label htmlFor="sex">Sexo</label>
          <select
            id="sex"
            value={profileForm.sex}
            onChange={(event) => handleChange('sex', event.target.value)}
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

          <label htmlFor="country">Pais</label>
          <select
            id="country"
            value={profileForm.country}
            onChange={(event) => handleChange('country', event.target.value)}
            required
          >
            {countries.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {feedback ? <p className="profile-feedback">{feedback}</p> : null}
        </form>
      </section>
    )
  }

  if (activeSection === 'productos') {
    if (activeProductSection === 'producto') {
      return <ProductManager />
    }
    if (activeProductSection === 'marca') {
      return <BrandManager />
    }
    if (activeProductSection === 'proveedor') {
      return <SupplierManager />
    }
    return <CategoryManager />
  }

  return (
    <section className="content-card">
      <h1>Inicio</h1>
      <p>Selecciona una seccion del menu lateral.</p>
    </section>
  )
}

export default SectionContent
