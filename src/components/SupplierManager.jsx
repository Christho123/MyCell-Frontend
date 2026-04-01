import { useEffect, useState } from 'react'
import {
  createSupplierRequest,
  deleteSupplierRequest,
  editSupplierRequest,
  getDistrictsRequest,
  getPaginatedSuppliersRequest,
  getProvincesRequest,
  getRegionsRequest,
  getSupplierDetailRequest,
} from '../profile/profileService'

const pageSizes = [10, 20, 50]

const emptyForm = {
  ruc: '',
  company_name: '',
  business_name: '',
  representative: '',
  phone: '',
  email: '',
  address: '',
  account_number: '',
  region_id: '',
  province_id: '',
  district_id: '',
}

function SupplierManager() {
  const [rows, setRows] = useState([])
  const [regions, setRegions] = useState([])
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [modalType, setModalType] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const list = await getRegionsRequest()
        setRegions(list)
      } catch (e) {
        console.error(e)
      }
    }
    loadRegions()
  }, [])

  const fetchTable = async (nextPage = page, nextPageSize = pageSize) => {
    setLoading(true)
    setError('')
    try {
      const data = await getPaginatedSuppliersRequest({
        page: nextPage,
        pageSize: nextPageSize,
      })
      const list = data.results || data.suppliers || data.items || []
      setRows(list)
      const count = data.count ?? list.length
      const calculatedPages = Math.max(1, Math.ceil(count / nextPageSize))
      setTotalPages(data.total_pages || calculatedPages)
    } catch (apiError) {
      setError('No se pudo cargar la tabla de proveedores.')
      console.error(apiError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTable(page, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])

  const closeModal = () => {
    setModalType('')
    setSelectedItem(null)
    setFormData(emptyForm)
    setProvinces([])
    setDistricts([])
  }

  const onChangeForm = async (key, value) => {
    if (key === 'region_id') {
      setFormData((prev) => ({
        ...prev,
        region_id: value,
        province_id: '',
        district_id: '',
      }))
      setDistricts([])
      if (!value) {
        setProvinces([])
        return
      }
      const provinceData = await getProvincesRequest(Number(value))
      setProvinces(provinceData)
      return
    }

    if (key === 'province_id') {
      setFormData((prev) => ({
        ...prev,
        province_id: value,
        district_id: '',
      }))
      if (!value) {
        setDistricts([])
        return
      }
      const districtData = await getDistrictsRequest(Number(value))
      setDistricts(districtData)
      return
    }

    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const fillFormFromSupplier = async (supplier) => {
    const regionId = Number(supplier.region?.id || supplier.region_id || supplier.region || '')
    const provinceId = Number(
      supplier.province?.id || supplier.province_id || supplier.province || '',
    )

    const provinceData = regionId ? await getProvincesRequest(regionId) : []
    const districtData = provinceId ? await getDistrictsRequest(provinceId) : []
    setProvinces(provinceData)
    setDistricts(districtData)

    setFormData({
      ruc: supplier.ruc || '',
      company_name: supplier.company_name || '',
      business_name: supplier.business_name || '',
      representative: supplier.representative || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      account_number: supplier.account_number || '',
      region_id: String(regionId || ''),
      province_id: String(provinceId || ''),
      district_id: String(supplier.district?.id || supplier.district_id || supplier.district || ''),
    })
  }

  const openCreateModal = () => {
    setFormData(emptyForm)
    setProvinces([])
    setDistricts([])
    setModalType('create')
  }

  const openEditModal = async (item) => {
    try {
      const detail = await getSupplierDetailRequest(item.id)
      setSelectedItem(detail)
      await fillFormFromSupplier(detail)
      setModalType('edit')
    } catch (apiError) {
      console.error(apiError)
    }
  }

  const openDetailModal = async (item) => {
    try {
      const detail = await getSupplierDetailRequest(item.id)
      setSelectedItem(detail)
      setModalType('detail')
    } catch (apiError) {
      console.error(apiError)
    }
  }

  const openDeleteModal = (item) => {
    setSelectedItem(item)
    setModalType('delete')
  }

  const toPayload = () => ({
    ruc: formData.ruc,
    company_name: formData.company_name,
    business_name: formData.business_name,
    representative: formData.representative,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    account_number: formData.account_number,
    region_id: Number(formData.region_id),
    province_id: Number(formData.province_id),
    district_id: Number(formData.district_id),
  })

  const handleCreateSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await createSupplierRequest(toPayload())
      closeModal()
      setPage(1)
      await fetchTable(1, pageSize)
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
      await editSupplierRequest(selectedItem.id, toPayload())
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
      await deleteSupplierRequest(selectedItem.id)
      closeModal()
      await fetchTable(page, pageSize)
    } catch (apiError) {
      console.error(apiError)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="content-card">
      <div className="table-header">
        <div>
          <h1>Productos - Proveedores</h1>
          <p>Gestone proveedores</p>
        </div>
        <button type="button" className="primary-btn" onClick={openCreateModal}>
          Crear proveedor
        </button>
      </div>

      <div className="table-controls">
        <label htmlFor="sup-page-size">Mostrar</label>
        <select
          id="sup-page-size"
          value={pageSize}
          onChange={(e) => {
            setPage(1)
            setPageSize(Number(e.target.value))
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
              <th>RUC</th>
              <th>Empresa</th>
              <th>Correo</th>
              <th>Region</th>
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
                  <td>{item.ruc}</td>
                  <td>{item.company_name || item.business_name || '-'}</td>
                  <td>{item.email || '-'}</td>
                  <td>{item.region?.name || item.region_name || '-'}</td>
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
        <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </button>
        <span>
          Pagina {page} de {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </button>
      </div>

      {modalType ? (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
            {(modalType === 'create' || modalType === 'edit') && (
              <>
                <h3>{modalType === 'create' ? 'Crear proveedor' : 'Editar proveedor'}</h3>
                <form
                  className="profile-form profile-grid"
                  onSubmit={modalType === 'create' ? handleCreateSubmit : handleEditSubmit}
                >
                  <label>RUC</label>
                  <input
                    value={formData.ruc}
                    onChange={(e) => onChangeForm('ruc', e.target.value)}
                    required
                  />
                  <label>Razon social</label>
                  <input
                    value={formData.company_name}
                    onChange={(e) => onChangeForm('company_name', e.target.value)}
                    required
                  />
                  <label>Nombre comercial</label>
                  <input
                    value={formData.business_name}
                    onChange={(e) => onChangeForm('business_name', e.target.value)}
                    required
                  />
                  <label>Representante</label>
                  <input
                    value={formData.representative}
                    onChange={(e) => onChangeForm('representative', e.target.value)}
                    required
                  />
                  <label>Telefono</label>
                  <input
                    value={formData.phone}
                    onChange={(e) => onChangeForm('phone', e.target.value)}
                    required
                  />
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => onChangeForm('email', e.target.value)}
                    required
                  />
                  <label>Direccion</label>
                  <input
                    value={formData.address}
                    onChange={(e) => onChangeForm('address', e.target.value)}
                    required
                  />
                  <label>Cuenta bancaria</label>
                  <input
                    value={formData.account_number}
                    onChange={(e) => onChangeForm('account_number', e.target.value)}
                    required
                  />
                  <label>Region</label>
                  <select
                    value={formData.region_id}
                    onChange={(e) => onChangeForm('region_id', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <label>Provincia</label>
                  <select
                    value={formData.province_id}
                    onChange={(e) => onChangeForm('province_id', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <label>Distrito</label>
                  <select
                    value={formData.district_id}
                    onChange={(e) => onChangeForm('district_id', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
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
                <h3>Detalle de proveedor</h3>
                <p>
                  <strong>RUC:</strong> {selectedItem?.ruc}
                </p>
                <p>
                  <strong>Razon social:</strong> {selectedItem?.company_name}
                </p>
                <p>
                  <strong>Nombre comercial:</strong> {selectedItem?.business_name}
                </p>
                <p>
                  <strong>Representante:</strong> {selectedItem?.representative}
                </p>
                <p>
                  <strong>Telefono:</strong> {selectedItem?.phone}
                </p>
                <p>
                  <strong>Email:</strong> {selectedItem?.email}
                </p>
                <p>
                  <strong>Direccion:</strong> {selectedItem?.address}
                </p>
                <p>
                  <strong>Cuenta:</strong> {selectedItem?.account_number}
                </p>
                <p>
                  <strong>Ubicacion:</strong> {selectedItem?.region?.name || '-'} /{' '}
                  {selectedItem?.province?.name || '-'} / {selectedItem?.district?.name || '-'}
                </p>
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
                <p>
                  Seguro que quiere eliminar el proveedor &quot;{selectedItem?.company_name}&quot;?
                </p>
                <div className="modal-actions">
                  <button type="button" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={handleDelete}
                    disabled={saving}
                  >
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

export default SupplierManager
