import apiClient from '../api/client'
import { API_ENDPOINTS } from '../config/constants'

export async function getProfileRequest() {
  const { data } = await apiClient.get(API_ENDPOINTS.getProfile)
  return data
}

export async function getDocumentTypesRequest() {
  const { data } = await apiClient.get(API_ENDPOINTS.documentTypes)
  return data.document_type || []
}

export async function getCountriesRequest() {
  const { data } = await apiClient.get(API_ENDPOINTS.countries)
  if (Array.isArray(data)) return data
  return data.countries || data.results || []
}

export async function getPaginatedDocumentTypesRequest({ page, pageSize }) {
  const { data } = await apiClient.get(
    `types/document_type/paginated/?page=${page}&page_size=${pageSize}`,
  )
  return data
}

export async function getDocumentTypeDetailRequest(id) {
  const { data } = await apiClient.get(`types/document_type/${id}/`)
  return data
}

export async function createDocumentTypeRequest(payload) {
  const { data } = await apiClient.post('types/document_type/create/', payload)
  return data
}

export async function editDocumentTypeRequest(id, payload) {
  const { data } = await apiClient.put(`types/document_type/${id}/edit/`, payload)
  return data
}

export async function deleteDocumentTypeRequest(id) {
  const { data } = await apiClient.delete(`types/document_type/${id}/delete/`)
  return data
}

export async function getRolesRequest() {
  const { data } = await apiClient.get('architect/roles/')
  return data.roles || data.results || data || []
}

export async function getPaginatedRolesRequest({ page, pageSize }) {
  const { data } = await apiClient.get(
    `architect/roles/paginated/?page=${page}&page_size=${pageSize}`,
  )
  return data
}

export async function getRoleDetailRequest(id) {
  const { data } = await apiClient.get(`architect/roles/${id}/`)
  return data
}

export async function createRoleRequest(payload) {
  const { data } = await apiClient.post('architect/roles/create/', payload)
  return data
}

export async function editRoleRequest(id, payload) {
  const { data } = await apiClient.put(`architect/roles/${id}/edit/`, payload)
  return data
}

export async function deleteRoleRequest(id) {
  const { data } = await apiClient.delete(`architect/roles/${id}/delete/`)
  return data
}

export async function getPaginatedCategoriesRequest({ page, pageSize }) {
  const { data } = await apiClient.get(
    `products/category/paginated/?page=${page}&page_size=${pageSize}`,
  )
  return data
}

export async function getCategoryDetailRequest(id) {
  const { data } = await apiClient.get(`products/category/${id}/`)
  return data
}

export async function createCategoryRequest(payload) {
  const { data } = await apiClient.post('products/category/create/', payload)
  return data
}

export async function editCategoryRequest(id, payload) {
  const { data } = await apiClient.put(`products/category/${id}/edit/`, payload)
  return data
}

export async function deleteCategoryRequest(id) {
  const { data } = await apiClient.delete(`products/category/${id}/delete/`)
  return data
}

export async function getPaginatedBrandsRequest({ page, pageSize }) {
  const { data } = await apiClient.get(
    `products/brand/paginated/?page=${page}&page_size=${pageSize}`,
  )
  return data
}

export async function getBrandDetailRequest(id) {
  const { data } = await apiClient.get(`products/brand/${id}/`)
  return data
}

export async function createBrandRequest(payload) {
  const { data } = await apiClient.post('products/brand/create/', payload)
  return data
}

export async function editBrandRequest(id, payload) {
  const { data } = await apiClient.put(`products/brand/${id}/edit/`, payload)
  return data
}

export async function deleteBrandRequest(id) {
  const { data } = await apiClient.delete(`products/brand/${id}/delete/`)
  return data
}

export async function getPaginatedSuppliersRequest({ page, pageSize }) {
  const { data } = await apiClient.get(
    `products/supplier/paginated/?page=${page}&page_size=${pageSize}`,
  )
  return data
}

export async function getSupplierDetailRequest(id) {
  const { data } = await apiClient.get(`products/supplier/${id}/`)
  return data
}

export async function createSupplierRequest(payload) {
  const { data } = await apiClient.post('products/supplier/create/', payload)
  return data
}

export async function editSupplierRequest(id, payload) {
  const { data } = await apiClient.put(`products/supplier/${id}/edit/`, payload)
  return data
}

export async function deleteSupplierRequest(id) {
  const { data } = await apiClient.delete(`products/supplier/${id}/delete/`)
  return data
}

function normalizeListResponse(data, keyCandidates) {
  if (Array.isArray(data)) return data
  for (const key of keyCandidates) {
    if (Array.isArray(data?.[key])) return data[key]
  }
  return data.results || []
}

export async function getProductCategoriesListRequest() {
  const { data } = await apiClient.get('products/category/')
  return normalizeListResponse(data, ['categories', 'category'])
}

export async function getProductBrandsListRequest() {
  const { data } = await apiClient.get('products/brand/')
  return normalizeListResponse(data, ['brands', 'brand'])
}

export async function getProductSuppliersListRequest() {
  const { data } = await apiClient.get('products/supplier/')
  return normalizeListResponse(data, ['suppliers', 'supplier'])
}

export async function getPaginatedProductsRequest({ page, pageSize }) {
  const { data } = await apiClient.get(
    `products/product/paginated/?page=${page}&page_size=${pageSize}`,
  )
  return data
}

export async function getProductDetailRequest(id) {
  const { data } = await apiClient.get(`products/product/${id}/`)
  return data
}

export async function createProductRequest(payload) {
  const { data } = await apiClient.post('products/product/create/', payload)
  return data
}

export async function editProductRequest(id, payload) {
  const { data } = await apiClient.put(`products/product/${id}/edit/`, payload)
  return data
}

export async function deleteProductRequest(id) {
  const { data } = await apiClient.delete(`products/product/${id}/delete/`)
  return data
}

export async function uploadProductPhotoRequest(id, photoFile) {
  const formData = new FormData()
  formData.append('photo', photoFile)
  const { data } = await apiClient.post(`products/product/${id}/photo/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function replaceProductPhotoRequest(id, photoFile) {
  const formData = new FormData()
  formData.append('photo', photoFile)
  const { data } = await apiClient.put(`products/product/${id}/photo/edit/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteProductPhotoRequest(id) {
  const { data } = await apiClient.delete(`products/product/${id}/photo/delete/`)
  return data
}

export async function getRegionsRequest() {
  const { data } = await apiClient.get('locations/regions/')
  return data.regions || data.results || data || []
}

export async function getProvincesRequest(regionId) {
  const { data } = await apiClient.get(`locations/provinces/?region=${regionId}`)
  return data.provinces || data.results || data || []
}

export async function getDistrictsRequest(provinceId) {
  const { data } = await apiClient.get(`locations/districts/?province=${provinceId}`)
  return data.districts || data.results || data || []
}

export async function getPaginatedEmployeesRequest({ page, pageSize }) {
  const { data } = await apiClient.get(
    `employees/employee/paginated/?page=${page}&page_size=${pageSize}`,
  )
  return data
}

export async function getEmployeeDetailRequest(id) {
  const { data } = await apiClient.get(`employees/employee/${id}/`)
  return data
}

export async function createEmployeeRequest(payload) {
  const { data } = await apiClient.post('employees/employee/create/', payload)
  return data
}

export async function editEmployeeRequest(id, payload) {
  const { data } = await apiClient.put(`employees/employee/${id}/edit/`, payload)
  return data
}

export async function deleteEmployeeRequest(id) {
  const { data } = await apiClient.delete(`employees/employee/${id}/delete/`)
  return data
}

export async function uploadEmployeePhotoRequest(id, photoFile) {
  const formData = new FormData()
  formData.append('photo', photoFile)
  const { data } = await apiClient.post(`employees/employee/${id}/photo/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function replaceEmployeePhotoRequest(id, photoFile) {
  const formData = new FormData()
  formData.append('photo', photoFile)
  const { data } = await apiClient.put(`employees/employee/${id}/photo/edit/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteEmployeePhotoRequest(id) {
  const { data } = await apiClient.delete(`employees/employee/${id}/photo/delete/`)
  return data
}

export async function updateProfileRequest(payload) {
  const { data } = await apiClient.put(API_ENDPOINTS.updateProfile, payload)
  return data
}

export async function uploadProfilePhotoRequest(photoFile) {
  const formData = new FormData()
  formData.append('photo', photoFile)

  const { data } = await apiClient.post(API_ENDPOINTS.profilePhoto, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function replaceProfilePhotoRequest(photoFile) {
  const formData = new FormData()
  formData.append('photo', photoFile)

  const { data } = await apiClient.put(API_ENDPOINTS.profilePhoto, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteProfilePhotoRequest() {
  const { data } = await apiClient.delete(API_ENDPOINTS.profilePhoto)
  return data
}
