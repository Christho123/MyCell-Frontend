import { useEffect, useState } from 'react'
import {
  createBrandRequest,
  deleteBrandRequest,
  editBrandRequest,
  getBrandDetailRequest,
  getCountriesRequest,
  getPaginatedBrandsRequest,
} from '../profile/profileService'

const pageSizes = [10, 20, 50]

const defaultForm = {
  name: '',
  description: '',
  country: '',
}

function BrandManager() {
  const [rows, setRows] = useState([])
  const [countries, setCountries] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [modalType, setModalType] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState(defaultForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const list = await getCountriesRequest()
        setCountries(list)
      } catch (e) {
        console.error(e)
      }
    }
    loadCountries()
  }, [])

  const fetchTable = async (nextPage = page, nextPageSize = pageSize) => {
    setLoading(true)
    setError('')
    try {
      const data = await getPaginatedBrandsRequest({
        page: nextPage,
        pageSize: nextPageSize,
      })
      const list = data.results || data.brands || data.items || []
      setRows(list)
      const count = data.count ?? list.length
      const calculatedPages = Math.max(1, Math.ceil(count / nextPageSize))
      setTotalPages(data.total_pages || calculatedPages)
    } catch (apiError) {
      setError('No se pudo cargar la tabla de marcas.')
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
    setFormData(defaultForm)
  }

  const openCreateModal = () => {
    setFormData(defaultForm)
    setModalType('create')
  }

  const openEditModal = (item) => {
    setSelectedItem(item)
    setFormData({
      name: item.name || '',
      description: item.description || '',
      country: String(item.country?.id || item.country || ''),
    })
    setModalType('edit')
  }

  const openDetailModal = async (item) => {
    try {
      const detail = await getBrandDetailRequest(item.id)
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
    name: formData.name,
    description: formData.description,
    country: Number(formData.country),
  })

  const handleCreateSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await createBrandRequest(toPayload())
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
      await editBrandRequest(selectedItem.id, toPayload())
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
      await deleteBrandRequest(selectedItem.id)
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
          <h1>Productos - Marcas</h1>
          <p>Gestiona marcas y pais de origen.</p>
        </div>
        <button type="button" className="primary-btn" onClick={openCreateModal}>
          Crear marca
        </button>
      </div>

      <div className="table-controls">
        <label htmlFor="brand-page-size">Mostrar</label>
        <select
          id="brand-page-size"
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
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Pais</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Cargando...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="4">Sin registros</td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description || '-'}</td>
                  <td>{item.country?.name || '-'}</td>
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
                <h3>{modalType === 'create' ? 'Crear marca' : 'Editar marca'}</h3>
                <form
                  className="profile-form profile-grid"
                  onSubmit={modalType === 'create' ? handleCreateSubmit : handleEditSubmit}
                >
                  <label htmlFor="brand-name">Nombre</label>
                  <input
                    id="brand-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                  <label htmlFor="brand-desc">Descripcion</label>
                  <input
                    id="brand-desc"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                  <label htmlFor="brand-country">Pais</label>
                  <select
                    id="brand-country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, country: e.target.value }))
                    }
                    required
                  >
                    <option value="">Seleccionar</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
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

            {modalType === 'detail' ? (
              <>
                <h3>Detalle de marca</h3>
                <p>
                  <strong>Nombre:</strong> {selectedItem?.name}
                </p>
                <p>
                  <strong>Descripcion:</strong> {selectedItem?.description || '-'}
                </p>
                <p>
                  <strong>Pais:</strong> {selectedItem?.country?.name || '-'}
                </p>
                <div className="modal-actions">
                  <button type="button" onClick={closeModal}>
                    Cerrar
                  </button>
                </div>
              </>
            ) : null}

            {modalType === 'delete' ? (
              <>
                <h3>Confirmar eliminacion</h3>
                <p>Seguro que quiere eliminar la marca &quot;{selectedItem?.name}&quot;?</p>
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
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default BrandManager
