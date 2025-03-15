/**
 * Jogo de Bolinhas
 * 
 * Um jogo simples onde o jogador controla uma bolinha para coletar
 * outras bolinhas menores e evitar obstáculos.
 */

// Configurações do jogo
const gameConfig = {
    fps: 60,
    playerSpeed: 5,
    playerSize: 20,
    foodSize: 10,
    enemySize: 15,
    initialFoodCount: 10,
    initialEnemyCount: 5,
    pointsPerFood: 10,
    levelUpScore: 100,
    enemySpeedMultiplier: 0.8,
    gameOverDelay: 3000 // Tempo de espera em ms antes de mostrar o botão de reinício
};

// Variáveis globais
let canvas, ctx;
let player;
let foods = [];
let enemies = [];
let score = 0;
let level = 1;
let gameInterval;
let isPaused = false;
let keysPressed = {};
let isGameOver = false;
let gameMessagesElement;

// Classes do jogo
class Ball {
    constructor(x, y, radius, color, speedX = 0, speedY = 0) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Manter a bola dentro dos limites do canvas
        if (this.x - this.radius < 0) {
            this.x = this.radius;
        } else if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
        }
        
        if (this.y - this.radius < 0) {
            this.y = this.radius;
        } else if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
        }
    }

    collidesWith(otherBall) {
        const dx = this.x - otherBall.x;
        const dy = this.y - otherBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + otherBall.radius;
    }
}

// Inicialização do jogo
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    gameMessagesElement = document.getElementById('gameMessages');
    
    // Ajustar tamanho do canvas
    canvas.width = 600;
    canvas.height = 400;
    
    // Criar jogador (bolinha principal)
    player = new Ball(
        canvas.width / 2,
        canvas.height / 2,
        gameConfig.playerSize,
        '#1e90ff'
    );
    
    // Criar comida (bolinhas menores)
    createFood(gameConfig.initialFoodCount);
    
    // Criar inimigos
    createEnemies(gameConfig.initialEnemyCount);
    
    // Configurar eventos de teclado
    setupKeyboardControls();
    
    // Atualizar placares
    updateScore();
    updateLevel();
    
    // Configurar botões
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('pauseButton').addEventListener('click', togglePause);
    
    // Exibir mensagem inicial
    showMessage('Clique em "Iniciar Jogo" para começar');
}

// Criar bolinhas de comida
function createFood(count) {
    for (let i = 0; i < count; i++) {
        const food = new Ball(
            Math.random() * (canvas.width - 2 * gameConfig.foodSize) + gameConfig.foodSize,
            Math.random() * (canvas.height - 2 * gameConfig.foodSize) + gameConfig.foodSize,
            gameConfig.foodSize,
            '#32cd32' // Verde
        );
        foods.push(food);
    }
}

// Criar bolinhas de inimigos
function createEnemies(count) {
    for (let i = 0; i < count; i++) {
        const speedX = (Math.random() - 0.5) * 2 * gameConfig.enemySpeedMultiplier * level;
        const speedY = (Math.random() - 0.5) * 2 * gameConfig.enemySpeedMultiplier * level;
        
        const enemy = new Ball(
            Math.random() * (canvas.width - 2 * gameConfig.enemySize) + gameConfig.enemySize,
            Math.random() * (canvas.height - 2 * gameConfig.enemySize) + gameConfig.enemySize,
            gameConfig.enemySize,
            '#ff6347', // Vermelho
            speedX,
            speedY
        );
        enemies.push(enemy);
    }
}

// Configurar controles de teclado
function setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
        keysPressed[e.key] = true;
    });
    
    window.addEventListener('keyup', (e) => {
        keysPressed[e.key] = false;
    });
}

// Atualizar posição do jogador com base nas teclas pressionadas
function updatePlayerPosition() {
    let horizontalSpeed = 0;
    let verticalSpeed = 0;
    
    // Teclas de seta e WASD
    if (keysPressed['ArrowLeft'] || keysPressed['a']) horizontalSpeed -= gameConfig.playerSpeed;
    if (keysPressed['ArrowRight'] || keysPressed['d']) horizontalSpeed += gameConfig.playerSpeed;
    if (keysPressed['ArrowUp'] || keysPressed['w']) verticalSpeed -= gameConfig.playerSpeed;
    if (keysPressed['ArrowDown'] || keysPressed['s']) verticalSpeed += gameConfig.playerSpeed;
    
    // Movimento diagonal deve ser normalizado
    if (horizontalSpeed !== 0 && verticalSpeed !== 0) {
        const factor = 1 / Math.sqrt(2);
        horizontalSpeed *= factor;
        verticalSpeed *= factor;
    }
    
    player.speedX = horizontalSpeed;
    player.speedY = verticalSpeed;
}

// Loop principal do jogo
function gameLoop() {
    if (isPaused) return;
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Atualizar posição do jogador
    updatePlayerPosition();
    player.update();
    
    // Atualizar e desenhar comida
    foods.forEach(food => {
        food.draw();
        
        // Checar colisão com jogador
        if (player.collidesWith(food)) {
            // Remover comida colidida
            const index = foods.indexOf(food);
            foods.splice(index, 1);
            
            // Adicionar pontos
            score += gameConfig.pointsPerFood;
            updateScore();
            
            // Verificar level up
            if (score >= level * gameConfig.levelUpScore) {
                levelUp();
            }
            
            // Adicionar nova comida
            createFood(1);
        }
    });
    
    // Atualizar e desenhar inimigos
    enemies.forEach(enemy => {
        // Mover inimigo
        enemy.update();
        
        // Rebater nas bordas
        if (enemy.x - enemy.radius <= 0 || enemy.x + enemy.radius >= canvas.width) {
            enemy.speedX = -enemy.speedX;
        }
        if (enemy.y - enemy.radius <= 0 || enemy.y + enemy.radius >= canvas.height) {
            enemy.speedY = -enemy.speedY;
        }
        
        enemy.draw();
        
        // Checar colisão com jogador
        if (player.collidesWith(enemy)) {
            gameOver();
        }
    });
    
    // Desenhar jogador
    player.draw();
}

// Função para exibir mensagens
function showMessage(text, duration = 0) {
    gameMessagesElement.innerHTML = `<p>${text}</p>`;
    gameMessagesElement.classList.add('visible');
    
    if (duration > 0) {
        setTimeout(() => {
            gameMessagesElement.classList.remove('visible');
        }, duration);
    }
}

// Esconder mensagem
function hideMessage() {
    gameMessagesElement.classList.remove('visible');
}

// Iniciar o jogo
function startGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    
    // Esconder mensagens
    hideMessage();
    
    // Resetar variáveis do jogo quando reiniciar
    if (isGameOver || document.getElementById('startButton').textContent === 'Jogar Novamente') {
        // Resetar jogo
        score = 0;
        level = 1;
        foods = [];
        enemies = [];
        isGameOver = false;
        
        // Reposicionar jogador
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
        
        // Resetar botão de iniciar
        document.getElementById('startButton').style.backgroundColor = '';
        document.getElementById('startButton').style.transform = '';
        
        // Recriar comida e inimigos
        createFood(gameConfig.initialFoodCount);
        createEnemies(gameConfig.initialEnemyCount);
        
        // Atualizar interface
        updateScore();
        updateLevel();
    }
    
    isPaused = false;
    gameInterval = setInterval(gameLoop, 1000 / gameConfig.fps);
    document.getElementById('startButton').textContent = 'Reiniciar Jogo';
}

// Pausar/Despausar o jogo
function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseButton').textContent = isPaused ? 'Continuar' : 'Pausar';
}

// Atualizar pontuação
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Atualizar nível
function updateLevel() {
    document.getElementById('level').textContent = level;
}

// Subir de nível
function levelUp() {
    level++;
    updateLevel();
    
    // Aumentar dificuldade
    createEnemies(1); // Adicionar um novo inimigo
    
    // Aumentar velocidade dos inimigos existentes
    enemies.forEach(enemy => {
        if (enemy.speedX > 0) enemy.speedX += 0.2;
        else enemy.speedX -= 0.2;
        
        if (enemy.speedY > 0) enemy.speedY += 0.2;
        else enemy.speedY -= 0.2;
    });
}

// Game over
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    
    // Efeito visual ao colidir
    flashScreen();
    
    // Mostrar mensagem de Game Over
    setTimeout(() => {
        showMessage(`
            <strong style="color: #ff6347; font-size: 24px;">GAME OVER!</strong><br>
            Pontuação: ${score} | Nível: ${level}<br>
            <span style="color: #32cd32;">Clique em "Jogar Novamente" para reiniciar</span>
        `);
        
        // Destacar botão de reiniciar
        document.getElementById('startButton').textContent = 'Jogar Novamente';
        document.getElementById('startButton').style.backgroundColor = '#32cd32';
        document.getElementById('startButton').style.transform = 'scale(1.1)';
    }, 1000);
}

// Efeito visual de flash na tela quando o jogador colide com inimigo
function flashScreen() {
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'red';
    overlay.style.opacity = '0.5';
    overlay.style.zIndex = '5';
    overlay.style.pointerEvents = 'none';
    
    document.querySelector('.canvas-container').appendChild(overlay);
    
    // Remover o overlay após a animação
    setTimeout(() => {
        overlay.remove();
    }, 300);
}

// Inicializar o jogo quando a página carregar
window.addEventListener('load', initGame); 