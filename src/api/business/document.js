import request from '@/utils/request';
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50MB,与后端 spring.servlet.multipart 限制一致
function assertSize(file) {
    if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error(`文件大小超过 ${MAX_UPLOAD_BYTES / 1024 / 1024}MB,请压缩后再试`);
    }
}
export function listDocuments() {
    return request.get('/api/documents');
}
export function getDocument(id) {
    return request.get(`/api/documents/${id}`);
}
export function createDocument(data) {
    return request.post('/api/documents', data);
}
export function uploadDocument(file, allowedRoles, title, onProgress) {
    assertSize(file);
    const formData = new FormData();
    formData.append('file', file);
    const params = { allowedRoles };
    if (title)
        params.title = title;
    return request.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params,
        onUploadProgress: (e) => {
            if (onProgress && e.total) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        },
    });
}
export function replaceFile(id, file, allowedRoles, title, onProgress) {
    assertSize(file);
    const formData = new FormData();
    formData.append('file', file);
    const params = {};
    if (allowedRoles)
        params.allowedRoles = allowedRoles;
    if (title)
        params.title = title;
    return request.post(`/api/documents/${id}/file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params,
        onUploadProgress: (e) => {
            if (onProgress && e.total) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        },
    });
}
export function updateDocument(id, data) {
    return request.patch(`/api/documents/${id}`, data);
}
export function deleteDocument(id) {
    return request.delete(`/api/documents/${id}`);
}
export function searchDocuments(data) {
    return request.post('/api/documents/search', data);
}
export function reindexAll() {
    return request.post('/api/documents/reindex');
}
export function reindexOne(id) {
    return request.post(`/api/documents/${id}/reindex`);
}
export function previewChunk(chunkId) {
    return request.get(`/api/documents/chunks/${chunkId}`);
}
export function getDocumentFile(id) {
    return request.get(`/api/documents/${id}/file`, {
        responseType: 'blob'
    });
}
//# sourceMappingURL=document.js.map