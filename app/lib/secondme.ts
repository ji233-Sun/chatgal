/**
 * SecondMe API 客户端 - Chat/Act/Memory 集成
 */

const API_BASE_URL = process.env.SECONDME_API_BASE_URL!;

export interface ChatResponse {
  sessionId: string;
  content: string;
}

/**
 * 解析 SecondMe SSE 流，拼接 delta 内容
 */
async function parseSSEStream(response: Response): Promise<ChatResponse> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  let sessionId = "";
  let content = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const data = line.slice(6).trim();
      if (data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);

        // Session 事件：首条 data 返回 sessionId
        if (parsed.sessionId && !parsed.choices) {
          sessionId = parsed.sessionId;
          continue;
        }

        // Content delta 拼接
        if (parsed.choices?.[0]?.delta?.content) {
          content += parsed.choices[0].delta.content;
        }
      } catch {
        // 跳过不可解析的行
      }
    }
  }

  return { sessionId, content };
}

/**
 * 与用户的 SecondMe Agent 对话（SSE 流式）
 */
export async function chatWithAgent(
  accessToken: string,
  message: string,
  sessionId?: string,
  systemPrompt?: string,
): Promise<ChatResponse> {
  const body: Record<string, string> = { message };
  if (sessionId) body.sessionId = sessionId;
  if (systemPrompt) body.systemPrompt = systemPrompt;

  const response = await fetch(
    `${API_BASE_URL}/api/secondme/chat/stream`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`SecondMe Chat API error ${response.status}: ${text}`);
  }

  return parseSSEStream(response);
}

/**
 * 使用 Act API 获取结构化 JSON 输出
 */
export async function actWithAgent(
  accessToken: string,
  message: string,
  actionControl: string,
  sessionId?: string,
): Promise<{ sessionId: string; result: Record<string, unknown> }> {
  const body: Record<string, string> = { message, actionControl };
  if (sessionId) body.sessionId = sessionId;

  const response = await fetch(
    `${API_BASE_URL}/api/secondme/act/stream`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(`SecondMe Act API error: ${response.status}`);
  }

  const { sessionId: sid, content } = await parseSSEStream(response);

  try {
    return { sessionId: sid, result: JSON.parse(content) };
  } catch {
    return { sessionId: sid, result: { raw: content } };
  }
}
