/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/



// console.log(dice);
// document.querySelector('#current-'+ activePlayer).textContent =dice;
// document.querySelector('#current-'+activePlayer).innerHTML='<em>' + dice + '</em>';

// var x= document.querySelector('#score-0').textContent;  
// console.log(x);

//setting the intial score to 0. 



// function btn(){

// }
var scores,roundScore,activePlayer,gamePlayer;
var diceCount=[];
init();
document.querySelector('.btn-roll').addEventListener('click',function(){
    if(gamePlayer){
    //1. generate a random number
    var dice;
    dice0=Math.floor(Math.random()*6)+1;
    dice1=Math.floor(Math.random()*6)+1;
    //2.display the result
    var diceDOM =document.querySelector('.dice0');
    diceDOM.style.display='block';
    diceDOM.src ='dice-'+dice0+'.png';
    
    var dice_DOM =document.querySelector('.dice1');
    dice_DOM.style.display='block';
    dice_DOM.src ='dice-'+dice1+'.png';
    
    diceCount.unshift(dice0,dice1);
    if(diceCount.length>2){
        diceCount.pop();
        diceCount.pop();
    }
    //3.update the round score if the rolled dice is not 1.
    if(dice0 !== 1 && dice1!==1){
        roundScore+= dice0+dice1; 
        document.querySelector('#current-'+ activePlayer).textContent =roundScore;
        if(dice0 === 6 && dice1 === 6 ){
            
           
            if(diceCount[1] ===diceCount[0]){
                document.getElementById('current-'+ activePlayer).textContent =0;
                document.getElementById('score-'+activePlayer).textContent=0;
                nextPlayer();
            }
            else{
                roundScore+= dice0+dice1; 
                document.querySelector('#current-'+ activePlayer).textContent =roundScore;
            }
        }
       
    }
   
    else{
        nextPlayer();

    }
    }

});

document.querySelector('.btn-hold').addEventListener('click',function(){
    if(gamePlayer){
        scores[activePlayer]+= roundScore;
        document.getElementById('score-'+activePlayer).textContent=scores[activePlayer];
    
        if(scores[activePlayer ]>=document.getElementById('setScore').value){
            document.querySelector('#name-'+activePlayer).textContent ='Winner!';
            document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
            document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
            gamePlayer=false;
        }
        
        else{
            nextPlayer();
        }
        
    
    }
    

});

document.querySelector('.btn-new').addEventListener('click', init);

function nextPlayer(){
    roundScore = 0;
    activePlayer===0 ? activePlayer=1 : activePlayer=0;
    document.querySelector('.player-0-panel').classList.toggle('active');// adds the active class if not there 
    document.querySelector('.player-1-panel').classList.toggle('active');

    // document.querySelector('.player-1-panel').classList.remove('active');
    // document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.dice0').style.display='none';
    document.querySelector('.dice1').style.display='none';
    diceCount=[];
}

function init(){
    
    scores=[0,0];
    roundScore=0;
    activePlayer =0;
    gamePlayer=true;
    document.getElementById('score-0').textContent='0';
    document.getElementById('current-0').textContent='0';
    document.getElementById('score-1').textContent='0';
    document.getElementById('current-1').textContent='0';
    document.querySelector('.dice0').style.display='none';
    document.querySelector('.dice1').style.display='none';
    document.getElementById('name-0').textContent ='Player 1';
    document.getElementById('name-1').textContent ='Player 2';
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.add('active');
}



/*
YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. 

(Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. 
(Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. 
(Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/
