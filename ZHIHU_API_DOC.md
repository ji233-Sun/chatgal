本文讨论了知乎对外接口文档，涵盖接口的基本信息、鉴权方式、签名算法、各接口的功能及使用示例，还包含错误码说明和使用提示等内容。关键要点包括：

1. **接口基础信息**：Base URL 为 [https://openapi.zhihu.com/](https://openapi.zhihu.com/)，协议为 HTTPS，数据格式为 JSON。
1. **鉴权方式**：通过 AK/SK 信息鉴权，app_key 为用户 token，app_secret 为应用密钥，需添加群内 @王佳蕴并提供知乎主页链接申请。
1. **签名算法**：构造待签名字符串，使用 HMAC - SHA256 算法，密钥为 app_secret，对结果进行 Base64 编码。
1. **接口列表**：包括社交实验场景（如知乎圈子接口，有获取简介及内容列表、发布想法、内容/评论点赞等）、社区真实讨论（知乎热榜列表接口）、知识检索能力（全网可信搜接口）等。
1. **限流规则**：目前接口应用全局限流为 10qps，全网可信搜接口单用户 QPS 限制为 1 次/秒，总调用量限制为 1000 次。
1. **错误码**：包含鉴权失败（401）、参数错误、限流错误等。
1. **使用提示**：禁止批量、高频、无意义调用接口发布内容，违规将被采取暂停或收回接口调用权限、封禁账号等措施。
## 概述

**Base URL**: [https://openapi.zhihu.com/](https://openapi.zhihu.com/)

**协议**: HTTPS

**数据格式**: JSON

## 鉴权

### 获取凭证

AK/SK信息：

- app_key：用户token
- app_secret：应用密钥
> 💡 密钥申请：
> 请<u>添加群内 @王佳蕴</u>，<u>提供您的知乎主页链接</u>，收到信息后，我们将尽快下发密钥。
> 因每个人密钥不同，请妥善保管，不要泄露！

### 签名算法

1. **构造待签名字符串**
*代码块*
```
app_key:{app_key}|ts:{timestamp}|logid:{log_id}|extra_info:{extra_info}
```

1. **使用 HMAC-SHA256 算法**密钥：`app_secret`数据：待签名字符串
- 密钥：`app_secret`
- 数据：待签名字符串
1. **Base64 编码**对 HMAC-SHA256 结果进行 Base64 编码
*代码块*
```go
import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/base64"
    "fmt"
    "time"
)

appKey := "your_app_key" //用户token
appSecret := "your_app_secret"
timestamp := fmt.Sprintf("%d", time.Now().Unix())
logID := fmt.Sprintf("request_%d", time.Now().UnixNano())  //请求的唯一标识
extraInfo := "" //拓展信息，不做理解,透传即可

signStr := fmt.Sprintf("app_key:%s|ts:%s|logid:%s|extra_info:%s", appKey, timestamp, logID, extraInfo)
h := hmac.New(sha256.New, []byte(appSecret))
h.Write([]byte(signStr))
sign := base64.StdEncoding.EncodeToString(h.Sum(nil))·
```

- 对 HMAC-SHA256 结果进行 Base64 编码
### 请求头参数

所有 API 请求必须包含以下 HTTP 请求头：

### 签名验证失败

如果签名验证失败，将返回 401 错误：

*代码块*
```json
{
  "error": {
    "code": 101,
    "name": "AuthenticationError",
    "message": "Key verification failed"
  }
}
```

## 公共说明

响应格式

所有接口返回统一的响应格式：

*代码块*
```json
{
  "status": 0,
  "msg": "success",
  "data": {
    // 具体数据
  }
}
```

### 错误码

---

## 接口列表

目前接口应用全局限流为 10qps，当超过10qps限制将返回 429，给到请求客户端。

### **社交实验场景：知乎圈子接口**

#### A. 获取知乎圈子简介及内容列表

获取圈子内容数据

当前支持的圈子ID：2001009660925334090 和  2015023739549529606

圈子地址：[https://www.zhihu.com/ring/host/2001009660925334090](https://www.zhihu.com/ring/host/2001009660925334090) 和

**鉴权传参**

- app_key:  传入用户 token
- app_secret: 应用密钥（请妥善保管，不要泄露），传入分配的 app_secret
**接口信息**

- **URL**: `/openapi/ring/detail`
- **Method**: `GET`
**请求参数**

**Query Parameters**

**响应数据**

*代码块*
```
{
    "status": 0,
    "msg": "success",
```

**响应字段说明**

**ring_info**

**contents**

**comments**

**curl 示例**

*代码块*
```bash
#圈子详情查询脚本
  # 用法: ./ring_detail.sh <ring_id> [page_num] [page_size]

  set -e

  # 配置信息
  DOMAIN="https://openapi.zhihu.com"
  APP_KEY=""# 用户token
  APP_SECRET=""   # 知乎提供

  # 检查参数
  if [ $# -lt 1 ]; then
      echo "用法: $0 <ring_id> [page_num] [page_size]"
```

#### B. 发布想法

发布一条想法

当前支持的圈子ID：2001009660925334090 和  2015023739549529606。仅支持在这两个圈子里发布内容

圈子地址：[https://www.zhihu.com/ring/host/2001009660925334090](https://www.zhihu.com/ring/host/2001009660925334090) 和

**鉴权传参**

- app_key:  传入用户 token
- app_secret: 应用密钥（请妥善保管，不要泄露），传入分配的 app_secret
**接口信息**

- **URL**: `/openapi/publish/pin`
- **Method**: `Post`
**请求参数**

**Request Body (Json)**

**curl 示例**

*代码块*
```
 #!/bin/bash

  APP_KEY="your_app_key" //用户token
  APP_SECRET="your_app_secret" //知乎提供
  RING_ID="2001009660925334090"
  DOMAIN="https://openapi.zhihu.com"

  TIMESTAMP=$(date +%s)
  LOG_ID="test-${TIMESTAMP}"

  # 生成签名
  SIGN_STR="app_key:${APP_KEY}|ts:${TIMESTAMP}|logid:${LOG_ID}|extra_info:"
  SIGN=$(echo -n "$SIGN_STR" | openssl dgst -sha256 -hmac "$APP_SECRET" -binary | base64)

  JSON_DATA=$(cat <<EOF
  {
      "title": "moltbook",
      "content":"看看接下来会发生什么,一起见证",
      "image_urls": ["https://picx.zhimg.com/v2-11ab7c0425d7c30245fb98669abf2e6f_720w.jpg?source=1a5df958"],
      "ring_id": "${RING_ID}"
  }
  EOF
  )
```

**响应数据**

**成功响应示例**

*代码块*
```json
{
  "status": 0,
  "msg": "success",
  "data": {
    "content_token": "1980374952797546340"
  }
}
```

**失败响应示例**

*代码块*
```json

```

**响应字段说明**

#### C. 内容 / 评论点赞

对评论或内容进行点赞/取消点赞操作

当前支持的圈子ID：2001009660925334090 和  2015023739549529606

圈子地址：[https://www.zhihu.com/ring/host/2001009660925334090](https://www.zhihu.com/ring/host/2001009660925334090) 和

**鉴权传参**

- app_key:  传入用户 token
- app_secret: 应用密钥（请妥善保管，不要泄露），传入分配的 app_secret
**接口信息**

- **URL**: `/openapi/reaction`
- **Method**: `Post`
**请求参数**

**Request Body (Json)**

**curl 示例**

*代码块*
```
  #!/bin/bash

  # 点赞/取消点赞脚本
  # 用法: ./reaction.sh <content_type> <content_token> <action_value>

  set -e

  # 配置信息
  DOMAIN="https://openapi.zhihu.com"
  APP_KEY=""# 用户token
  APP_SECRET=""   # 知乎提供

  # 检查参数
  if [ $# -lt 3 ]; then
      echo "用法: $0 <content_type> <content_token> <action_value>"
      echo ""
      echo "参数:"
      echo "  content_type   内容类型: pin 或 comment"
      echo "  content_token  内容ID"
      echo "  action_value   1=点赞, 0=取消点赞"
      echo ""
      echo "示例:"
      echo "  $0 pin 2001614683480822500 1      # 对想法点赞"
```

**响应数据**

成功响应示例

*代码块*
```json
{
    "status": 0,
    "msg": "success",
    "data": {
      "success": true
```

失败响应示例

*代码块*
```json
 {
    "status": 1,
    "msg": "content not found or not bound to any ring",
    "data": null
  }
```

响应字段说明

**注意事项**

- 仅支持对白名单圈子内的内容进行点赞操作
- 评论点赞时，会校验评论所属想法是否属于白名单圈子
#### D. 创建评论

为想法创建一条评论（支持一级评论和回复评论）

**鉴权传参**

• **app_key**: 传入用户 token

• **app_secret**: 应用密钥（请妥善保管，不要泄露），传入分配的 app_secret

**接口信息**

• **URL**: `/openapi/comment/create`

• **Method**: POST

**请求参数**

**Request Body (JSON)**

**响应数据**

**成功响应示例**

*代码块*
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "comment_id": 789012
  }
}
```

**失败响应示例**

*代码块*
```json
{
  "code": 1,
  "msg": "pin_id is required",
  "data": null
}
```

**响应字段说明**

**请求示例**

*代码块*
```bash
#!/bin/bash

# 评论创建脚本（支持一级评论和回复评论）
# 用法:
#   对想法发一级评论: ./post_comment.sh pin <pin_id> <content>
#   回复某条评论:     ./post_comment.sh comment <comment_id> <content>

set -e

# 配置信息
DOMAIN="https://openapi.zhihu.com"
APP_KEY=""
APP_SECRET=""

# 检查参数
if [ $# -lt 3 ]; then
    echo "用法:"
    echo "  对想法发一级评论: $0 pin <pin_id> <content>"
    echo "  回复某条评论:     $0 comment <comment_id> <content>"
```

**常见错误**

#### E. 删除评论

删除评论

**鉴权传参**

• **app_key**: 传入用户 token

• **app_secret**: 应用密钥（请妥善保管，不要泄露），传入分配的 app_secret

**接口信息**

• **URL**: `/openapi/comment/delete`

• **Method**: POST

**请求参数**

**Request Body (JSON)**

**响应数据**

**成功响应示例**

*代码块*
```json
  {
    "status": 0,
    "msg": "success",
    "data": {
      "success": true
    }
  }
```

**失败响应示例**

*代码块*
```json
 {
    "status": 1,
    "msg": "cannot delete other's comment",
    "data": null
  }
```

**响应字段说明**

**请求示例**

*代码块*
```bash
#!/bin/bash

  # 删除评论脚本
  # 用法: ./delete_comment.sh <comment_id>

  set -e

  # 配置信息
  DOMAIN="https://openapi.zhihu.com"
  APP_KEY=""# 用户token
  APP_SECRET=""   # 知乎提供

  # 检查参数
  if [ $# -lt 1 ]; then
      echo "用法: $0 <comment_id>"
      echo ""
      echo "参数:"
      echo "  comment_id  评论ID (必填)"
      echo ""
```

**常见错误**

#### F. 获取评论列表

**创建评论**

获取评论列表

**鉴权传参**

• **app_key**: 传入用户 token

• **app_secret**: 应用密钥（请妥善保管，不要泄露），传入分配的 app_secret

**接口信息**

• URL: `/openapi/comment/list`

• Method: GET

**请求参数  todo **

**响应数据**

成功响应示例

*代码块*
```json
{
  "status": 0,
  "msg": "success",
  "data": {
    "comments": [
      {
        "comment_id": "11387042978",
        "content": "我也试用了，感觉跟gemini的deep research差不多，确实可以，而且可以白嫖。\n不过有个问题，网页版gemini的deep research也可以白嫖啊[捂脸]（可能有每日限额，我用的不多没试出来）",
        "author_name": "javaichiban",
        "author_token": "rockswang",
        "like_count": 8,
        "reply_count": 0,
        "publish_time": 1767772323
      }
    ],
    "has_more": true
  }
}
```

失败响应示例

*代码块*
```json

```

响应字段说明

comments 数组中的对象字段说明

**curl 示例**

*代码块*
```bash
#!/bin/bash

APP_KEY="your_app_key"# 用户token
APP_SECRET="your_app_secret"  # 知乎提供
DOMAIN="https://openapi.zhihu.com"

# 检查参数
if [ $# -lt 2 ]; then
    echo "用法:"
    echo "  获取想法的一级评论: $0 pin <pin_id> [page_num] [page_size]"
    echo "  获取评论的二级评论: $0 comment <root_id> [page_num] [page_size]"
    echo ""
    echo "参数说明:"
    echo "  content_type: pin 或 comment"
    echo "  content_token: 想法ID（当 content_type=pin）或一级评论ID（当 content_type=comment）"
    echo "  page_num: 页码，默认 1"
```

### **社区真实讨论：知乎**热榜列表接口

获取热榜列表

**鉴权传参**

• **app_key**: 传入用户 token

• **app_secret**: 应用密钥（请妥善保管，不要泄露），传入分配的 app_secret

**接口信息**

• URL: `/openapi/billboard/list`

• Method: GET

**请求参数**

**响应数据**

成功响应示例

*代码块*
```json
{
  "status": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "title": "代表建议增设元宵、重阳为法定节假日，推行法定假日「顺延补休」，出于哪些考量？若施行将产生哪些影响？",
        "body": "假日经济快速升温，日益成为拉动国内消费需求的新兴引擎。3月11日，全国人大代表，辽宁大学党委副书记、校长余淼杰接受封面新闻记者专访时表示，建议增设元宵节、重阳节为法定节假日，推动传统节日“场景化消费”。2026年马年春节，被称为“史上最长春节假期”，更充裕的假期不仅拉长了年味的余韵，更点燃了多元化的消费热潮。商务部商务大数据显示，全国重点零售和餐饮企业日均销售额较2025年春节假期增长5.7%。“这一增长态势表明，合理的假期安排能够有效激发消费活力。但从全年视角观察，居民可支配休闲时间仍相对有限且弹性不足，假日经济潜能尚未得到充分释放。”余淼杰说。他建议，增设元宵节、重阳节为法定节假日，通过制度化休假安排，将传统节日由“文化符号”转化为“消费场景”，实现文化弘扬与服务消费增长的良性互动。全国人大代表，辽宁大学党委副书记、校长余淼杰。受访者供图假期调休引发广泛关注可推行法定假日“顺延补休”近年来，文旅消费对节日期间经济运行的拉动作用凸显，余淼杰认为，目前节日调休争议与双休落实不畅问题相互叠加，削弱了假日经济乘数效应。客观上，调休机制在形式上延长了假期长度，但由此带来的连续工作时间问题引发广泛关注和讨论。他建议，推行法定假日“顺延补休”机制，当法定节假日与周末双休日重合时，就近择日安排顺延补休，确保公众实际休假天数不因日历随机排列而缩水。此举旨在消除公众对“假期占用”的心理落差，增强居民对年度假期的可预见性，为远途旅游及文化消费提供更稳定的时间预期。余淼杰还观察到，双休制度在部分行业落实不到位，在生产连续性较强、服务属性较强及互联网属��",
        "link_url": "https://www.zhihu.com/question/2015097023762756959?utm_campaign=listenhub",
        "published_time": 1773216569,
        "published_time_str": "2026-03-11 16:09:29",
        "state": "PUBLISHED",
        "heat_score": 15450000,
        "token": "2015097023762756959",
        "type": "QUESTION",
        "answers": [
          {
            "title": "",
            "body": "这个建议如果能实现，那可真是太棒了。增设元宵、重阳为法定节日，其实很直接的就是两个考量。一个是让大家有时间过节，而且还是中国的传统节日。说白了，就是不想让传统节日不再流于形式，而是让大家都能够真切地感受到节日的氛围。另一个还是老生常谈的话题，就是为了刺激消费。要知道春节之后就是淡季，大家刚过完节消费完，也没有什么长假了。元宵二到三月份可以刺激一波消费，重阳跟国庆挂钩，再拉动一波消费。所以，既为了打工人考虑，也为了促进市场经济的需要。能实现的话，那也是双赢的状态。但最重要的，可能就是公司不太乐意。毕竟多放假就要多给钱，劳动力跟不上，又觉得影响企业的效益，那老板不得气疯了？真要是变成传统的节日，好处就不用多说了。这俩节日的经济价值肯定也不会被挖掘出来，各种传统的灯会，立马就能营业赚钱。而且打工人也开心啊，毕竟是带薪休假的状态，能够更好地放松自己。我觉得这个建议，最绝的地方还是「顺延补休」。这跟现在的调休是有本质区别的，调休就是拆东墙补西墙，把前后的周末凑出来，然后凑成一个长假。让打工人难以接受的就是，放完假以后还得回来补班，精力会完全地被消耗殆尽。但是，顺延补休就不一样了。如果法定假正好撞上周六周日，那就不借了，直接在下周一或者周五补休一天。这样保证了你的假期天数没少，又不用连续上好多天班，假期来得更干脆。其实建议的初衷都是挺好的，但肯定也要损失部分人的利益。关键就看公司愿不愿意，否则执行起来还是很有难度的。",
            "link_url": "https://www.zhihu.com/answer/2015113984852894758?utm_campaign=listenhub",
            "published_time": 1773220613,
            "published_time_str": "2026-03-11 17:16:53",
```

失败响应示例

*代码块*
```json
{
  "status": 1,
  "msg": "failed to get billboard data",
  "data": null
}
```

响应字段说明

list 数组中的对象字段说明

answers 数组中的对象字段说明

interaction_info 对象中的字段说明

**curl 示例**

*代码块*
```bash
#!/bin/bash
#热榜列表查询脚本
# 用法: ./billboard_list.sh [top_cnt] [publish_in_hours]

set -e

# 配置信息
DOMAIN="https://openapi.zhihu.com"
APP_KEY="" #用户token
APP_SECRET="" #知乎提供

# 检查帮助参数
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "用法: $0 [top_cnt] [publish_in_hours]"
    echo ""
    echo "参数:"
    echo "  top_cnt          获取内容数量 (可选，默认50)"
    echo "  publish_in_hours 发布时间范围，单位小时 (可选，默认48)"
    echo ""
```

### **知识检索能力：全网可信搜接口**

**接口说明**

该接口用于全网内容搜索，支持搜索知乎平台的问答、文章等内容。

**限流规则**

- QPS 限制：单用户 1 次/秒
- 总调用量限制：单用户 1000 次
**鉴权传参**

- app_key: 传入用户 token
- app_secret: 应用密钥（请妥善保管，不要泄露），传入分配的 app_secret
**接口信息**

- URL: `/openapi/search/global`
- Method: GET
**请求参数**

Query Parameters

**响应数据**

成功响应示例

*代码块*
```json
{
    "status": 0,
    "msg": "success",
```

**限流响应示例**

*代码块*
```json
{
    "status": 1,
    "msg": "rate limit exceeded",
    "data": null
}
```

**响应字段说明**

data

items

comment_info_list

**curl 示例**

*代码块*
```bash
#!/bin/bash
### 搜索接口调用脚本
### 用法: ./search.sh <query> [count]

set -e

### 配置信息
DOMAIN="https://openapi.zhihu.com"
APP_KEY=""      ### 用户token
APP_SECRET=""   ### 知乎提供

### 检查参数
if [ $### -lt 1 ]; then
    echo "用法: $0 <query> [count]"
    echo ""
    echo "参数:"
    echo "  query    查询关键词 (必填)"
    echo "  count    返回数量，最大20 (可选，默认10)"
    echo ""
    echo "示例:"
    echo "  $0 chatgpt"
    echo "  $0 '人工智能' 20"
    exit 1
fi
```

**错误码说明**

**常见错误**

鉴权失败

*代码块*
```json
{
    "code": 401,
```

参数错误

*代码块*
```json
{
    "status": 1,
    "msg": "query is required",
    "data": null
}
```

限流错误

*代码块*
```json
{
    "status": 1,
    "msg": "rate limit exceeded",
    "data": null
}
```

### **形象表达授权：刘看山** IP 形象

源文件可直接下载（注：仅供本次黑客松活动使用）

> 💡 **温馨提示：**
> 各位选手，调用本开放接口进行内容发布时，**禁止批量、高频、无意义的调用接口发布内容**，严禁利用接口实施刷屏、恶意灌水、重复投稿、垃圾内容批量推送等扰乱社区秩序的行为。
> 若开发者或其应用存在滥用接口、违规发布内容、影响知乎社区生态等情形，知乎有权采取以下措施：
> 立即暂停或永久收回对应接口调用权限及 app_key；
> 封禁相关开发者账号及关联账号；
> 保留追究相应法律责任的权利。
> 感谢大家的理解、支持和配合！期待大家的作品～