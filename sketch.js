let spriteSheet;
let walkSheet;
let jumpImage;
let playerHitImage, playerDeadSheet, npc2Sheet, npc2WalkSheet, npc2DeadSheet, npc3Image, npc3WalkSheet, npc3DeadSheet, npc4Image, npc4WalkSheet, npc4DeadSheet, npc5Sheet, npc5LonelySheet, npc5WalkSheet, collectibleImage, questionTable, restartButton;
let bg1, bg2, bg3, bg4;
let currentScene = 1;
let quizCooldown = 0;
let usedQuestionIndices = []; // ★ 新增：記錄已使用的題目索引，確保不重複
let portalImage;
let gateOpen = false;
let gameWon = false;
let gameState = 'start'; // ★ 新增：遊戲狀態 ('start', 'playing')
let startButton; // ★ 新增：開始按鈕
const CHAR_SCALE = 1.5; // 全域角色縮放比例 (原為2，改為1.5即為75%)
let platforms = []; // 儲存平台資訊的陣列
let ladders = []; // ★ 新增：儲存梯子資訊的陣列
let debugMode = false; // ★ 開啟除錯模式：設為 true 可看到紅色的碰撞方塊，方便調整位置

// ★ 新增：基準解析度 (解決縮放偏移問題)
// 請將這兩個數值設定為您「測量座標時」的視窗寬高
// 您可以在瀏覽器 Console (F12) 看到程式印出的目前視窗大小
const baseWidth = 1536; // 範例值，請根據您的螢幕調整 (常見有 1920, 1536, 1280)
const baseHeight = 750; // 範例值，請根據您的螢幕調整 (常見有 1080, 864, 720)

// --- 動畫影格數據 ---
// 站立 (idle) 動畫
const idleFrames = [
  { x: 0, y: 0, w: 54, h: 50 },
  { x: 72, y: 0, w: 54, h: 50 },
  { x: 144, y: 0, w: 54, h: 50 }
];
// 走路 (walk) 動畫 (總寬 405, 6 影格, 每格約 67px)
const walkFrames = [
  { x: 0, y: 0, w: 67, h: 87 },
  { x: 68, y: 0, w: 67, h: 87 },
  { x: 136, y: 0, w: 67, h: 87 },
  { x: 204, y: 0, w: 67, h: 87 },
  { x: 272, y: 0, w: 67, h: 87 },
  { x: 340, y: 0, w: 67, h: 87 }
];

// NPC 2 動畫 (118x36, 3 frames)
const npc2Frames = [
  { x: 0, y: 0, w: 39, h: 36 },
  { x: 39, y: 0, w: 39, h: 36 },
  { x: 78, y: 0, w: 39, h: 36 },
];
// NPC 5 動畫 (172x35, 3 frames)
const npc5Frames = [
  { x: 0, y: 0, w: 57, h: 35 },
  { x: 57, y: 0, w: 57, h: 35 },
  { x: 114, y: 0, w: 57, h: 35 },
];
// NPC 5 孤單動畫 (115*28, 2 frames)
const npc5LonelyFrames = [
  { x: 0, y: 0, w: 57, h: 28 },
  { x: 58, y: 0, w: 57, h: 28 },
];
// NPC 5 走路動畫 (175*34, 3 frames)
const npc5WalkFrames = [
  { x: 0, y: 0, w: 58, h: 34 },
  { x: 59, y: 0, w: 58, h: 34 },
  { x: 117, y: 0, w: 58, h: 34 },
];

// --- NPC 走路動畫 ---
// 2/moving/4.png, 158*32, 4 frames
const npc2WalkFrames = [
  { x: 0, y: 0, w: 39, h: 32 },
  { x: 40, y: 0, w: 39, h: 32 },
  { x: 79, y: 0, w: 39, h: 32 },
  { x: 119, y: 0, w: 39, h: 32 },
];
// 3/moving/4.png, 282*77, 4 frames
const npc3WalkFrames = [
  { x: 0, y: 0, w: 70, h: 77 },
  { x: 71, y: 0, w: 70, h: 77 },
  { x: 142, y: 0, w: 70, h: 77 },
  { x: 213, y: 0, w: 70, h: 77 },
];
// 4/moving/3.png, 130*35, 3 frames
const npc4WalkFrames = [
  { x: 0, y: 0, w: 43, h: 35 },
  { x: 44, y: 0, w: 43, h: 35 },
  { x: 88, y: 0, w: 43, h: 35 },
];
// --- NPC 死亡動畫 ---
// 2/dead/5.png, 213*37, 5 frames
const npc2DeadFrames = [
  { x: 0, y: 0, w: 42, h: 37 },
  { x: 43, y: 0, w: 42, h: 37 },
  { x: 86, y: 0, w: 42, h: 37 },
  { x: 129, y: 0, w: 42, h: 37 },
  { x: 172, y: 0, w: 42, h: 37 },
];
// 3/dead/5.png, 320*93, 5 frames
const npc3DeadFrames = [
  { x: 0, y: 0, w: 64, h: 93 },
  { x: 64, y: 0, w: 64, h: 93 },
  { x: 128, y: 0, w: 64, h: 93 },
  { x: 192, y: 0, w: 64, h: 93 },
  { x: 256, y: 0, w: 64, h: 93 },
];
// 4/dead/4.png, 198*39, 4 frames
const npc4DeadFrames = [
  { x: 0, y: 0, w: 49, h: 39 },
  { x: 50, y: 0, w: 49, h: 39 },
  { x: 100, y: 0, w: 49, h: 39 },
  { x: 150, y: 0, w: 49, h: 39 },
];
// 玩家死亡動畫 (214*65, 4 frames)
const playerDeadFrames = [
  { x: 0, y: 0, w: 53, h: 65 },
  { x: 54, y: 0, w: 53, h: 65 },
  { x: 108, y: 0, w: 53, h: 65 },
  { x: 162, y: 0, w: 53, h: 65 },
];



let npcs = []; // 儲存所有NPC的陣列
let collectibles = []; // 儲存所有蒐集品的陣列

// --- 角色屬性 ---
let player = {
  x: 0,
  y: 0,
  speed: 10,
  isFacingRight: false,
  lives: 3,
  state: 'idle', // 'idle', 'walking', 'jumping', 'hit', 'dead'
  hitTimer: 0,
  w: 0, // ★ 新增：固定的物理寬度
  h: 0  // ★ 新增：固定的物理高度
};

// --- 狀態機 ---
let isMovingHorizontally = false; // 只追蹤水平移動

// --- 物理引擎 ---
let velocityY = 0;
const gravity = 1.9;
const jumpForce = -16; // 增加跳躍力道，確保能跳上 50px 高的平台
let onGround = true;
let groundY; // 地面的Y座標

// 為了方便切換，將影格尺寸設為變數
let currentFrameWidth = idleFrames[0].w;
let currentFrameHeight = idleFrames[0].h;

// 互動相關
let hasPotion = false; // 玩家是否已撿到藥瓶
let showNpc5Effect = 0; // 用於顯示NPC5特效的計時器
let activeNpc = null; // 當前互動的NPC
let answerInput;
let currentQuestion = {};


// 在 setup() 之前預載入圖片
function preload() {
  // 為了避免卡在 Loading 畫面，我們將圖片載入移至 setup()
  // 這樣即使圖片載入失敗，遊戲也能執行
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  document.title = "教心大冒險"; // 設定網頁標題
  console.log(`目前視窗大小: ${windowWidth} x ${windowHeight}。如果不符，請修改程式碼最上方的 baseWidth / baseHeight`);
  // 減慢動畫影格率，讓角色動畫更清晰
  frameRate(20); // 稍微提高影格率讓移動和跳躍更流暢

  // --- 載入圖片資源 (移至 setup 以避免阻塞) ---
  spriteSheet = loadImage('1/stop/0.png');
  walkSheet = loadImage('1/walk/6.png');
  jumpImage = loadImage('1/jump/0.png');
  playerHitImage = loadImage('1/hit/0.png');
  playerDeadSheet = loadImage('1/dead/4.png');

  npc2Sheet = loadImage('2/stop/3.png');
  npc3Image = loadImage('3/stop/0.png');
  npc4Image = loadImage('4/stop/0.png');
  npc5Sheet = loadImage('5/stop/0.png');

  npc2WalkSheet = loadImage('2/moving/4.png');
  npc3WalkSheet = loadImage('3/moving/4.png');
  npc4WalkSheet = loadImage('4/moving/3.png');
  npc2DeadSheet = loadImage('2/dead/5.png');
  npc3DeadSheet = loadImage('3/dead/5.png');
  npc4DeadSheet = loadImage('4/dead/4.png');

  npc5LonelySheet = loadImage('5/lonely/2.png');
  npc5WalkSheet = loadImage('5/moving/3.png');
  collectibleImage = loadImage('5/123.png');
  bg1 = loadImage('bg/1.png');
  bg2 = loadImage('bg/2.png');
  bg3 = loadImage('bg/3.png');
  bg4 = loadImage('bg/4.png');
  portalImage = loadImage('bg/5.png');
  portalHintImage = loadImage('bg/6.png');

  // 將 CSV 載入移至 setup 並加入錯誤處理，避免因讀取失敗卡在 Loading
  loadTable('quiz.csv', 'csv', 'header', (table) => {
    questionTable = table;
    console.log("題庫載入成功");
  }, (err) => {
    console.error("題庫載入失敗 (可能是路徑錯誤或 CORS 問題):", err);
  });

  // 將地面設定在畫布的垂直中心
  groundY = height / 2;
  // 將角色的初始位置設定在中央地面上
  // 注意：setupScene 會重新設定這些，這裡只是初始值
  currentFrameWidth = idleFrames[0].w * CHAR_SCALE;
  currentFrameHeight = idleFrames[0].h * CHAR_SCALE;
  player.x = width / 2 - currentFrameWidth / 2;
  player.y = groundY - currentFrameHeight;
  player.lives = 3;
  player.state = 'idle';
  
  // ★ 初始化固定的物理碰撞箱大小 (使用待機時的尺寸作為基準)
  player.w = idleFrames[0].w * CHAR_SCALE;
  player.h = idleFrames[0].h * CHAR_SCALE;

  gameWon = false;
  gameState = 'start'; // ★ 設定初始狀態為開始畫面

  // 初始化場景
  currentScene = 1;
  setupScene(currentScene);

  // --- 建立輸入框 ---
  answerInput = createInput('');
  answerInput.size(200);
  answerInput.hide();
  answerInput.changed(checkAnswer);

  // 如果按鈕不存在，則建立它
  if (!restartButton) {
    restartButton = createButton('再來一次');
    restartButton.mousePressed(resetGame);
  }
  restartButton.position(width / 2 - restartButton.width / 2, height / 2 + 50);
  restartButton.hide(); // 每次setup都確保按鈕是隱藏的

  // ★ 新增：建立開始按鈕 (楓之谷風格)
  if (!startButton) {
    startButton = createButton('開始冒險');
    startButton.mousePressed(startGame);
    // CSS 樣式設定
    startButton.style('font-family', '"Microsoft JhengHei", sans-serif');
    startButton.style('font-size', '24px');
    startButton.style('font-weight', 'bold');
    startButton.style('color', '#FFFFFF');
    startButton.style('background', 'linear-gradient(to bottom, #FFD700, #FF8C00)'); // 金黃漸層
    startButton.style('border', '3px solid #FFFFFF');
    startButton.style('border-radius', '20px');
    startButton.style('padding', '10px 0px');
    startButton.style('box-shadow', '0px 4px 0px #8B4513, 0px 0px 15px rgba(255, 215, 0, 0.6)'); // 立體陰影與發光
    startButton.style('text-shadow', '1px 1px 0px #8B4513');
    startButton.style('cursor', 'pointer');
    startButton.size(200, 60);
  }
  startButton.show();
  startButton.position(width / 2 - 100, height / 2 + 60);
}

function draw() {
  // ★ 新增：檢查遊戲狀態，如果是開始畫面則繪製介面並阻斷後續邏輯
  if (gameState === 'start') {
    drawStartScreen();
    return;
  }

  // 設定背景顏色
  if (currentScene === 1 && bg1 && bg1.width > 1) {
    background(bg1);
  } else if (currentScene === 2 && bg2 && bg2.width > 1) {
    background(bg2);
  } else if (currentScene === 3 && bg3 && bg3.width > 1) {
    background(bg3);
  } else {
    background('#FFA042');
  }

  // 如果傳送門開啟，繪製傳送門
  if (gateOpen) {
    // 設定傳送門尺寸為玩家(走路狀態)的 1.5 倍
    let portalW = walkFrames[0].w * CHAR_SCALE * 1.5;
    let portalH = walkFrames[0].h * CHAR_SCALE * 1.5;
    
    let portalX, portalY;
    if (currentScene === 2) {
      let sx = width / baseWidth;
      let sy = height / baseHeight;
      portalX = 1465 * sx; // ★ 修改：傳送門改至最右邊 (對應平台位置)
      portalY = 451 * sy - portalH + 15; 
    } else {
      // 其他關卡：將傳送門放在最後一個平台上方
      portalX = (platforms.length > 0) ? (platforms[platforms.length-1].x + platforms[platforms.length-1].w - portalW - 50) : (width - portalW - 20);
      portalY = (platforms.length > 0) ? (platforms[platforms.length-1].y - portalH + 15) : (groundY - portalH + 15);
    }

    if (portalImage && portalImage.width > 1) {
      image(portalImage, portalX, portalY, portalW, portalH);
    } else {
      // 備用圖形 (當圖片未載入時顯示，確保玩家能看到傳送門位置)
      push();
      fill(100, 200, 255, 150);
      rect(portalX, portalY, portalW, portalH);
      pop();
    }

    // --- 傳送門互動邏輯 ---
    // 簡單的碰撞檢測 (使用 player.w/h 物理大小)
    if (player.x + player.w > portalX && player.x < portalX + portalW &&
        player.y + player.h > portalY && player.y < portalY + portalH) {
      
      // 踩到直接傳送至下一幕
      currentScene++;
      setupScene(currentScene);
      // 重置玩家位置 (從左上方落下)
      player.x = 50;
      player.y = 50;
      velocityY = 0;
    }
  }

  isMovingHorizontally = false; // 每幀開始時重置水平移動狀態

  if (quizCooldown > 0) {
    quizCooldown--;
  }

    // --- 梯子邏輯 ---
    let touchingLadder = false;
    let targetLadder = null;
    let playerCenterX = player.x + player.w / 2;
    
    for (let l of ladders) {
      // ★ 修改：增加 X 軸判定容許值 (+/- 10)，讓梯子更容易觸發
      if (playerCenterX >= l.x - 10 && playerCenterX <= l.x + l.w + 10 &&
          player.y + player.h >= l.y && player.y <= l.y + l.h) {
        touchingLadder = true;
        targetLadder = l;
        break;
      }
    }

    // 進入爬梯狀態 (接觸梯子且按下上下鍵)
    if (touchingLadder && player.state !== 'climbing') {
      if (keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) {
        player.state = 'climbing';
        player.x = targetLadder.x + targetLadder.w / 2 - player.w / 2; // 自動對齊梯子中心
        velocityY = 0;
      }
    }

  // --- 角色移動控制 ---
  if (activeNpc === null && player.state !== 'dead' && player.state !== 'climbing') {
    let nextX = player.x;
    let isMoving = false;

    // ★ 修改：空中移動速度變慢 (例如 60%)
    let currentSpeed = onGround ? player.speed : player.speed * 0.6;

    if (keyIsDown(LEFT_ARROW)) {
      nextX -= currentSpeed;
      player.isFacingRight = false;
      isMoving = true;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      nextX += currentSpeed;
      player.isFacingRight = true;
      isMoving = true;
    }

    if (isMoving) {
      // ★ 新增：水平碰撞檢測 (防止穿過牆壁/高台)
      // ★ 修改：使用固定的物理寬度 (player.w) 進行檢測，避免因動畫切換導致卡住
      // ★ 優化：稍微縮小碰撞箱寬度 (左右各縮 5px)，防止在平台連接處卡住
      let margin = 5;
      let colW = player.w - margin * 2;
      let colX = nextX + margin;
      let canMove = true;

      for (let p of platforms) {
        // 檢查水平重疊 (使用縮小的碰撞箱)
        if (colX + colW > p.x && colX < p.x + p.w) {
          // 檢查垂直重疊 (撞牆判定)
          // 條件：腳底 (player.y + player.h) 低於平台頂部，且頭頂高於平台底部
          if (player.y + player.h > p.y + 20 && player.y < p.y + p.h) {
            
            // ★ 新增：如果是斜坡或單向平台，則忽略水平碰撞 (視為地面而非牆壁)
            if (p.type === 'slope' || p.type === 'one-way') continue;

            // ★ 新增：方向性過濾，徹底解決"下階梯卡住"問題
            // 如果向右走，且平台在我們右側結束 (代表平台其實在我們左後方)，則忽略
            if (nextX > player.x && p.x + p.w <= colX + colW) continue;
            
            // 如果向左走，且平台在我們左側開始 (代表平台其實在我們右後方)，則忽略
            if (nextX < player.x && p.x >= colX) continue;

            canMove = false;
            break;
          }
        }
      }

      if (canMove) {
        player.x = nextX;
        isMovingHorizontally = true;
      }
    }
  } else if (player.state === 'climbing') {
    // ★ 爬梯時的移動控制
    let climbSpeed = 5;
    if (keyIsDown(UP_ARROW)) {
      player.y -= climbSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      player.y += climbSpeed;
    }

    // 左右移動可脫離梯子
    if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
      player.state = 'idle'; // 脫離後會自動受重力影響
    }

    // 超出梯子範圍自動脫離
    // 如果 targetLadder 遺失 (例如切換場景)，則強制脫離
    if (!targetLadder || player.y + player.h < targetLadder.y || player.y > targetLadder.y + targetLadder.h) {
      player.state = 'idle';
    }
    
    velocityY = 0; // 爬梯時不受重力影響
  }

  // 只有在地面上才能觸發新的跳躍
  if (onGround && activeNpc === null && player.state !== 'dead' && player.state !== 'climbing') {
    if (keyIsDown(UP_ARROW)) {
      velocityY = jumpForce;
      onGround = false;
    }
  }

  // --- 物理更新 ---
  if (player.state !== 'climbing') {
    velocityY += gravity; // 套用重力
    player.y += velocityY; // 更新Y座標
  }

  // --- 狀態更新 ---
  if (player.hitTimer > 0) {
    player.hitTimer--;
    player.state = 'hit';
  } else if (player.state === 'dead') {
    // 保持死亡狀態
  } else if (player.state === 'climbing') {
    // 保持爬梯狀態
  } else if (!onGround) {
    player.state = 'jumping';
  } else if (isMovingHorizontally && activeNpc === null && (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW))) {
    player.state = 'walking';
  } else {
    player.state = 'idle';
  }

  // 如果玩家死亡，顯示重新開始按鈕
  if (player.state === 'dead') {
    restartButton.show();
    restartButton.position(width / 2 - restartButton.width / 2, height / 2 + 100);
  }

  // 根據當前狀態獲取角色應有的高度
  // --- 平台碰撞檢測 (取代原本的單一地面檢測) ---
  onGround = false; // 預設為不在地面
  
  for (let p of platforms) {
    // 繪製除錯方塊 (方便調整位置)
    if (debugMode) {
      push();
      fill(255, 0, 0, 100);
      noStroke();
      rect(p.x, p.y, p.w, p.h);
      pop();
    }
  }
  // 繪製除錯用的梯子範圍
  for (let l of ladders) {
    if (debugMode) {
      push();
      fill(0, 0, 255, 100); // ★ 修改：藍色半透明，區分平台
      noStroke();
      rect(l.x, l.y, l.w, l.h);
      // 顯示座標
      fill(255);
      textSize(12);
      text(`Ladder X:${Math.round(l.x)}`, l.x, l.y - 10);
      pop();
    }
  }

  for (let p of platforms) {
    // ★ 修改：使用固定的物理中心點 (player.w) 判定，避免走路時因圖片變寬而掉落
    let playerCenterX = player.x + player.w / 2;
    if (playerCenterX > p.x && playerCenterX < p.x + p.w) {
      
      // ★ 新增：計算地面高度 (支援斜坡)
      let surfaceY = p.y;
      if (p.type === 'slope') {
        // 線性插值計算斜坡當前高度
        let t = (playerCenterX - p.x) / p.w;
        surfaceY = p.y1 + (p.y2 - p.y1) * t;
      }

      // 檢測角色腳底是否接近平台頂部 (且正在落下)
      if (player.y + player.h >= surfaceY && player.y + player.h <= surfaceY + p.h + 20 && velocityY >= 0) {
        // ★ 修改：增加上一幀位置判斷，確保是從上方落下，而不是從側面走上去
        let prevFeetY = player.y - velocityY + player.h;
        if (prevFeetY <= surfaceY + 20) { // 只有當原本在平台上方(或附近)時才吸附
          player.y = surfaceY - player.h; // 修正位置到平台上方 (腳底對齊)
          velocityY = 0;
          onGround = true;
        }
      }
    }
  }

  // --- 邊界限制 ---
  // 左右邊界
  player.x = constrain(player.x, 0, width - player.w);
  // 上邊界 (防止跳出畫面)
  if (player.y < 0) player.y = 0;

  // ★ 新增：掉落重生機制
  if (player.y > height && player.state !== 'dead') {
    player.lives--; // 扣除生命
    if (player.lives > 0) {
      // 如果還有命，回到起點重生
      velocityY = 0;
      if (platforms.length > 0) {
        player.x = platforms[0].x + 20; // 回到第一個平台
        player.y = platforms[0].y - player.h - 50; // 從上方落下
      } else {
        player.x = width / 2;
        player.y = height / 2;
      }
    } else {
      player.state = 'dead'; // 沒命了，死亡
    }
  }

  // --- 繪製與處理蒐集品 ---
  for (const item of collectibles) {
    if (item.visible) {
      let itemScale = CHAR_SCALE * 0.5;
      image(item.img, item.x, item.y, item.img.width * itemScale, item.img.height * itemScale);
      // 檢查玩家是否蒐集到
      const playerBox = { x: player.x, y: player.y, w: player.w, h: player.h };
      const itemBox = { x: item.x, y: item.y, w: item.img.width * itemScale, h: item.img.height * itemScale };
      if (playerBox.x < itemBox.x + itemBox.w && playerBox.x + playerBox.w > itemBox.x &&
          playerBox.y < itemBox.y + (itemBox.h || 40 * itemScale) && playerBox.y + playerBox.h > itemBox.y) {
        item.visible = false;
        hasPotion = true; // 標記已撿到藥瓶
      }
    }
  }

  // --- 繪製 NPCs ---
  for (const npc of npcs) {
    // --- NPC AI and Movement ---
    if (npc.canMove && npc !== activeNpc && !npc.isDefeated) { // 互動中的NPC不移動
      if (npc.isFollower) {
        // 跟隨玩家邏輯
        const dx = (player.x + currentFrameWidth / 2) - (npc.x + npc.w / 2);
        if (Math.abs(dx) > 60) { // 保持距離
          npc.state = 'walking';
          npc.direction = dx > 0 ? 1 : -1;
          npc.walkSpeed = 5; // 跟隨速度
        } else {
          npc.state = 'idle';
        }
      } else {
        // 隨機移動邏輯
        npc.decisionTimer--;
        if (npc.decisionTimer <= 0) {
          // 時間到，做新決定
          if (npc.state === 'idle') {
            npc.state = 'walking'; // 從站立變走路
            npc.direction = (random() > 0.5) ? 1 : -1; // 隨機新方向
          } else {
            npc.state = 'idle'; // 從走路變站立
          }
          npc.decisionTimer = floor(random(60, 240)); // 設定下次決定的時間
        }
      }

      if (npc.state === 'walking') {
        const nextX = npc.x + npc.walkSpeed * npc.direction;
        let collisionDetected = false;

        // 檢測移動範圍限制 (如果有設定 minX/maxX) 或螢幕邊界
        let limitMin = (npc.minX !== undefined) ? npc.minX : 0;
        let limitMax = (npc.maxX !== undefined) ? npc.maxX : width;

        if (nextX <= limitMin || nextX + npc.w >= limitMax) {
          collisionDetected = true;
        }

        // ★ 新增：檢測是否走出平台邊緣 (讓 NPC 走路按照平台)
        if (!collisionDetected) {
          let onPlatform = false;
          let feetY = npc.y + npc.h;
          // 檢查行進方向的前端 X 座標 (向右看右腳，向左看左腳)
          let checkX = (npc.direction === 1) ? (nextX + npc.w) : nextX;
          
          for (let p of platforms) {
            // ★ 修改：支援斜坡的高度計算
            let surfaceY = p.y;
            if (p.type === 'slope') {
              // 計算 checkX 處的斜坡高度
              let t = (checkX - p.x) / p.w;
              surfaceY = p.y1 + (p.y2 - p.y1) * t;
            }

            // 檢查高度是否匹配 (放寬誤差以適應斜坡) 且 X 座標在平台範圍內
            if (Math.abs(surfaceY - feetY) < 30 && checkX >= p.x && checkX <= p.x + p.w) {
              onPlatform = true;
              break;
            }
          }
          
          if (!onPlatform) {
            collisionDetected = true;
          }
        }

        if (collisionDetected) {
          npc.direction *= -1;
        } else {
          npc.x = nextX;

          // ★ 新增：讓 NPC 貼合斜坡或地面 (解決走在空中的問題)
          // 改良版：尋找最接近腳底的地面，避免誤判
          let npcCenterX = npc.x + npc.w / 2;
          let bestSurfaceY = null;
          let minDiff = Infinity;

          for (let p of platforms) {
            if (npcCenterX >= p.x && npcCenterX <= p.x + p.w) {
              let surfaceY = p.y;
              if (p.type === 'slope') {
                let t = (npcCenterX - p.x) / p.w;
                surfaceY = p.y1 + (p.y2 - p.y1) * t;
              }
              
              let diff = Math.abs((npc.y + npc.h) - surfaceY);
              // 容許誤差設為 50px，並尋找最近的地面
              if (diff < 50 && diff < minDiff) {
                minDiff = diff;
                bestSurfaceY = surfaceY;
              }
            }
          }

          if (bestSurfaceY !== null) {
            npc.y = bestSurfaceY - npc.h;
          }
        }
      }
    }

    // ★ 新增：蝸牛黏液痕跡邏輯 (只針對有 hasTrail 屬性的 NPC)
    if (npc.hasTrail) {
      // 更新痕跡 (只在移動時產生)
      if (npc.state === 'walking') {
        if (!npc.trail) npc.trail = [];
        if (!npc.trailTimer) npc.trailTimer = 0;
        
        npc.trailTimer++;
        if (npc.trailTimer > 5) { // 每 5 幀產生一個
          npc.trail.push({
            x: npc.x + npc.w / 2,
            y: npc.y + npc.h - 5,
            alpha: 150,
            size: random(10, 25)
          });
          npc.trailTimer = 0;
        }
      }
      
      // 繪製並淡出痕跡
      if (npc.trail) {
        for (let i = npc.trail.length - 1; i >= 0; i--) {
          let spot = npc.trail[i];
          spot.alpha -= 2; // 緩慢淡出
          if (spot.alpha <= 0) {
            npc.trail.splice(i, 1);
          } else {
            push();
            noStroke();
            fill(150, 255, 100, spot.alpha); // 螢光綠
            ellipse(spot.x, spot.y, spot.size, spot.size * 0.5);
            pop();
          }
        }
      }
    }

    // 如果NPC被擊敗且正在消失
    if (npc.isFading) {
      npc.alpha -= 5;
      if (npc.alpha <= 0) {
        npc.isFading = false;
      }
    }

    // 如果NPC還活著，檢查與玩家的碰撞
    if (!npc.isDefeated && npc.canMove && activeNpc === null && player.state !== 'dead') {
      const playerBox = { x: player.x, y: player.y, w: player.w, h: player.h };
      const npcBox = { x: npc.x, y: npc.y, w: npc.w, h: npc.h };
      if (playerBox.x < npcBox.x + npcBox.w && playerBox.x + playerBox.w > npcBox.x &&
          playerBox.y < npcBox.y + npcBox.h && playerBox.y + playerBox.h > npcBox.y) {
        // 只有可互動的 NPC 才會觸發問答
        if (npc.isInteractive !== false && quizCooldown <= 0) {
          // ★ 修改：改為按下向上鍵才觸發，讓史萊姆可以穿過 NPC 而不被強制擋下
          push();
          fill(255);
          textAlign(CENTER);
          textSize(14);
          text("按 ↑ 對話", player.x + currentFrameWidth/2, player.y - 10);
          pop();
          
          if (keyIsDown(UP_ARROW)) {
            startQuiz(npc);
          }
        }
      }
    }

    // --- NPC 5 特殊互動 ---
    if (npc.id === 5) {
      // ★ 修復：將未定義的 currentHeight 改為 player.h，並使用 player.w 計算中心點
      const distToPlayer = dist(player.x + player.w / 2, player.y + player.h / 2, npc.x + npc.w / 2, npc.y + npc.h / 2);

      if (npc.questState === 'lonely') {
        if (hasPotion && distToPlayer < 50) {
          // 觸發治療
          npc.questState = 'healed';
          hasPotion = false;
          showNpc5Effect = 60; // 特效持續時間 (延長至 3 秒)

          // 切換為正常(Stop)狀態的圖片
          npc.idleSheet = npc5Sheet;
          npc.idleFrames = null; // 改為 null，因為 5/stop/0.png 是靜態圖，不需要動畫
          
          let oldBottom = npc.y + npc.h; // 記錄原本的底部位置
          npc.w = npc5Frames[0].w * CHAR_SCALE;
          npc.h = npc5Frames[0].h * CHAR_SCALE;
          npc.y = oldBottom - npc.h; // 保持底部對齊

          npc.state = 'walking';
          npc.canMove = true; // 治療後開始隨處走動
          npc.isFollower = false; // 不跟隨玩家 (自由移動)
          // 清除移動限制，讓它能走完整個平台
          delete npc.minX;
          delete npc.maxX;
        } else if (distToPlayer < 150) {
          // 顯示求救文字
          fill(255, 255, 255, 200);
          stroke(0);
          rect(npc.x + npc.w / 2 - 90, npc.y - 40, 180, 30, 5);
          fill(0);
          noStroke();
          textAlign(CENTER, CENTER);
          text('我受傷了，請幫幫我', npc.x + npc.w / 2, npc.y - 25);
        }
      } else { // If not lonely (i.e., healed or following)
        if (distToPlayer < 150) {
          // 顯示提示文字
          const hintText = `提示：${currentQuestion.hint || '...'}`;
          const hintW = textWidth(hintText) + 20;
          fill(255, 255, 255, 200);
          stroke(0);
          rect(npc.x + npc.w / 2 - hintW / 2, npc.y - 40, hintW, 30, 5);
          fill(0);
          noStroke();
          textAlign(CENTER, CENTER);
          text(hintText, npc.x + npc.w / 2, npc.y - 25);
        }
      }
    }

    // 顯示NPC5的治療特效
    if (npc.id === 5 && showNpc5Effect > 0) {
      push();
      // 計算動畫進度 0 (剛開始) -> 1 (結束)
      let progress = map(showNpc5Effect, 60, 0, 0, 1);
      
      // 設定透明度：前 70% 時間完全不透明，後 30% 漸漸消失
      let alpha = 255;
      if (progress > 0.7) {
        alpha = map(progress, 0.7, 1, 255, 0);
      }
      
      tint(255, alpha);
      let riseOffset = progress * 60; // 向上飄浮 60px
      
      // 1. 顯示藥瓶 (帶有縮放跳動效果)
      if (collectibleImage.width > 1) {
        let scaleAnim = 1 + sin(progress * PI * 2) * 0.2; // 輕微縮放
        let effectScale = 0.5 * scaleAnim;
        let effectW = collectibleImage.width * effectScale;
        let effectH = collectibleImage.height * effectScale;
        image(collectibleImage, npc.x + npc.w / 2 - effectW / 2, npc.y - 50 - riseOffset, effectW, effectH);
      }

      // 2. 顯示 "謝謝!" 文字
      fill(255, 255, 0, alpha); // 黃色文字
      stroke(0, alpha);
      strokeWeight(2);
      textAlign(CENTER);
      textSize(20);
      text("謝謝你！", npc.x + npc.w / 2, npc.y - 80 - riseOffset);
      
      pop();
      showNpc5Effect--;
    }

    // 如果是當前問答的NPC，顯示問題
    if (npc === activeNpc) {
      fill(255, 255, 255, 200);
      stroke(0);
      const questionW = textWidth(currentQuestion.question) + 40; // 增加寬度以提供更多邊距
      let rectX = npc.x + npc.w / 2 - questionW / 2;
      rectX = constrain(rectX, 10, width - questionW - 10); // 確保不超出畫布，並留有邊距
      rect(rectX, npc.y - 40, questionW, 30, 5);
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      text(currentQuestion.question, rectX + questionW / 2, npc.y - 25);
    }
    
    // --- NPC Drawing ---
    if (npc.alpha <= 0) continue; // 如果完全透明，則不繪製

    const npcShouldFaceRight = (npc.canMove) ? (npc.direction === 1) : ((npc.questState === 'happy' || npc.questState === 'healed') ? (player.x > npc.x) : false);

    push();
    tint(255, npc.alpha); // 套用透明度
    // 移動到NPC的中心點以便翻轉
    translate(npc.x + npc.w / 2, npc.y);
    let s = (npc.scale || 1) * CHAR_SCALE; // 取得縮放比例，預設為 1，並乘上全域縮放
    if (npcShouldFaceRight) {
      scale(-s, s); // 水平翻轉並縮放
    } else {
      scale(s, s); // 僅縮放
    }

    // 根據狀態繪製對應的動畫
    if (npc.state === 'dead') {
      if (npc.deadSheet) {
        let frameIndex = floor(npc.animationTimer / 4) % npc.deadFrames.length;
        let frameData = npc.deadFrames[frameIndex];
        image(npc.deadSheet, -frameData.w / 2, 0, frameData.w, frameData.h, frameData.x, 0, frameData.w, frameData.h);
      }
      if (npc.animationTimer < (npc.deadFrames.length * 4) - 1) {
        npc.animationTimer++;
      } else {
        npc.isFading = true; // 動畫播完開始消失

        // 如果是守門員，且傳送門還沒開，則開啟 (提問者死亡後)
        if (npc.isGatekeeper && !gateOpen && !gameWon) {
          if (currentScene === 3) {
            gameWon = true;
            restartButton.show();
            restartButton.position(width / 2 - restartButton.width / 2, height / 2 + 100);
          } else {
            gateOpen = true;
            // 讓野豬改為 moving 狀態並跟隨玩家
            const boar = npcs.find(n => n.id === 5);
            if (boar) {
              boar.isFollower = true;
              boar.canMove = true;
              boar.state = 'walking';
            }
          }
        }
      }
    } else if (npc.state === 'walking' && npc.walkSheet) {
      let frameIndex = floor(frameCount / 4) % npc.walkFrames.length;
      let frameData = npc.walkFrames[frameIndex];
      // 調整Y座標，讓走路動畫的腳底與站立時對齊
      let yOffset = (npc.h / s) - frameData.h;
      image(npc.walkSheet, -frameData.w / 2, yOffset, frameData.w, frameData.h, frameData.x, 0, frameData.w, frameData.h);
    } else { // Idle state
      if (npc.idleFrames) {
        // 動畫精靈
        let frameIndex = floor(frameCount / 15) % npc.idleFrames.length;
        let frameData = npc.idleFrames[frameIndex];
        image(npc.idleSheet, -frameData.w / 2, 0, frameData.w, frameData.h, frameData.x, 0, frameData.w, frameData.h);
      } else {
        // 靜態圖
        // ★ 修復：使用未縮放的寬度進行偏移 (因為已經在 scale() 中)
        image(npc.idleSheet, -(npc.w / s) / 2, 0);
      }
    }
    pop();
  }


  // --- 繪製角色 ---
  push(); // 儲存當前的繪圖狀態

  // ★ 修改：對齊腳底中心
  // 將原點移動到物理碰撞箱的「腳底中心」位置 (player.x + player.w/2, player.y + player.h)
  translate(player.x + player.w / 2, player.y + player.h);
  if (player.isFacingRight) {
    scale(-CHAR_SCALE, CHAR_SCALE); // 如果朝右，則水平翻轉畫布，並套用縮放
  } else {
    scale(CHAR_SCALE, CHAR_SCALE);
  }

  // 根據狀態選擇動畫並繪製
  if (player.state === 'dead') {
    let frameIndex = floor(frameCount / 5) % playerDeadFrames.length;
    let frameData = playerDeadFrames[frameIndex];
    currentFrameWidth = frameData.w * CHAR_SCALE;
    currentFrameHeight = frameData.h * CHAR_SCALE;
    // ★ 修復：使用未縮放的偏移量 (因為已經在 scale(CHAR_SCALE) 中)，避免雙重縮放導致浮空
    image(playerDeadSheet, -frameData.w / 2, -frameData.h, frameData.w, frameData.h, frameData.x, 0, frameData.w, frameData.h);
  } else if (player.state === 'hit' && playerHitImage.width > 1) {
    currentFrameWidth = playerHitImage.width * CHAR_SCALE;
    currentFrameHeight = playerHitImage.height * CHAR_SCALE;
    image(playerHitImage, -playerHitImage.width / 2, -playerHitImage.height);
  } else if (player.state === 'jumping') {
    currentFrameWidth = jumpImage.width * CHAR_SCALE;
    currentFrameHeight = jumpImage.height * CHAR_SCALE;
    image(jumpImage, -jumpImage.width / 2, -jumpImage.height);
  } else if (player.state === 'walking') {
    let frameIndex = floor(frameCount / 5) % walkFrames.length;
    let frameData = walkFrames[frameIndex];
    currentFrameWidth = frameData.w * CHAR_SCALE;
    currentFrameHeight = frameData.h * CHAR_SCALE;
    image(walkSheet, -frameData.w / 2, -frameData.h, frameData.w, frameData.h, frameData.x, 0, frameData.w, frameData.h);
  } else if (player.state === 'climbing') {
    // ★ 爬梯動畫 (暫時使用走路動畫)
    let frameIndex = floor(frameCount / 5) % walkFrames.length;
    let frameData = walkFrames[frameIndex];
    currentFrameWidth = frameData.w * CHAR_SCALE;
    currentFrameHeight = frameData.h * CHAR_SCALE;
    image(walkSheet, -frameData.w / 2, -frameData.h, frameData.w, frameData.h, frameData.x, 0, frameData.w, frameData.h);
  } else { // idle
    // 玩家停止時直接顯示第一格 (不播放動畫)
    let frameIndex = 0;
    let frameData = idleFrames[frameIndex];
    currentFrameWidth = frameData.w * CHAR_SCALE;
    currentFrameHeight = frameData.h * CHAR_SCALE;
    image(spriteSheet, -frameData.w / 2, -frameData.h, frameData.w, frameData.h, frameData.x, 0, frameData.w, frameData.h);
  }

  pop(); // 恢復之前儲存的繪圖狀態

  // ★ UI: 顯示生命值 (愛心圖案)
  for (let i = 0; i < player.lives; i++) {
    push();
    fill(255, 50, 50); // 紅色
    stroke(200, 0, 0); // 深紅色邊框
    strokeWeight(1);
    translate(30 + i * 40, 30); // 設定位置：左上角 (30, 30)，每個愛心間隔 40px
    beginShape();
    // 使用貝茲曲線繪製愛心形狀
    vertex(0, 0);
    bezierVertex(-15, -15, -30, 10, 0, 30);
    bezierVertex(30, 10, 15, -15, 0, 0);
    endShape(CLOSE);
    pop();
  }

  // ★ Game Win Screen (通關畫面)
  if (gameWon) {
    push();
    fill(0, 150); // 半透明黑色背景
    rect(0, 0, width, height);
    
    if (bg4 && bg4.width > 1) {
      imageMode(CENTER);
      image(bg4, width/2, height/2, width * 0.8, height * 0.8);
      imageMode(CORNER);
    }
    
    fill(255, 215, 0); // 金色文字
    stroke(0);
    strokeWeight(5);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("恭喜通關", width/2, height/2);
    pop();
  }

  // ★ Game Over Screen (失敗畫面)
  if (player.state === 'dead') {
    push();
    fill(0, 150); // 半透明黑色背景
    rect(0, 0, width, height);
    
    fill(255, 50, 50); // 紅色文字
    stroke(0);
    strokeWeight(5);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("遺憾失敗", width/2, height/2);
    pop();
  }

  // ★ 除錯輔助：顯示滑鼠座標，方便對齊平台位置
  if (debugMode) {
    push();
    stroke(255, 0, 0); // 紅色線條
    strokeWeight(1);
    line(0, mouseY, width, mouseY); // 水平線 (對齊 Y 軸)
    line(mouseX, 0, mouseX, height); // 垂直線 (對齊 X 軸)
    
    noStroke();
    fill(255, 0, 0); // 紅色文字
    textSize(16);
    text(`X: ${Math.round(mouseX)}, Y: ${Math.round(mouseY)}`, mouseX + 10, mouseY - 10);
    pop();
  }
}

// ★ 新增：繪製開始畫面
function drawStartScreen() {
  // 繪製背景
  if (bg1 && bg1.width > 1) {
    background(bg1);
  } else {
    background('#87CEEB');
  }
  
  // 半透明遮罩，讓文字更清楚
  push();
  fill(0, 50);
  rect(0, 0, width, height);
  pop();

  // 繪製標題
  push();
  textAlign(CENTER, CENTER);
  
  // 文字陰影效果
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = 'rgba(0,0,0,0.5)';
  
  // 主標題外框 (粗黑邊)
  textSize(80);
  textStyle(BOLD);
  stroke(0);
  strokeWeight(8);
  fill(255, 140, 0); // 深橘色
  text("教心大冒險", width / 2, height / 2 - 80);
  
  // 主標題內文 (金黃色)
  strokeWeight(0);
  fill(255, 215, 0); 
  text("教心大冒險", width / 2, height / 2 - 80);
  
  // 副標題
  drawingContext.shadowBlur = 0; // 重置陰影
  textSize(28);
  stroke(0);
  strokeWeight(4);
  fill(255);
  text("MapleStory Style Learning", width / 2, height / 2 + 10);
  pop();
  
  // 更新按鈕位置 (確保視窗縮放時置中)
  if (startButton) {
    startButton.position(width / 2 - 100, height / 2 + 60);
  }
}

// ★ 新增：開始遊戲函式
function startGame() {
  gameState = 'playing';
  if (startButton) startButton.hide();
  setupScene(1); // 開始遊戲，重置為第一關
}

function startQuiz(npc) {
  activeNpc = npc;
  activeNpc.state = 'idle'; // 讓NPC停下來

  // ★ 修改：題目邏輯 - 除非答錯兩次，否則不換題
  // 如果 NPC 還沒有分配題目，或者題目被重置 (因為答錯兩次)，則選新題目
  if (!activeNpc.questionData) {
    // 使用 getNextQuestion 取得不重複的題目
    activeNpc.questionData = getNextQuestion();
    activeNpc.wrongCount = 0; // 重置錯誤次數
  }

  // 將 NPC 的題目設定為當前顯示題目
  if (activeNpc.questionData) {
    currentQuestion = activeNpc.questionData;
  } else {
    // 備用問題 (當 CSV 尚未載入或失敗時)
    console.log("Using fallback question in startQuiz");
    currentQuestion = {
      question: "1 + 1 = ?",
      answer: "2",
      hint: "2"
    };
  }

  // 顯示並定位輸入框
  answerInput.show();
  const inputW = answerInput.width;
  let inputX = constrain(player.x, 10, width - inputW - 10); // 確保不超出畫布，並留有邊距
  // ★ 修改：將輸入框移到角色腳下，避免遮住頭頂的題目 (原本是 player.y - 40)
  answerInput.position(inputX, player.y + player.h + 20);
  answerInput.value(''); // 清空上次的答案
  answerInput.elt.focus(); // 自動聚焦，讓玩家可以直接打字
}

function checkAnswer() {
  if (!activeNpc) return;

  const userAnswer = answerInput.value().toLowerCase().trim();
  const correctAnswer = currentQuestion.answer.toLowerCase().trim();

  if (userAnswer === correctAnswer) {
    // 答對了
    if (activeNpc.id === 5) {
      // 野豬答對後跟隨玩家
      activeNpc.isFollower = true;
      activeNpc.canMove = true;
    } else {
      activeNpc.state = 'dead';
      activeNpc.isDefeated = true;
      activeNpc.animationTimer = 0; // 重置動畫計時器
    }
  } else {
    // 答錯了
    player.lives--;
    
    // ★ 新增：錯誤計數邏輯
    if (activeNpc) {
      if (typeof activeNpc.wrongCount === 'undefined') activeNpc.wrongCount = 0;
      activeNpc.wrongCount++;
      if (activeNpc.wrongCount >= 2) {
        activeNpc.questionData = null; // 答錯兩次，重置題目，下次對話會換題
      }
    }

    if (player.lives <= 0) {
      player.state = 'dead';
    } else {
      player.hitTimer = 15; // 播放受擊動畫
    }
  }

  // 結束問答
  activeNpc = null;
  answerInput.hide();
}

function resetGame() {
  // 隱藏按鈕並重置所有狀態
  restartButton.hide();
  setup(); // 重新執行setup函式來重置所有變數和物件
}


function keyPressed() {
  // 按下 ESC 鍵可以退出提問
  if (keyCode === ESCAPE && activeNpc) {
    // 結束問答
    activeNpc = null;
    answerInput.hide();
    quizCooldown = 60; // 設定冷卻時間 (約3秒)，避免立刻再次觸發
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 視窗改變後需要重置地面和角色位置
  groundY = height / 2;
  setupScene(currentScene); // 重新設定場景以更新平台位置
  // (更完整的作法會需要重新計算所有NPC的位置，這裡暫時簡化)
  // 這裡也應該重置蒐集品的位置
}

// ★ 新增：取得不重複題目的函式
function getNextQuestion() {
  if (!questionTable || questionTable.getRowCount() === 0) {
    return { question: "1 + 1 = ?", answer: "2", hint: "2" };
  }

  let availableIndices = [];
  for (let i = 0; i < questionTable.getRowCount(); i++) {
    if (!usedQuestionIndices.includes(i)) {
      availableIndices.push(i);
    }
  }

  // 如果所有題目都用過了，則重置 (允許重複或是清空紀錄)
  if (availableIndices.length === 0) {
    usedQuestionIndices = [];
    for (let i = 0; i < questionTable.getRowCount(); i++) {
      availableIndices.push(i);
    }
  }

  const r = random(availableIndices);
  usedQuestionIndices.push(r);

  return {
    question: questionTable.getString(r, 'question'),
    answer: questionTable.getString(r, 'answer'),
    hint: questionTable.getString(r, 'hint')
  };
}

// --- 場景設定函式 ---
function setupScene(scene) {
  npcs = [];
  collectibles = [];
  ladders = []; // 清空梯子
  platforms = []; // 清空平台
  gateOpen = false;
  hasPotion = false; // ★ 新增：切換場景時重置藥水狀態 (上一幕的血瓶不能帶到下一幕)

  if (scene === 1) {
    // --- 場景 1: 蘑菇森林 ---
    
    // 計算縮放比例 (根據當前視窗大小與基準大小的比例)
    let sx = width / baseWidth;
    let sy = height / baseHeight;
    
    // ★ 定義平台 (請根據您的 bg/1.png 調整這裡的數值)
    // 格式: { x: 開始X, y: 地面高度Y, w: 寬度, h: 厚度(碰撞檢測用) }
    platforms = [
      // 左側平台 (配合 bg/1.png 的左側地面)
      { x: 16 * sx, y: 399 * sy, w: 596 * sx, h: 50 * sy },
      // 中間低地 (配合 bg/1.png 的中間凹陷處)
      { x: 612 * sx, y: 449 * sy, w: 91 * sx, h: 43 * sy },
      // 右側平台 (配合 bg/1.png 的右側地面)
      { x: 703 * sx, y: 492 * sy, w: 93 * sx, h: 50 * sy },
      // 第四個平台 (最右側低地)
      // ★ 修改：加寬平台 (724 -> 800) 以覆蓋梯子位置，避免玩家跳不到梯子
      { x: 796 * sx, y: 542 * sy, w: 800 * sx, h: 50 * sy },
      // 新增平台 (1020 347 -> 1520 347)
      { x: 1020 * sx, y: 347 * sy, w: 500 * sx, h: 50 * sy }
    ];

    // ★ 定義梯子 (根據您的需求新增)
    ladders = [
      // X: 1236~1277, Y: 346~529
      { x: 1236 * sx, y: 346 * sy, w: (1277 - 1236) * sx, h: (529 - 346) * sy }
    ];

    // 為了方便，我們定義變數來參照平台
    let startPlatform = platforms[0];
    let endPlatform = platforms[platforms.length - 1];
    
    // 1. 建立 NPC 5 (野豬) - 任務 NPC
    npcs.push({
      id: 5,
      idleSheet: npc5LonelySheet,
      idleFrames: npc5LonelyFrames,
      walkSheet: npc5WalkSheet,
      walkFrames: npc5WalkFrames,
      x: 20 * sx,
      y: startPlatform.y - npc5LonelyFrames[0].h * CHAR_SCALE, // 放在起點平台
      w: npc5LonelyFrames[0].w * CHAR_SCALE,
      h: npc5LonelyFrames[0].h * CHAR_SCALE,
      canMove: false, // 一開始不動 (Lonely)
      state: 'idle', // 初始狀態為靜止
      direction: 1,
      walkSpeed: 0.5, // 走慢一點
      decisionTimer: 100,
      questState: 'lonely',
      isDefeated: false,
      isFading: false,
      alpha: 255,
      animationTimer: 0,
      isInteractive: false // 野豬不觸發問答，只給提示
    });

    // 2. 建立蒐集品 (血瓶)
    let collectibleX = random(width * 0.1, width * 0.9);
    let colPlatform = platforms.find(p => collectibleX >= p.x && collectibleX < p.x + p.w) || startPlatform;

    collectibles.push({
      img: collectibleImage,
      x: collectibleX,
      y: colPlatform.y - 80 * CHAR_SCALE * 0.5, // 修正位置，確保在平台上方
      visible: true
    });

    // 3. 建立背景蘑菇 (NPC 2) - 隨機走動，不可互動
    for (let i = 0; i < 6; i++) {
      let npcX = random(100, width - 100);
      // 根據 X 座標找到對應的平台高度
      let platform = platforms.find(p => npcX >= p.x && npcX < p.x + p.w) || startPlatform;
      let npcY = platform.y;
      
      npcs.push({
        id: 2,
        idleSheet: npc2Sheet,
        idleFrames: npc2Frames,
        walkSheet: npc2WalkSheet,
        walkFrames: npc2WalkFrames,
        deadSheet: npc2DeadSheet,
        deadFrames: npc2DeadFrames,
        x: npcX,
        y: npcY - npc2Frames[0].h * CHAR_SCALE,
        w: npc2Frames[0].w * CHAR_SCALE,
        h: npc2Frames[0].h * CHAR_SCALE,
        canMove: true,
        state: 'idle',
        direction: (random() > 0.5) ? 1 : -1,
        walkSpeed: random(0.5, 1.5),
        decisionTimer: 0,
        isDefeated: false,
        isFading: false,
        alpha: 255,
        animationTimer: 0,
        isInteractive: false // 背景 NPC，不觸發問答
      });
    }

    // 4. 建立 Boss 蘑菇 (隨機位置，避開傳送門與野豬)
    let bossScale = 1.5;
    let bossW = npc2Frames[0].w * bossScale * CHAR_SCALE;
    let bossH = npc2Frames[0].h * bossScale * CHAR_SCALE;
    
    // 取得避讓區域 (傳送門與野豬)
    let portalRect = getPortalRect(1, platforms);
    // 野豬是 npcs[0]
    let boar = npcs.find(n => n.id === 5);
    let boarRect = boar ? { x: boar.x, y: boar.y, w: boar.w, h: boar.h } : { x: 0, y: 0, w: 0, h: 0 };
    
    let bossPos = getRandomSafePosition(platforms, bossW, bossH, [portalRect, boarRect]);

    npcs.push({
      id: 2,
      idleSheet: npc2Sheet,
      idleFrames: npc2Frames,
      walkSheet: npc2WalkSheet,
      walkFrames: npc2WalkFrames,
      deadSheet: npc2DeadSheet,
      deadFrames: npc2DeadFrames,
      x: bossPos.x,
      y: bossPos.y,
      w: bossW,
      h: bossH,
      scale: bossScale, // 設定縮放比例
      canMove: true,
      state: 'idle',
      direction: (random() > 0.5) ? 1 : -1,
      walkSpeed: 0.8,
      decisionTimer: 0,
      isDefeated: false,
      isFading: false,
      alpha: 255,
      animationTimer: 0,
      isInteractive: true, // 可互動
      isGatekeeper: true   // 擊敗後前往下一關
    });

    // 為此場景預選一個問題
    let qData = getNextQuestion();
    currentQuestion = { ...qData }; // 更新全域變數供提示使用
    
    // 將問題分配給守門員 (Boss)
    let boss = npcs.find(n => n.isGatekeeper);
    if (boss) {
      boss.questionData = qData;
      boss.wrongCount = 0;
    }
  } else if (scene === 2) {
    // --- 場景 2 ---
    let sx = width / baseWidth;
    let sy = height / baseHeight;

    // 簡單的平台配置 (因為沒有具體座標，先設定為地板 + 兩個浮動平台)
    platforms = [
      // 1. 第一個平台 (0 439 到 100 450)
      { x: 0 * sx, y: 439 * sy, w: 100 * sx, h: 20 * sy },
      
      // 新增平台 (100 389 到 351 389) - 設定為單向平台 (one-way)，可從下方跳過
      { x: 100 * sx, y: 389 * sy, w: (351 - 100) * sx, h: 20 * sy, type: 'one-way' },
      
      // 2. 斜坡 (100 439 到 316 514)
      // type: 'slope', y1: 起點高度, y2: 終點高度
      { x: 100 * sx, y: 439 * sy, w: (316 - 100) * sx, h: 50 * sy, type: 'slope', y1: 439 * sy, y2: 514 * sy },
      
      // 3. 第二個斜坡 (316 514 到 527 568)
      { x: 316 * sx, y: 514 * sy, w: (527 - 316) * sx, h: 50 * sy, type: 'slope', y1: 514 * sy, y2: 568 * sy },

      // 4. 第三個平台 (527 568 到 1126 568)
      { x: 527 * sx, y: 568 * sy, w: (1126 - 527) * sx, h: 50 * sy },

      // 5. 第三個斜坡 (1126 568 到 1465 451)
      { x: 1126 * sx, y: 568 * sy, w: (1465 - 1126) * sx, h: 50 * sy, type: 'slope', y1: 568 * sy, y2: 451 * sy },

      // 6. 第四個平台 (1465 451 到 1537 451)
      { x: 1465 * sx, y: 451 * sy, w: (1537 - 1465) * sx, h: 50 * sy },

      // --- 新增的中層路徑 ---
      // 斜坡 (351 389 到 898 252)
      { x: 351 * sx, y: 389 * sy, w: (898 - 351) * sx, h: 20 * sy, type: 'slope', y1: 389 * sy, y2: 252 * sy },
      // 斜坡 (898 252 到 1190 203)
      { x: 898 * sx, y: 252 * sy, w: (1190 - 898) * sx, h: 20 * sy, type: 'slope', y1: 252 * sy, y2: 203 * sy },
      // 平台 (1190 203 到 1490 203)
      { x: 1190 * sx, y: 203 * sy, w: (1490 - 1190) * sx, h: 20 * sy },

      // --- 新增的上層路徑 ---
      // 平台 (164 45 到 300 45)
      { x: 164 * sx, y: 45 * sy, w: (300 - 164) * sx, h: 20 * sy },
      // 斜坡 (300 45 到 595 99)
      { x: 300 * sx, y: 45 * sy, w: (595 - 300) * sx, h: 20 * sy, type: 'slope', y1: 45 * sy, y2: 99 * sy },
      // 平台 (595 99 到 1066 99)
      { x: 595 * sx, y: 99 * sy, w: (1066 - 595) * sx, h: 20 * sy },
      // 斜坡 (1066 99 到 1227 120)
      { x: 1066 * sx, y: 99 * sy, w: (1227 - 1066) * sx, h: 20 * sy, type: 'slope', y1: 99 * sy, y2: 120 * sy },
      // 平台 (1227 120 到 1390 120)
      // ★ 修改：改為跳躍型平台 (one-way)
      { x: 1227 * sx, y: 120 * sy, w: (1390 - 1227) * sx, h: 20 * sy, type: 'one-way' }
    ];

    // ★ 定義梯子
    ladders = [
      // X: 224, Y: 45~371 (從上方 45 到下方 371)
      { x: 224 * sx, y: 45 * sy, w: 50 * sx, h: (371 - 45) * sy },
      
      // 新增梯子 (644 335 到 644 99)
      { x: 644 * sx, y: 99 * sy, w: 50 * sx, h: (335 - 99) * sy },
      
      // 新增梯子 (1018 250 到 1018 486)
      { x: 1018 * sx, y: 250 * sy, w: 50 * sx, h: (486 - 250) * sy }
    ];

    // 1. 建立背景 NPC (混合 NPC 2 蘑菇 和 NPC 4 蝸牛)
    for (let i = 0; i < 5; i++) {
      let platform = platforms[floor(random(platforms.length))]; // 隨機選擇一個平台
      let npcX = random(platform.x, platform.x + platform.w);
      
      // ★ 修正：計算斜坡上的正確 Y 座標，避免 NPC 生成在空中或地下
      let npcY = platform.y;
      if (platform.type === 'slope') {
        let t = (npcX - platform.x) / platform.w;
        npcY = platform.y1 + (platform.y2 - platform.y1) * t;
      }
      
      let isSnail = random() > 0.5; // 50% 機率是蝸牛

      if (isSnail) {
        // 建立蝸牛 (NPC 4)
        npcs.push({
          id: 4,
          idleSheet: npc4Image, // 蝸牛待機是靜態圖
          idleFrames: null,
          walkSheet: npc4WalkSheet,
          walkFrames: npc4WalkFrames,
          deadSheet: npc4DeadSheet,
          deadFrames: npc4DeadFrames,
          x: npcX,
          y: npcY - npc4WalkFrames[0].h * CHAR_SCALE,
          w: npc4WalkFrames[0].w * CHAR_SCALE,
          h: npc4WalkFrames[0].h * CHAR_SCALE,
          canMove: true,
          state: 'idle',
          direction: (random() > 0.5) ? 1 : -1,
          walkSpeed: random(0.5, 1.5),
          decisionTimer: 0,
          isDefeated: false,
          isFading: false,
          alpha: 255,
          animationTimer: 0,
          isInteractive: false
        });
      } else {
        // 建立蘑菇 (NPC 2)
        npcs.push({
          id: 2,
          idleSheet: npc2Sheet,
          idleFrames: npc2Frames,
          walkSheet: npc2WalkSheet,
          walkFrames: npc2WalkFrames,
          deadSheet: npc2DeadSheet,
          deadFrames: npc2DeadFrames,
          x: npcX,
          y: npcY - npc2Frames[0].h * CHAR_SCALE,
          w: npc2Frames[0].w * CHAR_SCALE,
          h: npc2Frames[0].h * CHAR_SCALE,
          canMove: true,
          state: 'idle',
          direction: (random() > 0.5) ? 1 : -1,
          walkSpeed: random(0.5, 1.5),
          decisionTimer: 0,
          isDefeated: false,
          isFading: false,
          alpha: 255,
          animationTimer: 0,
          isInteractive: false
        });
      }
    }

    // 2. 預先計算 NPC 5 (野豬) 位置 - 固定在右上角平台 (1227 120)
    let boarPlatform = platforms.find(p => Math.abs(p.y - 120 * sy) < 5 && p.x > width/2) || platforms[platforms.length-1];
    let boarW = npc5LonelyFrames[0].w * CHAR_SCALE;
    let boarH = npc5LonelyFrames[0].h * CHAR_SCALE;
    let boarX = boarPlatform.x + 20;
    let boarY = boarPlatform.y - boarH;
    let boarRect = { x: boarX, y: boarY, w: boarW, h: boarH };

    // 3. 建立 Boss (NPC 4) - 隨機分布，避開傳送門與野豬
    // NPC 4 尺寸參考 walkFrames: 43x35
    let bossW = 43;
    let bossH = 35;
    let bossScale = 1.8; // 蝸牛比較小，放大倍率設高一點當 Boss (縮小一點)
    let bossActualW = bossW * bossScale * CHAR_SCALE;
    let bossActualH = bossH * bossScale * CHAR_SCALE;
    
    // 取得避讓區域
    let portalRect = getPortalRect(2, platforms);
    let bossPos = getRandomSafePosition(platforms, bossActualW, bossActualH, [portalRect, boarRect]);
    

    npcs.push({
      id: 4, // 改為 4 (蝸牛)
      idleSheet: npc4Image, // 靜態圖
      idleFrames: null,
      walkSheet: npc4WalkSheet,
      walkFrames: npc4WalkFrames,
      deadSheet: npc4DeadSheet,
      deadFrames: npc4DeadFrames,
      x: bossPos.x,
      y: bossPos.y,
      w: bossActualW,
      h: bossActualH,
      scale: bossScale,
      hasTrail: true, // ★ 開啟黏液痕跡
      trail: [],
      canMove: true,
      state: 'idle',
      direction: -1,
      walkSpeed: 0.8,
      decisionTimer: 0,
      isDefeated: false,
      isFading: false,
      alpha: 255,
      animationTimer: 0,
      isInteractive: true,
      isGatekeeper: true
    });

    // 4. 建立 NPC 5 (野豬)
    
    npcs.push({
      id: 5,
      idleSheet: npc5LonelySheet,
      idleFrames: npc5LonelyFrames,
      walkSheet: npc5WalkSheet,
      walkFrames: npc5WalkFrames,
      x: boarX,
      y: boarY,
      w: boarW,
      h: boarH,
      canMove: false, // 受傷狀態不動
      state: 'idle',
      direction: -1, // 面向左
      walkSpeed: 0.5,
      decisionTimer: 100,
      questState: 'lonely', // 需要治療
      isDefeated: false,
      isFading: false,
      alpha: 255,
      animationTimer: 0,
      isInteractive: false
    });

    // 4. 建立蒐集品 (血瓶) - 隨機位置
    let collectibleX = random(width * 0.1, width * 0.9);
    let colPlatform = platforms.find(p => collectibleX >= p.x && collectibleX < p.x + p.w) || platforms[0];
    collectibles.push({
      img: collectibleImage,
      x: collectibleX,
      y: colPlatform.y - 80 * CHAR_SCALE * 0.5,
      visible: true
    });

    // 設定問題
    let qData = getNextQuestion();
    currentQuestion = { ...qData };
    
    let boss = npcs.find(n => n.isGatekeeper);
    if (boss) {
      boss.questionData = qData;
      boss.wrongCount = 0;
    }
  } else if (scene === 3) {
    // --- 場景 3 ---
    let sx = width / baseWidth;
    let sy = height / baseHeight;

    platforms = [
      // 1. 斜坡 (33 477 到 1126 445)
      { x: 33 * sx, y: 477 * sy, w: (1126 - 33) * sx, h: 50 * sy, type: 'slope', y1: 477 * sy, y2: 445 * sy },
      // 2. 平台 (1126 445 到 1535 445)
      { x: 1126 * sx, y: 445 * sy, w: (1535 - 1126) * sx, h: 50 * sy },
      
      // 3. 跳躍型平台 (196 421 到 406 421)
      { x: 196 * sx, y: 421 * sy, w: (406 - 196) * sx, h: 20 * sy, type: 'one-way' },
      // 4. 跳躍型平台 (154 379 到 344 379)
      { x: 154 * sx, y: 379 * sy, w: (344 - 154) * sx, h: 20 * sy, type: 'one-way' },
      // 5. 跳躍型平台 (106 337 到 264 337)
      { x: 106 * sx, y: 337 * sy, w: (264 - 106) * sx, h: 20 * sy, type: 'one-way' },
      // 6. 跳躍型平台 (0 311 到 199 311)
      { x: 0 * sx, y: 311 * sy, w: (199 - 0) * sx, h: 20 * sy, type: 'one-way' },

      // 7. 斜坡 (139 290 到 380 266)
      { x: 139 * sx, y: 290 * sy, w: (380 - 139) * sx, h: 20 * sy, type: 'slope', y1: 290 * sy, y2: 266 * sy },
      // 8. 平台 (380 266 到 615 266)
      { x: 380 * sx, y: 266 * sy, w: (615 - 380) * sx, h: 20 * sy },
      // 9. 斜坡 (615 266 到 833 256)
      { x: 615 * sx, y: 266 * sy, w: (833 - 615) * sx, h: 20 * sy, type: 'slope', y1: 266 * sy, y2: 256 * sy },
      
      // 10. 平台 (840 275 到 937 275)
      { x: 840 * sx, y: 275 * sy, w: (937 - 840) * sx, h: 20 * sy },
      
      // 11. 平台 (902 380 到 1535 380)
      { x: 902 * sx, y: 380 * sy, w: (1535 - 902) * sx, h: 20 * sy, type: 'one-way' }
    ];

    // 1. 建立背景 NPC (樹妖 NPC 3)
    for (let i = 0; i < 5; i++) {
      let platform = platforms[floor(random(platforms.length))];
      let npcX = random(platform.x, platform.x + platform.w);
      
      // ★ 修正：計算斜坡上的正確 Y 座標
      let npcY = platform.y;
      if (platform.type === 'slope') {
        let t = (npcX - platform.x) / platform.w;
        npcY = platform.y1 + (platform.y2 - platform.y1) * t;
      }
      
      npcs.push({
        id: 3,
        idleSheet: npc3Image,
        idleFrames: null, // NPC 3 待機是靜態圖
        walkSheet: npc3WalkSheet,
        walkFrames: npc3WalkFrames,
        deadSheet: npc3DeadSheet,
        deadFrames: npc3DeadFrames,
        x: npcX,
        y: npcY - npc3WalkFrames[0].h * CHAR_SCALE,
        w: npc3WalkFrames[0].w * CHAR_SCALE,
        h: npc3WalkFrames[0].h * CHAR_SCALE,
        canMove: true,
        state: 'idle',
        direction: (random() > 0.5) ? 1 : -1,
        walkSpeed: random(0.5, 1.5),
        decisionTimer: 0, // ★ 修改：設為 0 讓 NPC 一開始就動起來
        isDefeated: false,
        isFading: false,
        alpha: 255,
        animationTimer: 0,
        isInteractive: false
      });
    }

    // 2. 預先計算 NPC 5 (野豬) 位置 - 固定在 380 的平台 (平台 11: 902 380)
    let boarPlatform = platforms[10]; 
    let boarW = npc5LonelyFrames[0].w * CHAR_SCALE;
    let boarH = npc5LonelyFrames[0].h * CHAR_SCALE;
    let boarX = boarPlatform.x + 50;
    let boarY = boarPlatform.y - boarH;
    let boarRect = { x: boarX, y: boarY, w: boarW, h: boarH };

    // 3. 建立 Boss (NPC 3) - 隨機分布，避開傳送門與野豬
    let bossScale = 1.5;
    let bossW = npc3WalkFrames[0].w * bossScale * CHAR_SCALE;
    let bossH = npc3WalkFrames[0].h * bossScale * CHAR_SCALE;
    
    let portalRect = getPortalRect(3, platforms);
    let bossPos = getRandomSafePosition(platforms, bossW, bossH, [portalRect, boarRect]);
    
    npcs.push({
      id: 3,
      idleSheet: npc3Image,
      idleFrames: null,
      walkSheet: npc3WalkSheet,
      walkFrames: npc3WalkFrames,
      deadSheet: npc3DeadSheet,
      deadFrames: npc3DeadFrames,
      x: bossPos.x,
      y: bossPos.y,
      w: bossW,
      h: bossH,
      scale: bossScale,
      canMove: true,
      state: 'idle',
      direction: -1,
      walkSpeed: 0.8,
      decisionTimer: 0, // ★ 修改：設為 0 讓 NPC 一開始就動起來
      isDefeated: false,
      isFading: false,
      alpha: 255,
      animationTimer: 0,
      isInteractive: true,
      isGatekeeper: true
    });

    npcs.push({
      id: 5,
      idleSheet: npc5LonelySheet,
      idleFrames: npc5LonelyFrames,
      walkSheet: npc5WalkSheet,
      walkFrames: npc5WalkFrames,
      x: boarX,
      y: boarY,
      w: boarW,
      h: boarH,
      canMove: false,
      state: 'idle',
      direction: -1,
      walkSpeed: 0.5,
      decisionTimer: 100,
      questState: 'lonely',
      isDefeated: false,
      isFading: false,
      alpha: 255,
      animationTimer: 0,
      isInteractive: false
    });

    // 4. 建立蒐集品 (血瓶)
    let collectibleX = random(width * 0.1, width * 0.9);
    let colPlatform = platforms.find(p => collectibleX >= p.x && collectibleX < p.x + p.w) || platforms[0];
    collectibles.push({
      img: collectibleImage,
      x: collectibleX,
      y: colPlatform.y - 80 * CHAR_SCALE * 0.5,
      visible: true
    });
    
    // 設定問題
    let qData = getNextQuestion();
    currentQuestion = { ...qData };
    
    let boss = npcs.find(n => n.isGatekeeper);
    if (boss) {
      boss.questionData = qData;
      boss.wrongCount = 0;
    }
  } else {
    // 其他場景 (暫時留空或隨機生成)
    // 可以在這裡擴充 Scene 2, 3, 4 的邏輯
    
    // ★ 新增：預設地面，避免進入下一關時無限掉落
    platforms = [
      { x: 0, y: height - 50, w: width, h: 50 }
    ];
  }
}

// ★ 新增：取得傳送門位置與大小的輔助函式
function getPortalRect(scene, platforms) {
  let sx = width / baseWidth;
  let sy = height / baseHeight;
  let portalW = walkFrames[0].w * CHAR_SCALE * 1.5;
  let portalH = walkFrames[0].h * CHAR_SCALE * 1.5;
  let portalX, portalY;

  if (scene === 2) {
    // Scene 2: 最右邊平台 (Platform 4: 1465 * sx)
    portalX = 1465 * sx;
    portalY = 451 * sy - portalH + 15;
  } else {
    // Default: 最後一個平台
    if (platforms.length > 0) {
      let p = platforms[platforms.length - 1];
      portalX = p.x + p.w - portalW - 50;
      portalY = p.y - portalH + 15;
    } else {
      portalX = width - portalW - 20;
      portalY = height / 2 - portalH + 15;
    }
  }
  return { x: portalX, y: portalY, w: portalW, h: portalH };
}

// ★ 新增：取得隨機安全位置 (避開傳送門與野豬)
function getRandomSafePosition(platforms, w, h, avoidRects) {
  let attempts = 0;
  while (attempts < 50) {
    let p = random(platforms);
    let minX = p.x;
    let maxX = p.x + p.w - w;
    
    if (maxX >= minX) {
      let x = random(minX, maxX);
      let y = p.y;
      if (p.type === 'slope') {
        let t = (x - p.x) / p.w;
        y = p.y1 + (p.y2 - p.y1) * t;
      }
      y -= h;
      
      // 檢查碰撞
      let safe = true;
      for (let r of avoidRects) {
        // 簡單的矩形重疊檢查 (加上 150px 的安全距離)
        let buffer = 150;
        if (x < r.x + r.w + buffer && x + w + buffer > r.x &&
            y < r.y + r.h + buffer && y + h + buffer > r.y) {
          safe = false;
          break;
        }
      }
      
      if (safe) return { x, y };
    }
    attempts++;
  }
  // 如果嘗試失敗，回傳第一個平台的位置
  return { x: platforms[0].x, y: platforms[0].y - h };
}
