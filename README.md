# Jogo de Bolinhas

Um jogo simples desenvolvido com HTML5, CSS e JavaScript, onde o jogador controla uma bolinha azul para coletar bolinhas verdes (comida) enquanto evita bolinhas vermelhas (inimigos).

## Como Jogar

1. Abra o arquivo `index.html` em seu navegador.
2. Clique no botão "Iniciar Jogo" para começar.
3. Use as teclas de seta (↑, ↓, ←, →) ou WASD para mover a bolinha azul.
4. Colete as bolinhas verdes para ganhar pontos.
5. Evite as bolinhas vermelhas, pois elas causam Game Over.
6. A cada 100 pontos, você sobe de nível e a dificuldade aumenta.

## Características

- Controle intuitivo da bolinha do jogador
- Sistema de pontuação e níveis
- Inimigos com movimento e velocidade variáveis
- Detecção de colisão
- Pausar/retomar o jogo
- Design responsivo

## Tecnologias Utilizadas

- HTML5 Canvas
- CSS3
- JavaScript (ES6)

## Personalização

O jogo possui várias configurações que podem ser ajustadas no arquivo `js/game.js`, na constante `gameConfig`:

- Velocidade do jogador
- Tamanho das bolinhas
- Quantidade inicial de comida e inimigos
- Pontos por comida
- Pontuação necessária para subir de nível
- Velocidade dos inimigos

## Próximos Passos

Algumas ideias para melhorar o jogo:

- Adicionar sons
- Implementar power-ups
- Criar modos de jogo diferentes
- Salvar recordes localmente
- Adicionar suporte para toque em dispositivos móveis 
