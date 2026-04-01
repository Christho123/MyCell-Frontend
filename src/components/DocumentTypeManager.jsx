import { useEffect, useState } from 'react'
import {
  createDocumentTypeRequest,
  deleteDocumentTypeRequest,
  editDocumentTypeRequest,
  getDocumentTypeDetailRequest,
  getPaginatedDocumentTypesRequest,
} from '../profile/profileService'

const pageSizes = [10, 20, 50]

const defaultForm = {
  name: '',
  description: '',
}

function DocumentTypeManager() {
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [modalType, setModalType] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState(defaultForm)
  const [saving, setSaving] = useState(false)

  const fetchTable = async (nextPage = page, nextPageSize = pageSize) => {
    setLoading(true)
    setError('')
    try {
      const data = await getPaginatedDocumentTypesRequest({
        page: nextPage,
        pageSize: nextPageSize,
      })
      const list = data.results || data.document_type || data.items || []
      setRows(list)
      const count = data.count || list.length
      const calculatedPages = Math.max(1, Math.ceil(count / nextPageSize))
      setTotalPages(data.total_pages || calculatedPages)
    } catch (apiError) {
      setError('No se pudo cargar la tabla de tipos de documento.')
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
    })
    setModalType('edit')
  }

  const openDetailModal = async (item) => {
    try {
      const detail = await getDocumentTypeDetailRequest(item.id)
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

  const handleCreateSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const created = await createDocumentTypeRequest(formData)
      closeModal()
      if (page !== 1) {
        setPage(1)
      } else {
        setRows((prev) => [created, ...prev].slice(0, pageSize))
      }
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
      await editDocumentTypeRequest(selectedItem.id, formData)
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
      await deleteDocumentTypeRequest(selectedItem.id)
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
          <h1>Configuracion - Tipo Documento</h1>
          <p>Administra tipos de documento con paginacion y acciones.</p>
        </div>
        <button type="button" className="primary-btn" onClick={openCreateModal}>
          Crear documento
        </button>
      </div>

      <div className="table-controls">
        <label htmlFor="page-size">Mostrar</label>
        <select
          id="page-size"
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
              <th>Descripcion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3">Cargando...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="3">Sin registros</td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description || '-'}</td>
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
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            {modalType === 'create' ? (
              <>
                <h3>Crear tipo de documento</h3>
                <form className="profile-form" onSubmit={handleCreateSubmit}>
                  <label htmlFor="create-name">Nombre</label>
                  <input
                    id="create-name"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, name: event.target.value }))
                    }
                    required
                  />
                  <label htmlFor="create-description">Descripcion</label>
                  <input
                    id="create-description"
                    value={formData.description}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, description: event.target.value }))
                    }
                  />
                  <div className="modal-actions">
                    <button type="button" onClick={closeModal}>
                      Cancelar
                    </button>
                    <button type="submit" className="primary-btn" disabled={saving}>
                      {saving ? 'Creando...' : 'Crear'}
                    </button>
                  </div>
                </form>
              </>
            ) : null}

            {modalType === 'edit' ? (
              <>
                <h3>Editar tipo de documento</h3>
                <form className="profile-form" onSubmit={handleEditSubmit}>
                  <label htmlFor="edit-name">Nombre</label>
                  <input
                    id="edit-name"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, name: event.target.value }))
                    }
                    required
                  />
                  <label htmlFor="edit-description">Descripcion</label>
                  <input
                    id="edit-description"
                    value={formData.description}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, description: event.target.value }))
                    }
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
            ) : null}

            {modalType === 'detail' ? (
              <>
                <h3>Detalle de tipo de documento</h3>
                <p>
                  <strong>Nombre:</strong> {selectedItem?.name}
                </p>
                <p>
                  <strong>Descripcion:</strong> {selectedItem?.description || '-'}
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
                <p>Seguro que quiere eliminar el tipo de documento "{selectedItem?.name}"?</p>
                <div className="modal-actions">
                  <button type="button" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="button" className="danger-btn" onClick={handleDelete} disabled={saving}>
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

export default DocumentTypeManager
