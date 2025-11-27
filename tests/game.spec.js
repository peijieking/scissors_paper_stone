const { test, expect } = require('@playwright/test');

test('页面加载测试', async ({ page }) => {
  // 导航到游戏页面
  await page.goto('http://localhost:49444');
  
  // 检查页面标题
  await expect(page).toHaveTitle('石头剪刀布 - 多人游戏');
  
  // 检查标题是否存在
  await expect(page.locator('.title')).toHaveText('石头 · 剪刀 · 布');
  
  // 检查副标题是否存在
  await expect(page.locator('.subtitle')).toHaveText('多人对战游戏');
});

test('玩家数量选择测试', async ({ page }) => {
  // 导航到游戏页面
  await page.goto('http://localhost:49444');
  
  // 检查默认选择的玩家数量
  const selectElement = page.locator('#playerCount');
  await expect(selectElement).toHaveValue('2');
  
  // 选择3人游戏
  await selectElement.selectOption('3');
  await expect(selectElement).toHaveValue('3');
  
  // 选择4人游戏
  await selectElement.selectOption('4');
  await expect(selectElement).toHaveValue('4');
});

test('游戏流程测试', async ({ page }) => {
  // 导航到游戏页面
  await page.goto('http://localhost:49444');
  
  // 选择2人游戏
  await page.locator('#playerCount').selectOption('2');
  
  // 点击开始游戏按钮
  await page.locator('#startSetup').click();
  
  // 检查是否进入玩家选择界面
  await expect(page.locator('.screen-title')).toHaveText('玩家选择');
  
  // 检查是否显示2个玩家卡片
  const playerCards = page.locator('.player-card');
  await expect(playerCards).toHaveCount(2);
  
  // 玩家1选择石头
  await page.locator('.player-card:nth-child(1) .choice-btn[data-choice="rock"]').click();
  
  // 玩家2选择剪刀
  await page.locator('.player-card:nth-child(2) .choice-btn[data-choice="scissors"]').click();
  
  // 检查开始对战按钮是否启用
  const playGameBtn = page.locator('#playGame');
  await expect(playGameBtn).not.toBeDisabled();
  
  // 点击开始对战按钮
  await playGameBtn.click();
  
  // 检查是否进入倒计时界面
  await expect(page.locator('#countdownScreen')).toBeVisible();
  
  // 等待倒计时结束和结果页面显示
  await page.waitForSelector('#resultScreen.active', { timeout: 5000 });
  
  // 检查结果页面标题
  await expect(page.locator('.screen-title')).toHaveText('游戏结果');
  
  // 检查获胜者是否是玩家1
  await expect(page.locator('.winner-name')).toHaveText('玩家 1');
  
  // 检查玩家1的结果卡片是否标记为获胜者
  const winnerCard = page.locator('.result-card.winner');
  await expect(winnerCard).toHaveCount(1);
  await expect(winnerCard.locator('.player-name')).toHaveText('玩家 1');
});

test('平局测试', async ({ page }) => {
  // 导航到游戏页面
  await page.goto('http://localhost:49444');
  
  // 选择2人游戏
  await page.locator('#playerCount').selectOption('2');
  
  // 点击开始游戏按钮
  await page.locator('#startSetup').click();
  
  // 两个玩家都选择石头
  await page.locator('.player-card:nth-child(1) .choice-btn[data-choice="rock"]').click();
  await page.locator('.player-card:nth-child(2) .choice-btn[data-choice="rock"]').click();
  
  // 点击开始对战按钮
  await page.locator('#playGame').click();
  
  // 等待结果页面显示
  await page.waitForSelector('#resultScreen.active', { timeout: 5000 });
  
  // 检查是否显示平局
  await expect(page.locator('.winner-text')).toHaveText('平局！');
  await expect(page.locator('.winner-name')).toHaveText('再来一局');
});

test('再玩一次功能测试', async ({ page }) => {
  // 导航到游戏页面
  await page.goto('http://localhost:49444');
  
  // 完成一次游戏
  await page.locator('#playerCount').selectOption('2');
  await page.locator('#startSetup').click();
  await page.locator('.player-card:nth-child(1) .choice-btn[data-choice="rock"]').click();
  await page.locator('.player-card:nth-child(2) .choice-btn[data-choice="scissors"]').click();
  await page.locator('#playGame').click();
  
  // 等待结果页面显示
  await page.waitForSelector('#resultScreen.active', { timeout: 5000 });
  
  // 点击再玩一次按钮
  await page.locator('#playAgain').click();
  
  // 检查是否回到设置界面
  await expect(page.locator('#setupScreen')).toBeVisible();
  await expect(page.locator('#playerCount')).toHaveValue('2');
});