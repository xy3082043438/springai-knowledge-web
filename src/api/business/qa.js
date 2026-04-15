import request from '@/utils/request';
export function ask(data) {
    return request.post('/api/qa', data);
}
export async function askStream(data, onMessage, onComplete, onError) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/qa/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`请求失败: ${response.status} ${response.statusText}`);
        }
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('无法读取流数据');
        }
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const chunks = buffer.split('\n\n');
            buffer = chunks.pop() || '';
            for (const chunk of chunks) {
                if (chunk.trim().startsWith('data:')) {
                    const jsonStr = chunk.replace(/^data:/, '').trim();
                    if (jsonStr) {
                        try {
                            const parsed = JSON.parse(jsonStr);
                            onMessage(parsed);
                        }
                        catch (e) {
                            console.error('JSON解析异常', e);
                        }
                    }
                }
            }
        }
        // flush the remaining buffer if it ends gracefully
        if (buffer.trim().startsWith('data:')) {
            const jsonStr = buffer.replace(/^data:/, '').trim();
            if (jsonStr) {
                try {
                    const parsed = JSON.parse(jsonStr);
                    onMessage(parsed);
                }
                catch (e) { }
            }
        }
        onComplete();
    }
    catch (e) {
        onError(e);
    }
}
//# sourceMappingURL=qa.js.map