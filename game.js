// 游戏状态管理
const gameState = {
    playerCount: 2,
    players: [],
    currentScreen: 'setup'
};

// DOM 元素
const elements = {
    setupScreen: document.getElementById('setupScreen'),
    playerSelectionScreen: document.getElementById('playerSelectionScreen'),
    countdownScreen: document.getElementById('countdownScreen'),
    resultScreen: document.getElementById('resultScreen'),
    
    playerCountSelect: document.getElementById('playerCount'),
    startSetupBtn: document.getElementById('startSetup'),
    playGameBtn: document.getElementById('playGame'),
    playAgainBtn: document.getElementById('playAgain'),
    
    playersContainer: document.getElementById('playersContainer'),
    resultsContainer: document.getElementById('resultsContainer'),
    winnerDisplay: document.getElementById('winnerDisplay'),
    countdownNumber: document.getElementById('countdownNumber')
};

// 手势选项
const choices = [
    { name: '石头', icon: '✊', value: 'rock' },
    { name: '剪刀', icon: '✌️', value: 'scissors' },
    { name: '布', icon: '✋', value: 'paper' }
];

// 玩家名称列表
const playerNames = [
    '玩家 1', '玩家 2', '玩家 3', '玩家 4', '玩家 5',
    '玩家 6', '玩家 7', '玩家 8', '玩家 9', '玩家 10'
];

// 初始化游戏
function init() {
    // 绑定事件
    elements.startSetupBtn.addEventListener('click', startGameSetup);
    elements.playGameBtn.addEventListener('click', startCountdown);
    elements.playAgainBtn.addEventListener('click', resetGame);
    
    // 玩家数量选择变化时的视觉反馈
    elements.playerCountSelect.addEventListener('change', function() {
        this.style.transform = 'scale(1.02)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
}

// 开始游戏设置
function startGameSetup() {
    gameState.playerCount = parseInt(elements.playerCountSelect.value);
    gameState.players = [];
    
    // 创建玩家对象
    for (let i = 0; i < gameState.playerCount; i++) {
        gameState.players.push({
            id: i + 1,
            name: playerNames[i],
            choice: null
        });
    }
    
    // 渲染玩家选择界面
    renderPlayerSelection();
    
    // 切换屏幕
    switchScreen('playerSelection');
}

// 渲染玩家选择界面
function renderPlayerSelection() {
    elements.playersContainer.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerCard = createPlayerCard(player, index);
        elements.playersContainer.appendChild(playerCard);
    });
    
    // 禁用开始按钮
    elements.playGameBtn.disabled = true;
}

// 创建玩家卡片
function createPlayerCard(player, index) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.dataset.playerId = player.id;
    
    const choicesHTML = choices.map(choice => `
        <button class="choice-btn" data-choice="${choice.value}" data-player-id="${player.id}">
            <span class="choice-icon">${choice.icon}</span>
        </button>
    `).join('');
    
    card.innerHTML = `
        <div class="player-number">玩家 ${player.id}</div>
        <div class="player-name">${player.name}</div>
        <div class="choices">
            ${choicesHTML}
        </div>
    `;
    
    // 绑定手势选择事件
    const choiceBtns = card.querySelectorAll('.choice-btn');
    choiceBtns.forEach(btn => {
        btn.addEventListener('click', () => selectChoice(player.id, btn.dataset.choice, card));
    });
    
    return card;
}

// 选择手势
function selectChoice(playerId, choiceValue, card) {
    const player = gameState.players.find(p => p.id === parseInt(playerId));
    if (!player) return;
    
    player.choice = choiceValue;
    
    // 更新UI
    const allChoiceBtns = card.querySelectorAll('.choice-btn');
    const choicesContainer = card.querySelector('.choices');
    
    // 隐藏所有选择按钮
    allChoiceBtns.forEach(btn => btn.style.display = 'none');
    
    // 显示已选择提示（隐藏具体手势，只显示已选择状态）
    choicesContainer.innerHTML = `
        <div class="selected-choice hidden-choice">
            <span class="choice-icon">❓</span>
            <span class="choice-tip">已选择</span>
        </div>
    `;
    
    card.classList.add('selected');
    
    // 检查是否所有玩家都已选择
    checkAllPlayersSelected();
}

// 检查是否所有玩家都已选择
function checkAllPlayersSelected() {
    const allSelected = gameState.players.every(player => player.choice !== null);
    elements.playGameBtn.disabled = !allSelected;
    
    // 如果所有玩家都已选择，给开始按钮添加动画
    if (allSelected) {
        elements.playGameBtn.style.animation = 'pulse 1s ease-in-out infinite';
    } else {
        elements.playGameBtn.style.animation = 'none';
    }
}

// 开始倒计时
function startCountdown() {
    switchScreen('countdown');
    
    let count = 3;
    elements.countdownNumber.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        elements.countdownNumber.textContent = count;
        
        // 添加数字变化动画
        elements.countdownNumber.style.animation = 'none';
        setTimeout(() => {
            elements.countdownNumber.style.animation = 'pulse 1s ease-in-out';
        }, 10);
        
        if (count === 0) {
            clearInterval(countdownInterval);
            setTimeout(showResults, 500);
        }
    }, 1000);
}

// 显示结果
function showResults() {
    // 计算游戏结果
    const results = calculateResults();
    
    // 渲染结果界面
    renderResults(results);
    
    // 切换屏幕
    switchScreen('result');
}

// 计算游戏结果
function calculateResults() {
    const results = [];
    const playerChoices = gameState.players.map(p => p.choice);
    
    // 统计每种选择的数量
    const choiceCounts = {
        rock: 0,
        scissors: 0,
        paper: 0
    };
    
    playerChoices.forEach(choice => {
        if (choice) choiceCounts[choice]++;
    });
    
    // 确定获胜的选择
    let winningChoice = null;
    
    // 检查是否有明确的获胜者
    if (choiceCounts.rock > 0 && choiceCounts.scissors > 0 && choiceCounts.paper === 0) {
        winningChoice = 'rock'; // 石头赢剪刀
    } else if (choiceCounts.scissors > 0 && choiceCounts.paper > 0 && choiceCounts.rock === 0) {
        winningChoice = 'scissors'; // 剪刀赢布
    } else if (choiceCounts.paper > 0 && choiceCounts.rock > 0 && choiceCounts.scissors === 0) {
        winningChoice = 'paper'; // 布赢石头
    }
    // 如果三种都有或者只有一种，就是平局
    
    // 确定每个玩家的结果
    gameState.players.forEach(player => {
        let result = 'lose';
        if (winningChoice === null) {
            result = 'tie'; // 平局
        } else if (player.choice === winningChoice) {
            result = 'win'; // 获胜
        }
        
        results.push({
            ...player,
            result: result,
            choiceName: choices.find(c => c.value === player.choice)?.name,
            choiceIcon: choices.find(c => c.value === player.choice)?.icon
        });
    });
    
    return results;
}

// 渲染结果界面
function renderResults(results) {
    elements.resultsContainer.innerHTML = '';
    
    // 统计获胜者
    const winners = results.filter(r => r.result === 'win');
    
    // 渲染获胜者显示
    if (winners.length === 0) {
        elements.winnerDisplay.innerHTML = `
            <div class="winner-text">平局！</div>
            <div class="winner-name">再来一局</div>
        `;
    } else if (winners.length === 1) {
        elements.winnerDisplay.innerHTML = `
            <div class="winner-text">获胜者</div>
            <div class="winner-name">${winners[0].name}</div>
        `;
    } else {
        const winnerNames = winners.map(w => w.name).join('、');
        elements.winnerDisplay.innerHTML = `
            <div class="winner-text">并列获胜</div>
            <div class="winner-name">${winnerNames}</div>
        `;
    }
    
    // 渲染每个玩家的结果卡片
    results.forEach((result, index) => {
        const resultCard = createResultCard(result, index, result.result === 'win');
        elements.resultsContainer.appendChild(resultCard);
    });
}

// 创建结果卡片
function createResultCard(result, index, isWinner) {
    const card = document.createElement('div');
    card.className = `result-card ${isWinner ? 'winner' : ''}`;
    card.style.animationDelay = `${index * 100}ms`;
    
    let resultText = '';
    let resultColor = '';
    
    switch (result.result) {
        case 'win':
            resultText = '获胜！';
            resultColor = 'var(--success-color)';
            break;
        case 'lose':
            resultText = '失败';
            resultColor = 'var(--error-color)';
            break;
        case 'tie':
            resultText = '平局';
            resultColor = 'var(--warning-color)';
            break;
    }
    
    card.innerHTML = `
        <div class="player-number">玩家 ${result.id}</div>
        <div class="player-name">${result.name}</div>
        <div class="result-choice">${result.choiceIcon}</div>
        <div class="result-label" style="color: ${resultColor}">${resultText}</div>
    `;
    
    return card;
}

// 切换屏幕
function switchScreen(screenName) {
    // 隐藏所有屏幕
    elements.setupScreen.classList.remove('active');
    elements.playerSelectionScreen.classList.remove('active');
    elements.countdownScreen.classList.remove('active');
    elements.resultScreen.classList.remove('active');
    
    // 显示目标屏幕
    switch(screenName) {
        case 'setup':
            elements.setupScreen.classList.add('active');
            break;
        case 'playerSelection':
            elements.playerSelectionScreen.classList.add('active');
            break;
        case 'countdown':
            elements.countdownScreen.classList.add('active');
            break;
        case 'result':
            elements.resultScreen.classList.add('active');
            break;
    }
    
    gameState.currentScreen = screenName;
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 重置游戏
function resetGame() {
    // 重置游戏状态
    gameState.playerCount = 2;
    gameState.players = [];
    elements.playerCountSelect.value = '2';
    
    // 切换到设置界面
    switchScreen('setup');
}

// 页面加载完成后初始化游戏
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}