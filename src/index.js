// 保活目标 URL - 请根据需要修改
const TARGET_URL = "https://mk64-j7xs.onrender.com";

async function handleRequest() {
  const startTime = Date.now();
  
  try {
    // 发送请求到目标网站
    const response = await fetch(TARGET_URL, {
      headers: {
        'User-Agent': 'Render-KeepAlive-Bot/1.0'
      }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    const status = response.status;
    const success = status >= 200 && status < 300;
    
    const result = {
      success,
      status,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      target: TARGET_URL
    };
    
    console.log(`保活请求成功: ${JSON.stringify(result)}`);
    
    return new Response(JSON.stringify(result, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 200
    });
    
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const result = {
      success: false,
      error: error.message,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      target: TARGET_URL
    };
    
    console.error(`保活请求失败: ${JSON.stringify(result)}`);
    
    return new Response(JSON.stringify(result, null, 2), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      status: 500
    });
  }
}

// Cloudflare Worker 入口
export default {
  async fetch(request, env, ctx) {
    // 如果是 OPTIONS 请求，处理 CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }
    
    // 只允许 GET 请求
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    
    return handleRequest();
  },
  
  // 定时任务处理
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleRequest());
  }
};

