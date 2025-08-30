# 代理腳本範例

以下是一個代理腳本範例，可與 `GEMINI_SANDBOX_PROXY_COMMAND` 環境變數一起使用。此腳本僅允許對 `example.com:443` 的 `HTTPS` 連線，並拒絕所有其他請求。

```javascript
#!/usr/bin/env node

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// 範例代理伺服器，監聽 :::8877 並僅允許對 example.com 的 HTTPS 連線。
// 設定 `GEMINI_SANDBOX_PROXY_COMMAND=scripts/example-proxy.js` 以與沙箱一起執行代理
// 透過沙箱內的 `curl https://example.com` 測試（在 shell 模式或透過 shell 工具）

import http from 'node:http';
import net from 'node:net';
import { URL } from 'node:url';
import console from 'node:console';

const PROXY_PORT = 8877;
const ALLOWED_DOMAINS = ['example.com', 'googleapis.com'];
const ALLOWED_PORT = '443';

const server = http.createServer((req, res) => {
  // 拒絕除 CONNECT 以外的所有 HTTPS 請求
  console.log(
    `[PROXY] Denying non-CONNECT request for: ${req.method} ${req.url}`,
  );
  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('Method Not Allowed');
});

server.on('connect', (req, clientSocket, head) => {
  // 對於 CONNECT 請求，req.url 將採用 "hostname:port" 格式。
  const { port, hostname } = new URL(`http://${req.url}`);

  console.log(`[PROXY] Intercepted CONNECT request for: ${hostname}:${port}`);

  if (
    ALLOWED_DOMAINS.some(
      (domain) => hostname == domain || hostname.endsWith(`.${domain}`),
    ) &&
    port === ALLOWED_PORT
  ) {
    console.log(`[PROXY] Allowing connection to ${hostname}:${port}`);

    // 建立到原始目的地的 TCP 連線。
    const serverSocket = net.connect(port, hostname, () => {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      // 透過在用戶端和目的地伺服器之間管道化資料來建立隧道。
      serverSocket.write(head);
      serverSocket.pipe(clientSocket);
      clientSocket.pipe(serverSocket);
    });

    serverSocket.on('error', (err) => {
      console.error(`[PROXY] Error connecting to destination: ${err.message}`);
      clientSocket.end(`HTTP/1.1 502 Bad Gateway\r\n\r\n`);
    });
  } else {
    console.log(`[PROXY] Denying connection to ${hostname}:${port}`);
    clientSocket.end('HTTP/1.1 403 Forbidden\r\n\r\n');
  }

  clientSocket.on('error', (err) => {
    // 如果用戶端掛斷，這可能會發生。
    console.error(`[PROXY] Client socket error: ${err.message}`);
  });
});

server.listen(PROXY_PORT, () => {
  const address = server.address();
  console.log(`[PROXY] Proxy listening on ${address.address}:${address.port}`);
  console.log(
    `[PROXY] Allowing HTTPS connections to domains: ${ALLOWED_DOMAINS.join(', ')}`,
  );
});
```
