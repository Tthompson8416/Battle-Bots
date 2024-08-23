const HEALTH_COST = 7;
const ATTACK_UPGRADE_COST = 7;
const ATTACK_UPGRADE_AMOUNT = 6;
const SKIP_COST = 10;
const WINNING_MONEY = 20;
const INITIAL_HEALTH = 100;
const INITIAL_ATTACK = 10;
const INITIAL_MONEY = 20;

// Generate a random numeric value
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Set player name
const getPlayerName = () => {
  let name = "";

  while (name === "" || name === null) {
    name = prompt("What is your robot's name?");
    if (name === null) {
      alert("Name cannot be empty. Please try again.");
    }
  }

  console.log(`Your robot's name is ${name}`);
  return name;
};

const playerInfo = {
  name: getPlayerName(),
  health: INITIAL_HEALTH,
  attack: INITIAL_ATTACK,
  money: INITIAL_MONEY,

  reset: function () {
    this.health = INITIAL_HEALTH;
    this.attack = INITIAL_ATTACK;
    this.money = INITIAL_MONEY;
  },

  refillHealth: function () {
    if (playerInfo.money >= 7) {
      alert(`Refilling player's health by 20 for ${HEALTH_COST} dollars.`);
      this.health += 20;
      this.money -= HEALTH_COST;
    } else {
     alert("You don't have enough money!");
    }
  },

  upgradeAttack: function () {
    if (this.money >= ATTACK_UPGRADE_COST) {
      alert(`Upgrading player's attack by ${ATTACK_UPGRADE_AMOUNT} for ${ATTACK_UPGRADE_COST} dollars.`);
      this.attack += ATTACK_UPGRADE_AMOUNT;
      this.money -= ATTACK_UPGRADE_COST;
    } else {
      alert("You don't have enough money!");
    }
  },
};

const enemyInfo = [
  {
    name: "Roborto",
    attack: randomNumber(10, 14),
  },
  {
    name: "Amy Android",
    attack: randomNumber(10, 14),
  },
  {
    name: "Robo Trumble",
    attack: randomNumber(10, 14),
  },
];

const fightOrSkip = () => {
  let promptFight;
  
  while (true) {
    promptFight = window.prompt("Would you like to FIGHT or SKIP this battle? Enter 'Fight' or 'SKIP' to choose.").toLowerCase();

    if (promptFight === "fight" || promptFight === "skip") {
      break;
    } else {
      alert("You need to provide a valid answer! Please try again.");
    }
  }

  // If player picks "skip" confirm and then stop the loop
  if (promptFight === "skip") {
    const confirmSkip = window.confirm("Are you sure you'd like to quit?");

    if (confirmSkip) {
      alert(`${playerInfo.name} has decided to skip this fight. Let's go to next round!"`);

      // Subtract money from playerInfo.money for skipping
      playerInfo.money = Math.max(0, playerInfo.money - SKIP_COST);
      console.log("playerInfo.money", playerInfo.money);
      return true;
    }
  }
  return false;
};

// Fight function
const fight = (enemy) => {
  let isPlayerTurn = Math.random() > 0.5;

  while (playerInfo.health > 0 && enemy.health > 0) {
    if (isPlayerTurn) {
      if (fightOrSkip()) {
        break;
      }

      const damage = randomNumber(playerInfo.attack - 3, playerInfo.attack);
      enemy.health = Math.max(0, enemy.health - damage);
      console.log(`${playerInfo.name} attacked ${enemy.name}. ${enemy.name} now has ${enemy.health} health remaining.`);

      // Check enemy's health
      if (enemy.health <= 0) {
        alert(`${enemy.name} has died!`);
        // Award player money for winning
        playerInfo.money += WINNING_MONEY;
        break;
      } else {
        alert(`${enemy.name} still has ${enemy.health} health left.`);
      }
    } else {
      const damage = randomNumber(enemy.attack - 3, enemy.attack);
      playerInfo.health = Math.max(0, playerInfo.health - damage);
      console.log(`${enemy.name} attacked ${playerInfo.name}. ${playerInfo.name}vnow has ${playerInfo.health} health remaining.`);

      // Check player's health
      if (playerInfo.health <= 0) {
        alert(`${playerInfo.name} has died!`);
        break;
      } else {
        alert(`${playerInfo.name} still has ${playerInfo.health} health left.`);
      }
    }
    isPlayerTurn = !isPlayerTurn;
  }
};

// End / exit the game entirely
const endGame = () => {
  alert("The game has now ended. Let's see how you did!");

  let highScore = localStorage.getItem("highscore");
  highScore = highScore ? parseInt(highScore) : 0;

  if (playerInfo.money > highScore) {
    localStorage.setItem("highscore", playerInfo.money.toString());
    localStorage.setItem("name", playerInfo.name);
    alert(`${playerInfo.name} now has the high score of ${highScore}. Maybe next time!`);
  }

  const playAgainConfirm = window.confirm("Would you like to play again?");

  if (playAgainConfirm) {
    startGame();
  } else {
    alert("Thank you for playing Battle Bots! Come back soon!");
  }
};
// Shop function
const shop = () => {
  let shopOptionPrompt;

  while (true) {
    shopOptionPrompt = window.prompt("Would you like to REFILL your health, UPGRADE your attack, or LEAVE the store? Please enter: 1 for 'REFILL', 2 for 'UPGRADE', or 3 for 'LEAVE' to make a choice.");

    shopOptionPrompt = parseInt(shopOptionPrompt);

    if (shopOptionPrompt >= 1 && shopOptionPrompt <= 3) {
      break;
    } else {
      alert.apply("You did not pick a valid option. Try again.");
    }
  }

  // Use switch to carry out action
  switch (shopOptionPrompt) {
    case 1:
      playerInfo.refillHealth();
      break;

    case 2:
      playerInfo.upgradeAttack();
      break;

    case 3:
      alert("Leaving the store.");
      break;
  }
};

// Start a new game
const startGame = () => {
  playerInfo.reset();

  // Fight each enemy-robot by looping over them and fighting them one at a time
  for (let i = 0; i < enemyInfo.length; i++) {

    // If player is still alive, keep fighting
    if (playerInfo.health > 0) {
      alert(`Welcome to Battle Bots! Round ${i + 1}`);

      // Pick new enemy to fight based on the index of the enemyNames array
      const pickedEnemyObj = enemyInfo[i];

      // Reset enemyHealth before starting new fight
      pickedEnemyObj.health = randomNumber(40, 60);

      fight(pickedEnemyObj);

      // If player is still alive and we're not at the last enemy in the array
      if (playerInfo.health > 0 && i < enemyInfo.length - 1) {
        const storeConfirm = window.confirm("The fight is over, visit the store before the next round?");

        // If yes, take them to the store() function
        if (storeConfirm) {
          shop();
        }
      }
    } else {
      break;
    }
  }
  // After the loop ends, player is either out of health or enemies to fight, so run the endGame function
  endGame();
};

// Start game again when the page reloads
startGame();
