/* ============  Auth  ============ */
export interface AuthLoginRequest {
    username: string
    password: string
}

export interface AuthLoginResponse {
    token: string
    tokenType: string
    expiresIn: number
    user: UserResponse
}

/* ============  User  ============ */
export interface UserResponse {
    id: number
    username: string
    role: string
    createdAt: string
    updatedAt: string
}

export interface UserCreateRequest {
    username: string
    password: string
    role?: string
}

export interface UserUpdateRequest {
    username?: string
    role?: string
}

export interface MeUpdateRequest {
    username?: string
}

/* ============  Role  ============ */
export type Permission =
    | 'USER_READ' | 'USER_WRITE'
    | 'ROLE_READ' | 'ROLE_WRITE'
    | 'DOC_READ' | 'DOC_WRITE'
    | 'CONFIG_READ' | 'CONFIG_WRITE'
    | 'LOG_READ' | 'LOG_WRITE'
    | 'FEEDBACK_READ' | 'FEEDBACK_WRITE'

export interface RoleResponse {
    id: number
    name: string
    permissions: Permission[]
}

export interface RoleCreateRequest {
    name: string
    permissions?: Permission[]
}

export interface RoleUpdateRequest {
    name?: string
    permissions?: Permission[]
}

/* ============  Document  ============ */
export type DocumentStatus = 'UPLOADED' | 'READY' | 'FAILED'

export interface DocumentResponse {
    id: number
    title: string
    content: string
    fileName: string
    contentType: string
    fileSize: number
    status: DocumentStatus
    allowedRoles: string[]
    createdAt: string
    updatedAt: string
}

export interface DocumentSummaryResponse {
    id: number
    title: string
    fileName: string
    contentType: string
    fileSize: number
    status: DocumentStatus
    allowedRoles: string[]
    createdAt: string
    updatedAt: string
}

export interface DocumentCreateRequest {
    title: string
    content: string
    allowedRoles: string[]
}

export interface DocumentUpdateRequest {
    title?: string
    content?: string
    allowedRoles?: string[]
    status?: DocumentStatus
}

export interface DocumentSearchRequest {
    query: string
}

export interface DocumentReindexResponse {
    total: number
    success: number
    failed: number
    failedIds: number[]
}

export interface DocumentChunkPreviewResponse {
    chunkId: number
    documentId: number
    title: string
    fileName: string
    pageNumber: number
    chunkIndex: number
    startOffset: number
    endOffset: number
    content: string
}

/* ============  QA  ============ */
export interface QaRequest {
    question: string
}

export interface QaResponse {
    answer: string
    documents: DocumentResponse[]
    sources: QaSourceResponse[]
    qaLogId: number
}

export interface QaSourceResponse {
    chunkId: number
    documentId: number
    title: string
    fileName: string
    pageNumber: number
    chunkIndex: number
    startOffset: number
    endOffset: number
    score: number
    content: string
}

/* ============  Feedback  ============ */
export interface QaFeedbackRequest {
    qaLogId: number
    helpful: boolean
    comment?: string
}

export interface QaFeedbackResponse {
    id: number
    qaLogId: number
    userId: number
    username: string
    helpful: boolean
    comment: string
    createdAt: string
}

/* ============  Logs  ============ */
export interface QaLogResponse {
    id: number
    userId: number
    username: string
    question: string
    answer: string
    roleName: string
    topK: number
    retrievalJson: string
    createdAt: string
}

export interface OperationLogResponse {
    id: number
    userId: number
    username: string
    action: string
    resource: string
    resourceId: string
    detail: string
    ip: string
    success: boolean
    createdAt: string
}

/* ============  Pagination  ============ */
export interface PageResponse<T> {
    items: T[]
    page: number
    size: number
    total: number
}

/* ============  System Config  ============ */
export interface SystemConfigRequest {
    value: string
    description?: string
}

export interface SystemConfigResponse {
    key: string
    value: string
    description: string
    updatedAt: string
}

export interface SystemBoundaryResponse {
    boundary: string
}
