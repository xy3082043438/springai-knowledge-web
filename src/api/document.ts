import request from '@/utils/request'
import type {
    DocumentResponse,
    DocumentSummaryResponse,
    DocumentCreateRequest,
    DocumentUpdateRequest,
    DocumentSearchRequest,
    DocumentReindexResponse,
    DocumentChunkPreviewResponse,
} from '@/types/api'

export function listDocuments() {
    return request.get<DocumentSummaryResponse[]>('/api/documents')
}

export function getDocument(id: number) {
    return request.get<DocumentResponse>(`/api/documents/${id}`)
}

export function createDocument(data: DocumentCreateRequest) {
    return request.post<DocumentResponse>('/api/documents', data)
}

export function uploadDocument(file: File, allowedRoles: string[], title?: string) {
    const formData = new FormData()
    formData.append('file', file)
    const params: Record<string, any> = { allowedRoles }
    if (title) params.title = title
    return request.post<DocumentSummaryResponse>('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params,
    })
}

export function replaceFile(id: number, file: File, allowedRoles?: string[], title?: string) {
    const formData = new FormData()
    formData.append('file', file)
    const params: Record<string, any> = {}
    if (allowedRoles) params.allowedRoles = allowedRoles
    if (title) params.title = title
    return request.post<DocumentSummaryResponse>(`/api/documents/${id}/file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params,
    })
}

export function updateDocument(id: number, data: DocumentUpdateRequest) {
    return request.patch<DocumentResponse>(`/api/documents/${id}`, data)
}

export function deleteDocument(id: number) {
    return request.delete(`/api/documents/${id}`)
}

export function searchDocuments(data: DocumentSearchRequest) {
    return request.post<DocumentSummaryResponse[]>('/api/documents/search', data)
}

export function reindexAll() {
    return request.post<DocumentReindexResponse>('/api/documents/reindex')
}

export function reindexOne(id: number) {
    return request.post<DocumentReindexResponse>(`/api/documents/${id}/reindex`)
}

export function previewChunk(chunkId: number) {
    return request.get<DocumentChunkPreviewResponse>(`/api/documents/chunks/${chunkId}`)
}
