
const container = document.getElementById('container');
container.style.display = 'none';// hides the game until start button is clicked.
const allBtns = document.querySelectorAll('.square');

const statusTxt = document.getElementById('status');

function players(name, letter){
    let points = 0;
    let markArea = [];
    const addPoints = ()=> points++;
    const resetPoints = ()=> points = 0;
    const showPoints = ()=> points;
    return {name, letter, addPoints, showPoints, markArea, resetPoints}
}

const player1 = players('player1', 'X');
const player2 = players('player2', 'O');

const gameBoard = (function (){
    let board =['', '', '', '', '', '', '', '', ''];
 
    return {board};
})()



 

    const gameFlow = {
      
        winStatus: false,
        tieStatus: false,

        winCombos:[
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [6, 4, 2],
            [2, 5, 8],
            [1, 4, 7],
            [0, 3, 6],
        ],

    checkWin:function(playerName){
        
            let playedArea = playerName.markArea;
            for (const i in gameFlow.winCombos){
                if(gameFlow.winCombos[i].every(arr => playedArea.includes(arr))){  
                    for(const area of gameFlow.winCombos[i]){
                        let winLine = document.getElementById(`box${area}`);
                        winLine.classList.add('winCombo');
                    }
                    statusTxt.textContent = `You Win ${playerName.name}!`;
                    playerName.addPoints();
                    displayControl()
                    allBtns.disabled = true;
                   return gameFlow.winStatus = true;
                }
            }
    },
    checkTie:function(){
            const isFull = (eachBox) => eachBox !=='';
            if(gameBoard.board.every(isFull) && gameFlow.winStatus === false){
             alert('its a tie');
             allBtns.disabled = true;
             return gameFlow.tieStatus = true;
            }
    },
    playTurn:function(playerName, position){
        if(gameBoard.board[position] === ''){
            playerName.markArea.push(position);
            gameBoard.board[position] = playerName.letter;
        }displayControl();
        gameFlow.checkWin(playerName);
        gameFlow.checkTie(); 
        document.getElementById(`box${position}`). disabled = true;
    },
    nextRound:function(){
        player1.markArea = [];
        player2.markArea = [];
        allBtns.disabled = false;
        gameFlow.winStatus = false;
        gameFlow.tieStatus = false;
        statusTxt.textContent = '';
        for(let i =0; i< gameBoard.board.length; i++){
            gameBoard.board[i] = '';
        }
        for (let i=0; i< gameBoard.board.length;i++){
            let square = document.getElementById(`box${i}`);
            square.disabled = false;
            square.classList.remove('winCombo');

        }
        document.querySelector('.square').disabled = false;
        displayControl();
    }, 
    reset:function(){
        player1.markArea = [];
        player2.markArea = [];
        allBtns.disabled = false;
        gameFlow.winStatus = false;
        gameFlow.tieStatus = false;
        player1.resetPoints();
        player2.resetPoints();
        statusTxt.textContent = '';
        for(let i =0; i< gameBoard.board.length; i++){
            gameBoard.board[i] = '';
        }
        for (let i=0; i< gameBoard.board.length;i++){
            let square = document.getElementById(`box${i}`);
            square.disabled = false;
            square.classList.remove('winCombo');

        }
       
        displayControl();
    }, 
    ai:function(){
       
        let legalPlays=[];
        for(let i = 0; i< gameBoard.board.length; i++){
            if(gameBoard.board[i] === ''){
                legalPlays.push(i);
            } 
            };

         let aiPlay;
         let won = false;
         let winValue;
         let blockValue;
         let blocked = false;
      
        for(let eachCombo of gameFlow.winCombos){
            
            let blockCount = 0;
            let getWin = 0;
            let potentialBlock;
            let potentialWin;

            for(const notPlayed of eachCombo){

                if(player2.markArea.includes(notPlayed)){
                    ++getWin;
                } else {
                    potentialWin = notPlayed;

                } if(getWin === 2 && legalPlays.includes(potentialWin)){
                     winValue = potentialWin;
                     won = true;
                }

                 if(player1.markArea.includes(notPlayed)){
                    ++blockCount;
                 } else{
                    potentialBlock = notPlayed;
                 }
                 if(blockCount === 2 && legalPlays.includes(potentialBlock)){
                    blockValue = potentialBlock;
                    blocked = true;

                 } 
            }
        }
                if(blocked === true && won === false){
                    aiPlay = blockValue;
                   
                } else if(won === true){
                    aiPlay = winValue;
                   
                } else{
                    aiPlay = Number(legalPlays[Math.floor(Math.random() * legalPlays.length)]);
                }     
                return aiPlay;
        

          
},
     startGame:function(){
        container.style.display = 'grid';
        playerForm.style.display = 'none';
        gameMode.forEach(function(btn){
            let checkedBtn = document.getElementById(btn.id);
            checkedBtn.style.display = 'none';
        })


},
    back:function(){// remove main container and show form and start btn again
        container.style.display = 'none';
        playerForm.style.display = 'block';
        gameMode.forEach(function(btn){
            let checkedBtn = document.getElementById(btn.id);
            checkedBtn.style.display = 'flex';
        })
    }
    }

    const startBtn = document.getElementById('startGame');
    const backBtn = document.getElementById('back');
    const playerForm = document.getElementById('playerForm')
    const firstPlayer = document.getElementById('player1');
    const secondPlayer = document.getElementById('player2');
    const gameMode = document.querySelectorAll('.switchBtn');
    let aiMode = false;
    let multiMode = false;

    gameMode.forEach(function(btn){ 
        btn.addEventListener('click',()=>{
          
    let checkedBtn = document.getElementById(btn.id);
    if(checkedBtn.className !== 'checked'){
        gameMode.forEach(function(allBtn){
            allBtn.classList.remove('checked');
            aiMode = false;
            multiMode = false;
        });

        checkedBtn.classList.add('checked');
       if(checkedBtn.id === 'botPlayer'){
        aiMode = true;
       }else if(checkedBtn.id === 'otherPlayer'){
        multiMode = true;
       };
    }
 })});

    startBtn.addEventListener('click',(event)=>{ // Add name to the scoreboard and show game board.
        event.preventDefault(); // stop form attempting to discard inputs
      if(aiMode === true || multiMode === true){ 
        player1.name = firstPlayer.value === '' ? 'player1' : firstPlayer.value;

        if(multiMode === true){
            secondPlayer.value = secondPlayer.value === '' ? 'Player2' : secondPlayer.value;
            player2.name = secondPlayer.value;
        } else{ player2.name = 'Bot'}
        gameFlow.startGame();
        gameFlow.reset() 
        displayControl();
    }})

    backBtn.addEventListener('click', gameFlow.back)

    const reset = document.getElementById('reset');
    reset.addEventListener('click', gameFlow.reset);

    const nextRound = document.querySelector('#nextRound');
    nextRound.addEventListener('click',gameFlow.nextRound);

    const squareBtn = document.querySelector('#board');


     squareBtn.addEventListener('click', (e)=>{
        let squareId = e.target.id;// take whole id
        let splitId = squareId.split(/(\d+)/); //split by digits
        let position = Number(splitId[1]); // digit of id and turn into number
        if (gameFlow.tieStatus !== true && gameFlow.winStatus !== true){
          
            if(multiMode === true && aiMode === false){
                let xCount = 0;
                let oCount = 0;
                for(const mark of gameBoard.board){
                   if (mark === 'X') xCount++;
                   if (mark === 'O') oCount++;  
                }   
                if(xCount > oCount){
                        gameFlow.playTurn(player2, position);
                } else {
                        gameFlow.playTurn(player1, position);
                } 
            } else if(aiMode === true && multiMode === false){
                gameFlow.playTurn(player1, position);

                if (gameFlow.tieStatus !== true && gameFlow.winStatus !== true){
                    gameFlow.playTurn(player2, gameFlow.ai());
                }
            }
        } 
    });
    
     function displayControl(){
        let scoreBoard = document.getElementById('scoreBoard');
        scoreBoard.textContent = `${player1.name} ${player1.showPoints()} - ${player2.showPoints()} ${player2.name}`;
        
    const gridBoard = document.getElementById('board');
    for(let i = 0; i < gameBoard.board.length; i++){
        let box = document.getElementById('box'+i);
        box.textContent = gameBoard.board[i];
        gridBoard.appendChild(box);
    }
        container.appendChild(gridBoard);
}
    displayControl();


