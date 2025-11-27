// playwright.config.js
const { devices } = require('@playwright/test');

module.exports = {
  // 测试文件目录
  testDir: './tests',
  // 测试超时时间
  timeout: 30000,
  // 并发测试数量
  workers: process.env.CI ? 1 : undefined,
  // 报告格式
  reporter: 'html',
  // 配置浏览器
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  // 服务器配置
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:49444',
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
}