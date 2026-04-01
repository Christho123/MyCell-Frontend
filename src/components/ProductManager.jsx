import { useEffect, useRef, useState } from 'react'
import {
  createProductRequest,
  deleteProductPhotoRequest,
  deleteProductRequest,
  editProductRequest,
  getPaginatedProductsRequest,
  getProductBrandsListRequest,
  getProductCategoriesListRequest,
  getProductDetailRequest,
  getProductSuppliersListRequest,
  replaceProductPhotoRequest,
  uploadProductPhotoRequest,
} from '../profile/profileService'
import { resolveMediaUrl } from '../utils/url'

const pageSizes = [10, 20, 50]

const emptyForm = {
  name: '',
  description: '',
  model: '',
  unit_price: '',
  sales_price: '',
  stock: 0,
  discount: '',
  category_id: '',
  supplier_id: '',
  brand_id: '',
  state: true,
}

function ProductManager() {
  const [rows, setRows] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [modalType, setModalType] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const photoInputRef = useRef(null)

  useEffect(() => {
    const loadFk = async () => {
      try {
        const [cat, br, sup] = await Promise.all([
          getProductCategoriesListRequest(),
          getProductBrandsListRequest(),
          getProductSuppliersListRequest(),
        ])
        setCategories(cat)
        setBrands(br)
        setSuppliers(sup)
      } catch (e) {
        console.error('No se pudieron cargar catalogos de producto:', e)
      }
    }
    loadFk()
  }, [])

  const fetchTable = async (nextPage = page, nextPageSize = pageSize) => {
    setLoading(true)
    setError('')
    try {
      const data = await getPaginatedProductsRequest({
        page: nextPage,
        pageSize: nextPageSize,
      })
      const list = data.results || data.products || data.items || []
      setRows(list)
      const count = data.count ?? list.length
      const calculatedPages = Math.max(1, Math.ceil(count / nextPageSize))
      setTotalPages(data.total_pages || calculatedPages)
    } catch (apiError) {
      setError('No se pudo cargar la tabla de productos.')
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
  }

  const fillFormFromProduct = (p) => {
    setFormData({
      name: p.name || '',
      description: p.description || '',
      model: p.model || '',
      unit_price: String(p.unit_price ?? ''),
      sales_price: String(p.sales_price ?? ''),
      stock: p.stock ?? 0,
      discount: String(p.discount ?? ''),
      category_id: String(p.category?.id ?? p.category_id ?? ''),
      supplier_id: String(p.supplier?.id ?? p.supplier_id ?? ''),
      brand_id: String(p.brand?.id ?? p.brand_id ?? ''),
      state: p.state !== false,
    })
  }

  const openCreateModal = () => {
    setFormData(emptyForm)
    setModalType('create')
  }

  const openEditModal = async (item) => {
    try {
      const detail = await getProductDetailRequest(item.id)
      setSelectedItem(detail)
      fillFormFromProduct(detail)
      setModalType('edit')
    } catch (e) {
      console.error(e)
    }
  }

  const openDetailModal = async (item) => {
    try {
      const detail = await getProductDetailRequest(item.id)
      setSelectedItem(detail)
      setModalType('detail')
    } catch (e) {
      console.error(e)
    }
  }

  const openDeleteModal = (item) => {
    setSelectedItem(item)
    setModalType('delete')
  }

  const toPayload = () => ({
    name: formData.name,
    description: formData.description,
    model: formData.model,
    unit_price: formData.unit_price,
    sales_price: formData.sales_price,
    stock: Number(formData.stock),
    discount: formData.discount,
    category_id: Number(formData.category_id),
    supplier_id: Number(formData.supplier_id),
    brand_id: Number(formData.brand_id),
    state: Boolean(formData.state),
  })

  const handleCreateSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await createProductRequest(toPayload())
      closeModal()
      setPage(1)
      await fetchTable(1, pageSize)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()
    if (!selectedItem?.id) return
    setSaving(true)
    try {
      await editProductRequest(selectedItem.id, toPayload())
      closeModal()
      await fetchTable(page, pageSize)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem?.id) return
    setSaving(true)
    try {
      await deleteProductRequest(selectedItem.id)
      closeModal()
      await fetchTable(page, pageSize)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleOpenPhoto = () => photoInputRef.current?.click()

  const handlePhotoChange = async (event) => {
    if (!selectedItem?.id) return
    const file = event.target.files?.[0]
    if (!file) return
    setSaving(true)
    try {
      if (selectedItem.photo_url) {
        await replaceProductPhotoRequest(selectedItem.id, file)
      } else {
        await uploadProductPhotoRequest(selectedItem.id, file)
      }
      const refreshed = await getProductDetailRequest(selectedItem.id)
      setSelectedItem(refreshed)
      await fetchTable(page, pageSize)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
      event.target.value = ''
    }
  }

  const handleDeletePhoto = async () => {
    if (!selectedItem?.id) return
    setSaving(true)
    try {
      await deleteProductPhotoRequest(selectedItem.id)
      const refreshed = await getProductDetailRequest(selectedItem.id)
      setSelectedItem(refreshed)
      await fetchTable(page, pageSize)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const detailPhoto = resolveMediaUrl(selectedItem?.photo_url || '')

  return (
    <section className="content-card">
      <div className="table-header">
        <div>
          <h1>Productos - Catalogo</h1>
          <p>CRUD de productos con foto y relaciones.</p>
        </div>
        <button type="button" className="primary-btn" onClick={openCreateModal}>
          Crear producto
        </button>
      </div>

      <div className="table-controls">
        <label htmlFor="prod-page-size">Mostrar</label>
        <select
          id="prod-page-size"
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
        <table className="doc-table doc-table-products">
          <thead>
            <tr>
              <th className="th-photo">Foto</th>
              <th>Nombre</th>
              <th>Modelo</th>
              <th>Categoria</th>
              <th>Precio venta</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">Cargando...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan="8">Sin registros</td>
              </tr>
            ) : (
              rows.map((item) => {
                const thumb = resolveMediaUrl(item.photo_url || '')
                return (
                  <tr key={item.id}>
                    <td className="td-photo">
                      {thumb ? (
                        <img
                          className="product-table-thumb"
                          src={thumb}
                          alt=""
                        />
                      ) : (
                        <span className="product-table-thumb placeholder">—</span>
                      )}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.model || '-'}</td>
                    <td>{item.category?.name || item.category_name || '-'}</td>
                    <td>{item.sales_price ?? '-'}</td>
                    <td>{item.stock ?? '-'}</td>
                    <td>{item.state ? 'Activo' : 'Inactivo'}</td>
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
                )
              })
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
                <h3>{modalType === 'create' ? 'Crear producto' : 'Editar producto'}</h3>
                <form
                  className="profile-form profile-grid"
                  onSubmit={modalType === 'create' ? handleCreateSubmit : handleEditSubmit}
                >
                  <label>Nombre</label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                  <label>Descripcion</label>
                  <input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                  <label>Modelo</label>
                  <input
                    value={formData.model}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, model: e.target.value }))
                    }
                    required
                  />
                  <label>Precio unitario</label>
                  <input
                    value={formData.unit_price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, unit_price: e.target.value }))
                    }
                    required
                  />
                  <label>Precio venta</label>
                  <input
                    value={formData.sales_price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, sales_price: e.target.value }))
                    }
                    required
                  />
                  <label>Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }))
                    }
                    required
                  />
                  <label>Descuento</label>
                  <input
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, discount: e.target.value }))
                    }
                  />
                  <label>Categoria</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category_id: e.target.value }))
                    }
                    required
                  >
                    <option value="">Seleccionar</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <label>Proveedor</label>
                  <select
                    value={formData.supplier_id}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, supplier_id: e.target.value }))
                    }
                    required
                  >
                    <option value="">Seleccionar</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.company_name || s.business_name || s.ruc}
                      </option>
                    ))}
                  </select>
                  <label>Marca</label>
                  <select
                    value={formData.brand_id}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, brand_id: e.target.value }))
                    }
                    required
                  >
                    <option value="">Seleccionar</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <div className="checkbox-row">
                    <input
                      id="product-state"
                      type="checkbox"
                      checked={formData.state}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, state: e.target.checked }))
                      }
                    />
                    <label htmlFor="product-state">Producto activo</label>
                  </div>
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
                  <div className="employee-avatar-preview product-detail-photo">
                    {detailPhoto ? (
                      <img src={detailPhoto} alt={selectedItem?.name || ''} />
                    ) : (
                      <span>Sin foto</span>
                    )}
                  </div>
                  <div>
                    <h3>{selectedItem?.name}</h3>
                    <p className="employee-subtitle">
                      {selectedItem?.model} · {selectedItem?.category_name || selectedItem?.category?.name}
                    </p>
                  </div>
                </div>
                <div className="employee-detail-grid">
                  <article>
                    <span>Precios</span>
                    <strong>
                      Unit. {selectedItem?.unit_price} · Venta {selectedItem?.sales_price}
                    </strong>
                  </article>
                  <article>
                    <span>Stock / Descuento</span>
                    <strong>
                      {selectedItem?.stock} u. · Desc. {selectedItem?.discount ?? '-'}
                    </strong>
                  </article>
                  <article>
                    <span>Marca / Proveedor</span>
                    <strong>
                      {selectedItem?.brand_name || selectedItem?.brand?.name} ·{' '}
                      {selectedItem?.supplier?.company_name || '-'}
                    </strong>
                  </article>
                  <article>
                    <span>Estado</span>
                    <strong>{selectedItem?.state ? 'Activo' : 'Inactivo'}</strong>
                  </article>
                </div>
                <p className="detail-description">
                  {selectedItem?.description || 'Sin descripcion.'}
                </p>
                <div className="employee-photo-actions">
                  <button type="button" onClick={handleOpenPhoto} disabled={saving}>
                    {saving ? 'Procesando...' : 'Subir / Reemplazar foto'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    disabled={saving || !selectedItem?.photo_url}
                  >
                    Borrar foto
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden-input"
                    onChange={handlePhotoChange}
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
                <p>
                  Seguro que quiere eliminar el producto &quot;{selectedItem?.name}&quot;?
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

export default ProductManager
