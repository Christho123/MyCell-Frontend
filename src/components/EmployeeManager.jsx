import { useEffect, useRef, useState } from 'react'
import {
  createEmployeeRequest,
  deleteEmployeePhotoRequest,
  deleteEmployeeRequest,
  editEmployeeRequest,
  getDistrictsRequest,
  getDocumentTypesRequest,
  getEmployeeDetailRequest,
  getPaginatedEmployeesRequest,
  getProvincesRequest,
  getRegionsRequest,
  getRolesRequest,
  replaceEmployeePhotoRequest,
  uploadEmployeePhotoRequest,
} from '../profile/profileService'
import { resolveMediaUrl } from '../utils/url'

const pageSizes = [10, 20, 50]

const emptyForm = {
  name: '',
  last_name_paternal: '',
  last_name_maternal: '',
  document_type: '',
  document_number: '',
  email: '',
  gender: 'M',
  phone: '',
  birth_date: '',
  region: '',
  province: '',
  district: '',
  rol: '',
  salary: '',
  address: '',
}

function EmployeeManager() {
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [documentTypes, setDocumentTypes] = useState([])
  const [roles, setRoles] = useState([])
  const [regions, setRegions] = useState([])
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])

  const [modalType, setModalType] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const photoInputRef = useRef(null)

  const fetchTable = async (nextPage = page, nextPageSize = pageSize) => {
    setLoading(true)
    setError('')
    try {
      const data = await getPaginatedEmployeesRequest({
        page: nextPage,
        pageSize: nextPageSize,
      })
      const list = data.results || data.employees || data.items || []
      setRows(list)
      const count = data.count || list.length
      const calculatedPages = Math.max(1, Math.ceil(count / nextPageSize))
      setTotalPages(data.total_pages || calculatedPages)
    } catch (apiError) {
      setError('No se pudo cargar la tabla de empleados.')
      console.error(apiError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTable(page, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])

  useEffect(() => {
    const fetchFkData = async () => {
      try {
        const [docTypesData, rolesData, regionsData] = await Promise.all([
          getDocumentTypesRequest(),
          getRolesRequest(),
          getRegionsRequest(),
        ])
        setDocumentTypes(docTypesData)
        setRoles(rolesData)
        setRegions(regionsData)
      } catch (apiError) {
        console.error('No se pudieron cargar llaves foraneas:', apiError)
      }
    }
    fetchFkData()
  }, [])

  const closeModal = () => {
    setModalType('')
    setSelectedItem(null)
    setFormData(emptyForm)
    setProvinces([])
    setDistricts([])
  }

  const onChangeForm = async (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))

    if (key === 'region') {
      setFormData((prev) => ({ ...prev, province: '', district: '' }))
      setDistricts([])
      if (!value) {
        setProvinces([])
        return
      }
      const provinceData = await getProvincesRequest(Number(value))
      setProvinces(provinceData)
    }

    if (key === 'province') {
      setFormData((prev) => ({ ...prev, district: '' }))
      if (!value) {
        setDistricts([])
        return
      }
      const districtData = await getDistrictsRequest(Number(value))
      setDistricts(districtData)
    }
  }

  const fillFormFromEmployee = async (employee) => {
    const regionId = Number(employee.region?.id || employee.region || '')
    const provinceId = Number(employee.province?.id || employee.province || '')

    const provinceData = regionId ? await getProvincesRequest(regionId) : []
    const districtData = provinceId ? await getDistrictsRequest(provinceId) : []
    setProvinces(provinceData)
    setDistricts(districtData)

    setFormData({
      name: employee.name || '',
      last_name_paternal: employee.last_name_paternal || '',
      last_name_maternal: employee.last_name_maternal || '',
      document_type: String(employee.document_type?.id || employee.document_type || ''),
      document_number: employee.document_number || '',
      email: employee.email || '',
      gender: employee.gender || 'M',
      phone: employee.phone || '',
      birth_date: employee.birth_date || '',
      region: String(regionId || ''),
      province: String(provinceId || ''),
      district: String(employee.district?.id || employee.district || ''),
      rol: String(employee.rol?.id || employee.rol || ''),
      salary: String(employee.salary || ''),
      address: employee.address || '',
    })
  }

  const openCreateModal = () => {
    setFormData(emptyForm)
    setModalType('create')
  }

  const openDetailModal = async (item) => {
    try {
      const detail = await getEmployeeDetailRequest(item.id)
      setSelectedItem(detail)
      setModalType('detail')
    } catch (apiError) {
      console.error(apiError)
    }
  }

  const openEditModal = async (item) => {
    try {
      const detail = await getEmployeeDetailRequest(item.id)
      setSelectedItem(detail)
      await fillFormFromEmployee(detail)
      setModalType('edit')
    } catch (apiError) {
      console.error(apiError)
    }
  }

  const openDeleteModal = (item) => {
    setSelectedItem(item)
    setModalType('delete')
  }

  const toPayload = () => ({
    name: formData.name,
    last_name_paternal: formData.last_name_paternal,
    last_name_maternal: formData.last_name_maternal,
    document_type: Number(formData.document_type),
    document_number: formData.document_number,
    email: formData.email,
    gender: formData.gender,
    phone: formData.phone,
    birth_date: formData.birth_date,
    region: Number(formData.region),
    province: Number(formData.province),
    district: Number(formData.district),
    rol: Number(formData.rol),
    salary: formData.salary,
    address: formData.address,
  })

  const handleCreateSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await createEmployeeRequest(toPayload())
      closeModal()
      await fetchTable(1, pageSize)
      setPage(1)
    } catch (apiError) {
      console.error(apiError)
    } finally {
      setSaving(false)
    }
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()
    if (!selectedItem?.id) return
    setSaving(true)
    try {
      await editEmployeeRequest(selectedItem.id, toPayload())
      closeModal()
      await fetchTable(page, pageSize)
    } catch (apiError) {
      console.error(apiError)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem?.id) return
    setSaving(true)
    try {
      await deleteEmployeeRequest(selectedItem.id)
      closeModal()
      await fetchTable(page, pageSize)
    } catch (apiError) {
      console.error(apiError)
    } finally {
      setSaving(false)
    }
  }

  const handleOpenPhotoInput = () => {
    photoInputRef.current?.click()
  }

  const handleEmployeePhotoChange = async (event) => {
    if (!selectedItem?.id) return
    const file = event.target.files?.[0]
    if (!file) return
    setSaving(true)
    try {
      if (selectedItem.photo_url || selectedItem.profile_photo_url) {
        await replaceEmployeePhotoRequest(selectedItem.id, file)
      } else {
        await uploadEmployeePhotoRequest(selectedItem.id, file)
      }
      const refreshed = await getEmployeeDetailRequest(selectedItem.id)
      setSelectedItem(refreshed)
      await fetchTable(page, pageSize)
    } catch (apiError) {
      console.error(apiError)
    } finally {
      setSaving(false)
      event.target.value = ''
    }
  }

  const handleDeleteEmployeePhoto = async () => {
    if (!selectedItem?.id) return
    setSaving(true)
    try {
      await deleteEmployeePhotoRequest(selectedItem.id)
      const refreshed = await getEmployeeDetailRequest(selectedItem.id)
      setSelectedItem(refreshed)
      await fetchTable(page, pageSize)
    } catch (apiError) {
      console.error(apiError)
    } finally {
      setSaving(false)
    }
  }

  const employeePhotoUrl = resolveMediaUrl(
    selectedItem?.photo_url || selectedItem?.profile_photo_url || '',
  )
  const employeeFullName = `${selectedItem?.name || ''} ${
    selectedItem?.last_name_paternal || ''
  } ${selectedItem?.last_name_maternal || ''}`.trim()
  const employeeInitials =
    employeeFullName
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'EM'

  return (
    <section className="content-card">
      <div className="table-header">
        <div>
          <h1>Empleados</h1>
          <p>Gestione empleados</p>
        </div>
        <button type="button" className="primary-btn" onClick={openCreateModal}>
          Crear empleado
        </button>
      </div>

      <div className="table-controls">
        <label htmlFor="employee-page-size">Mostrar</label>
        <select
          id="employee-page-size"
          value={pageSize}
          onChange={(event) => {
            setPage(1)
            setPageSize(Number(event.target.value))
          }}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="feedback error">{error}</p> : null}

      <div className="table-wrapper">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Cargando...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="5">Sin registros</td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr key={item.id}>
                  <td>{`${item.name || ''} ${item.last_name_paternal || ''}`.trim()}</td>
                  <td>{item.document_number || '-'}</td>
                  <td>{item.email || '-'}</td>
                  <td>{item.rol?.name || item.rol_name || '-'}</td>
                  <td>
                    <div className="action-group">
                      <button type="button" onClick={() => openDetailModal(item)}>
                        Ver detalle
                      </button>
                      <button type="button" onClick={() => openEditModal(item)}>
                        Editar
                      </button>
                      <button type="button" onClick={() => openDeleteModal(item)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
          Anterior
        </button>
        <span>
          Pagina {page} de {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>

      {modalType ? (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card modal-large" onClick={(event) => event.stopPropagation()}>
            {(modalType === 'create' || modalType === 'edit') && (
              <>
                <h3>{modalType === 'create' ? 'Crear empleado' : 'Editar empleado'}</h3>
                <form
                  className="profile-form profile-grid"
                  onSubmit={modalType === 'create' ? handleCreateSubmit : handleEditSubmit}
                >
                  <label>Nombre</label>
                  <input
                    value={formData.name}
                    onChange={(event) => onChangeForm('name', event.target.value)}
                    required
                  />
                  <label>Apellido paterno</label>
                  <input
                    value={formData.last_name_paternal}
                    onChange={(event) =>
                      onChangeForm('last_name_paternal', event.target.value)
                    }
                    required
                  />
                  <label>Apellido materno</label>
                  <input
                    value={formData.last_name_maternal}
                    onChange={(event) =>
                      onChangeForm('last_name_maternal', event.target.value)
                    }
                    required
                  />
                  <label>Tipo de documento</label>
                  <select
                    value={formData.document_type}
                    onChange={(event) => onChangeForm('document_type', event.target.value)}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {documentTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <label>Numero de documento</label>
                  <input
                    value={formData.document_number}
                    onChange={(event) => onChangeForm('document_number', event.target.value)}
                    required
                  />
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => onChangeForm('email', event.target.value)}
                    required
                  />
                  <label>Genero</label>
                  <select
                    value={formData.gender}
                    onChange={(event) => onChangeForm('gender', event.target.value)}
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                  <label>Telefono</label>
                  <input
                    value={formData.phone}
                    onChange={(event) => onChangeForm('phone', event.target.value)}
                    required
                  />
                  <label>Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(event) => onChangeForm('birth_date', event.target.value)}
                    required
                  />
                  <label>Region</label>
                  <select
                    value={formData.region}
                    onChange={(event) => onChangeForm('region', event.target.value)}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {regions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <label>Provincia</label>
                  <select
                    value={formData.province}
                    onChange={(event) => onChangeForm('province', event.target.value)}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {provinces.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <label>Distrito</label>
                  <select
                    value={formData.district}
                    onChange={(event) => onChangeForm('district', event.target.value)}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {districts.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <label>Rol</label>
                  <select
                    value={formData.rol}
                    onChange={(event) => onChangeForm('rol', event.target.value)}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {roles.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <label>Salario</label>
                  <input
                    value={formData.salary}
                    onChange={(event) => onChangeForm('salary', event.target.value)}
                    required
                  />
                  <label>Direccion</label>
                  <input
                    value={formData.address}
                    onChange={(event) => onChangeForm('address', event.target.value)}
                    required
                  />
                  <div className="modal-actions">
                    <button type="button" onClick={closeModal}>
                      Cancelar
                    </button>
                    <button type="submit" className="primary-btn" disabled={saving}>
                      {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {modalType === 'detail' && (
              <>
                <div className="employee-detail-header">
                  <div className="employee-avatar-preview">
                    {employeePhotoUrl ? (
                      <img src={employeePhotoUrl} alt={`Foto de ${employeeFullName}`} />
                    ) : (
                      <span>{employeeInitials}</span>
                    )}
                  </div>
                  <div>
                    <h3>{employeeFullName || 'Empleado sin nombre'}</h3>
                    <p className="employee-subtitle">
                      {selectedItem?.rol?.name || '-'} · {selectedItem?.email || '-'}
                    </p>
                  </div>
                </div>

                <div className="employee-detail-grid">
                  <article>
                    <span>Documento</span>
                    <strong>
                      {selectedItem?.document_type?.name || '-'} -{' '}
                      {selectedItem?.document_number || '-'}
                    </strong>
                  </article>
                  <article>
                    <span>Telefono</span>
                    <strong>{selectedItem?.phone || '-'}</strong>
                  </article>
                  <article>
                    <span>Ubigeo</span>
                    <strong>
                      {selectedItem?.region?.name || '-'} / {selectedItem?.province?.name || '-'} /{' '}
                      {selectedItem?.district?.name || '-'}
                    </strong>
                  </article>
                  <article>
                    <span>Direccion</span>
                    <strong>{selectedItem?.address || '-'}</strong>
                  </article>
                </div>

                <div className="employee-photo-actions">
                  <button type="button" onClick={handleOpenPhotoInput} disabled={saving}>
                    {saving ? 'Procesando...' : 'Subir / Reemplazar foto'}
                  </button>
                  <button type="button" onClick={handleDeleteEmployeePhoto} disabled={saving}>
                    Borrar foto
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden-input"
                    onChange={handleEmployeePhotoChange}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={closeModal}>
                    Cerrar
                  </button>
                </div>
              </>
            )}

            {modalType === 'delete' && (
              <>
                <h3>Confirmar eliminacion</h3>
                <p>Seguro que quiere eliminar este empleado?</p>
                <div className="modal-actions">
                  <button type="button" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="button" className="danger-btn" onClick={handleDelete} disabled={saving}>
                    {saving ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default EmployeeManager
