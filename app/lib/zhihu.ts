/**
 * 知乎 OpenAPI 客户端
 *
 * 职责：
 * 1. HMAC-SHA256 签名生成
 * 2. 热榜列表获取（10 分钟内存缓存）
 * 3. 随机话题选取
 */

import { createHmac } from "crypto";

// ===== 环境变量校验 =====

const ZHIHU_APP_KEY = process.env.ZHIHU_APP_KEY;
const ZHIHU_APP_SECRET = process.env.ZHIHU_APP_SECRET;

if (!ZHIHU_APP_KEY || !ZHIHU_APP_SECRET) {
  console.warn(
    "[zhihu] ZHIHU_APP_KEY / ZHIHU_APP_SECRET 未配置，热榜功能不可用",
  );
}

const BASE_URL = "https://openapi.zhihu.com";

// ===== 类型定义 =====

/** 热榜条目（API 原始） */
interface BillboardRawItem {
  title: string;
  body: string;
  link_url: string;
  heat_score: number;
  type: string;
  answers?: { body: string }[];
}

/** 清洗后的话题数据（存入 DB） */
export interface TopicData {
  title: string;
  body: string;
  linkUrl: string;
  heatScore: number;
  type: string;
  topAnswer?: string;
}

// ===== 签名生成 =====

function generateSign(): {
  appKey: string;
  timestamp: string;
  logId: string;
  sign: string;
} {
  const appKey = ZHIHU_APP_KEY!;
  const appSecret = ZHIHU_APP_SECRET!;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const logId = `chatgal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const extraInfo = "";

  const signStr = `app_key:${appKey}|ts:${timestamp}|logid:${logId}|extra_info:${extraInfo}`;
  const hmac = createHmac("sha256", appSecret);
  hmac.update(signStr);
  const sign = hmac.digest("base64");

  return { appKey, timestamp, logId, sign };
}

// ===== 内存缓存 =====

let cachedList: TopicData[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 分钟

// ===== 热榜获取 =====

/**
 * 获取知乎热榜列表（带 10 分钟缓存）
 */
export async function fetchZhihuBillboard(): Promise<TopicData[]> {
  if (!ZHIHU_APP_KEY || !ZHIHU_APP_SECRET) {
    throw new Error("知乎 API 凭证未配置");
  }

  // 命中缓存
  if (cachedList && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedList;
  }

  const { appKey, timestamp, logId, sign } = generateSign();

  const url = new URL(`${BASE_URL}/openapi/billboard/list`);
  url.searchParams.set("top_cnt", "50");
  url.searchParams.set("publish_in_hours", "48");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-App-Key": appKey,
      "X-Timestamp": timestamp,
      "X-Log-Id": logId,
      "X-Sign": sign,
      "X-Extra-Info": "",
    },
  });

  if (res.status === 429) {
    // 限流时若有旧缓存则返回旧数据
    if (cachedList) return cachedList;
    throw new Error("知乎 API 限流，请稍后重试");
  }

  if (!res.ok) {
    throw new Error(`知乎 API 请求失败: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.status !== 0 || !json.data?.list) {
    throw new Error(json.msg || "获取热榜数据失败");
  }

  const rawList: BillboardRawItem[] = json.data.list;

  // 数据清洗：过滤空 body、截断长文本
  const cleaned: TopicData[] = rawList
    .filter((item) => item.title && item.body && item.body.trim().length > 0)
    .map((item) => ({
      title: item.title,
      body: item.body.slice(0, 500),
      linkUrl: item.link_url,
      heatScore: item.heat_score,
      type: item.type,
      topAnswer: item.answers?.[0]?.body
        ? item.answers[0].body.slice(0, 300)
        : undefined,
    }));

  // 更新缓存
  cachedList = cleaned;
  cacheTimestamp = Date.now();

  return cleaned;
}

// ===== 随机选题 =====

/**
 * 从热榜中随机选取一条话题
 */
export async function selectRandomTopic(): Promise<TopicData> {
  const list = await fetchZhihuBillboard();

  if (list.length === 0) {
    throw new Error("暂无热榜数据");
  }

  return list[Math.floor(Math.random() * list.length)];
}
