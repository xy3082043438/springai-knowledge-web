import request from '@/utils/request';
export function listDocuments() {
    return request.get('/api/documents');
}
export function getDocument(id) {
    return request.get(`/api/documents/${id}`);
}
export function createDocument(data) {
    return request.post('/api/documents', data);
}
export function uploadDocument(file, allowedRoles, title) {
    const formData = new FormData();
    formData.append('file', file);
    const params = { allowedRoles };
    if (title)
        params.title = title;
    return request.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params,
    });
}
export function replaceFile(id, file, allowedRoles, title) {
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
//# sourceMappingURL=document.js.map