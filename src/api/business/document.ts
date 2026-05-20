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

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024 // 50MB,与后端 spring.servlet.multipart 限制一致

function assertSize(file: File) {
    if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error(`文件大小超过 ${MAX_UPLOAD_BYTES / 1024 / 1024}MB,请压缩后再试`)
    }
}

export function listDocuments() {
    return request.get<DocumentSummaryResponse[]>('/api/documents')
}

export function getDocument(id: number) {
    return request.get<DocumentResponse>(`/api/documents/${id}`)
}

export function createDocument(data: DocumentCreateRequest) {
    return request.post<DocumentResponse>('/api/documents', data)
}

export function uploadDocument(
    file: File,
    allowedRoles: string[],
    title?: string,
    onProgress?: (percent: number) => void,
) {
    assertSize(file)
    const formData = new FormData()
    formData.append('file', file)
    const params: Record<string, any> = { allowedRoles }
    if (title) params.title = title
    return request.post<DocumentSummaryResponse>('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params,
        onUploadProgress: (e) => {
            if (onProgress && e.total) {
                onProgress(Math.round((e.loaded / e.total) * 100))
            }
        },
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

export function getDocumentFile(id: number) {
    return request.get(`/api/documents/${id}/file`, {
        responseType: 'blob'
    })
}
