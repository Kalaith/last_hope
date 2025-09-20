// Game data and state
const gameData = {
  gameState: {
    worldHealth: 5,
    humanPopulation: 847,
    playerHope: 50,
    playerHealth: 80,
    playerSanity: 70,
    resources: {
      food: 3,
      water: 2,
      energy: 4,
      knowledge: 1,
      seeds: 0
    },
    skills: {
      survival: 2,
      science: 1,
      leadership: 1,
      empathy: 2
    },
    storyProgress: 0,
    choicesMade: [],
    relationships: {},
    areasExplored: 1,
    restorationProgress: 0,
    daysSurvived: 0,
    selectedBackground: null
  },

  characterBackgrounds: [
    {
      id: "scientist",
      name: "Former Environmental Scientist",
      description: "You worked on climate restoration before the collapse. You understand the science but struggle with people.",
      startingStats: {
        science: 3,
        knowledge: 2,
        survival: 1,
        leadership: 1,
        empathy: 1,
        hope: 60
      },
      startingResources: {
        food: 2,
        water: 3,
        energy: 3,
        seeds: 2
      }
    },
    {
      id: "survivor",
      name: "Wasteland Survivor", 
      description: "You've lived through the worst of it. Tough and practical, but hope is a luxury you can't afford.",
      startingStats: {
        survival: 4,
        science: 1,
        leadership: 2,
        empathy: 1,
        knowledge: 1,
        hope: 30
      },
      startingResources: {
        food: 5,
        water: 4,
        energy: 5,
        seeds: 0
      }
    },
    {
      id: "leader",
      name: "Community Organizer",
      description: "You brought people together before and after the collapse. Leadership comes naturally, but resources are scarce.",
      startingStats: {
        leadership: 3,
        empathy: 3,
        survival: 2,
        science: 1,
        knowledge: 1,
        hope: 70
      },
      startingResources: {
        food: 4,
        water: 3,
        energy: 2,
        seeds: 1
      }
    }
  ],

  storyScenes: {
    opening: {
      id: "opening",
      title: "The Last Dawn",
      text: "You wake to the familiar orange haze filtering through cracked glass. Another day in what's left of the world. The Blight took everything - the forests, the crops, the rivers, and most of humanity. Scientists say the soil won't support life for another century. But in your backpack, you carry something they said was impossible: a handful of seeds that might still grow. The question isn't whether you can survive another day. It's whether there's any point in trying to save a dying world.",
      choices: [
        {
          text: "Search for other survivors. Hope is stronger together.",
          consequences: { hope: 10, energy: -1 },
          nextScene: "findSurvivors"
        },
        {
          text: "Focus on finding resources. Survival comes first.",
          consequences: { food: 1, hope: -5 },
          nextScene: "scavengeAlone"
        },
        {
          text: "Plant a seed here. Someone should witness if anything grows.",
          consequences: { seeds: -1, hope: 15, knowledge: 1, restorationProgress: 1 },
          nextScene: "firstPlanting",
          requirements: { seeds: 1 }
        }
      ]
    },

    findSurvivors: {
      id: "findSurvivors",
      title: "Voices in the Wasteland",
      text: "Following distant smoke, you discover a small camp. Three survivors huddle around a dying fire: Elena, a former teacher protecting two young children; Marcus, a mechanic who's kept their water purifier running; and Dr. Chen, a botanist who's been documenting the Blight. They eye you warily - trust is dangerous when resources are scarce. Elena steps forward: 'We have room for one more, but everyone contributes. What can you offer?'",
      choices: [
        {
          text: "Share your seeds and knowledge of restoration.",
          consequences: { seeds: -1, hope: 20, knowledge: 1 },
          relationships: { elena: 10, chen: 15 },
          nextScene: "joinCommunity"
        },
        {
          text: "Offer your survival skills and resources.",
          consequences: { food: -1, water: -1, hope: 5 },
          relationships: { marcus: 10, elena: 5 },
          nextScene: "joinCommunity"
        },
        {
          text: "Suggest they come with you to find a better location.",
          consequences: { hope: 5, energy: -2, leadership: 1 },
          nextScene: "leadGroup"
        }
      ]
    },

    scavengeAlone: {
      id: "scavengeAlone", 
      title: "The Solitary Path",
      text: "You spend days picking through the ruins of civilization. In a collapsed pharmacy, you find medical supplies. In a buried greenhouse, you discover a cache of preserved seeds. But the silence is deafening, and you realize you haven't heard another human voice in weeks. The loneliness gnaws at you, but you're alive. As you camp in an abandoned school, you find a child's drawing on the wall: a stick figure family under a bright yellow sun.",
      choices: [
        {
          text: "Leave a message for other survivors and continue searching.",
          consequences: { hope: 5, energy: -1, knowledge: 1 },
          nextScene: "messageFinder"
        },
        {
          text: "Set up a permanent base here and wait for others to find you.",
          consequences: { energy: 2, food: 1, hope: -10 },
          nextScene: "waitingBase"
        },
        {
          text: "Try to plant the seeds you've found in the school garden.",
          consequences: { seeds: -2, hope: 10, restorationProgress: 2 },
          nextScene: "schoolGarden",
          requirements: { seeds: 2 }
        }
      ]
    },

    firstPlanting: {
      id: "firstPlanting",
      title: "A Leap of Faith",
      text: "With trembling hands, you dig into the gray, lifeless soil. The earth feels cold and dead, but you plant the seed anyway. You water it with precious drops from your canteen and whisper a prayer to whatever gods might listen. Nothing happens for days. Then, impossibly, a tiny green shoot pushes through the poisoned ground. It's small, fragile, but it's alive. For the first time in months, you smile. Maybe, just maybe, there's still hope.",
      choices: [
        {
          text: "Guard the plant and tend to it carefully.",
          consequences: { hope: 10, energy: -2, restorationProgress: 2 },
          nextScene: "guardPlant"
        },
        {
          text: "Mark the location and search for more suitable soil.",
          consequences: { knowledge: 2, energy: -1 },
          nextScene: "findBetterSoil"
        },
        {
          text: "Share the news - others need to see this miracle.",
          consequences: { hope: 5, energy: -1 },
          nextScene: "shareDiscovery"
        }
      ]
    },

    joinCommunity: {
      id: "joinCommunity",
      title: "Among the Living",
      text: "The small community welcomes you with cautious warmth. Elena teaches the children with precious salvaged books. Marcus keeps the machines running with ingenuity and scrap metal. Dr. Chen shows you her notes - detailed observations of how the Blight spreads and, more importantly, where it seems to weaken. 'We've lost so much,' Chen says, 'but knowledge survives if we preserve it.' That night, sharing a meager meal by the fire, you feel something you'd almost forgotten: belonging.",
      choices: [
        {
          text: "Focus on helping with the children's education.",
          consequences: { hope: 15, empathy: 1 },
          relationships: { elena: 10 },
          nextScene: "teachChildren"
        },
        {
          text: "Work with Marcus to improve their water purification system.",
          consequences: { knowledge: 1, survival: 1, water: 2 },
          relationships: { marcus: 15 },
          nextScene: "improveWater"
        },
        {
          text: "Collaborate with Dr. Chen on restoration research.",
          consequences: { knowledge: 2, science: 1, restorationProgress: 1 },
          relationships: { chen: 20 },
          nextScene: "researchPartnership"
        }
      ]
    },

    leadGroup: {
      id: "leadGroup",
      title: "The Weight of Leadership",
      text: "Convincing the group to follow you proves harder than expected. Elena worries about the children's safety. Marcus questions your knowledge of safe routes. But Dr. Chen supports the idea - she's found references to an old research facility that might have survived intact. After heated discussion, they agree to a short expedition. As you lead them into the wasteland, you feel the weight of their lives in your hands.",
      choices: [
        {
          text: "Take the safest route, even if it's longer.",
          consequences: { hope: 10, energy: -3 },
          relationships: { elena: 15 },
          nextScene: "safeJourney"
        },
        {
          text: "Risk the direct path to save resources.",
          consequences: { energy: -1, hope: -5 },
          relationships: { marcus: 10 },
          nextScene: "riskyPath"
        },
        {
          text: "Let the group vote on which path to take.",
          consequences: { leadership: 1, hope: 5 },
          relationships: { elena: 5, marcus: 5, chen: 5 },
          nextScene: "democraticChoice"
        }
      ]
    },

    researchPartnership: {
      id: "researchPartnership",
      title: "The Science of Hope",
      text: "Working with Dr. Chen, you make a breakthrough. The Blight isn't just environmental damage - it's a cascading failure of soil microorganisms. But in areas where certain pre-Blight plants survived, the soil shows signs of recovery. Chen's eyes light up with the first excitement you've seen from anyone in months. 'We need to map these survivor zones,' she says. 'And we need more seeds - specific varieties that can rebuild the soil ecosystem.' It's ambitious, maybe impossible, but it's a plan.",
      choices: [
        {
          text: "Organize an expedition to map and collect samples from survivor zones.",
          consequences: { knowledge: 3, energy: -3, restorationProgress: 3, humanPopulation: -5 },
          nextScene: "surveyExpedition"
        },
        {
          text: "Focus on developing the seeds you have into a breeding program.",
          consequences: { seeds: 2, knowledge: 2, restorationProgress: 2 },
          nextScene: "seedProgram"
        },
        {
          text: "Try to contact other communities to share the research.",
          consequences: { hope: 20, knowledge: 1, humanPopulation: 10 },
          nextScene: "shareResearch"
        }
      ]
    },

    finalChoice: {
      id: "finalChoice",
      title: "The Last Seed",
      text: "After months of research and heartbreak, you've made an impossible discovery. A genetically modified seed from before the Blight - designed to restore soil ecosystems but never tested. It could heal the world, but using it requires all your remaining resources and the cooperation of every surviving community. Many will refuse. Some will die trying. But if it works... 'This is it,' Dr. Chen whispers, holding the seed. 'The choice that defines what's left of humanity.'",
      choices: [
        {
          text: "Use all resources to plant the seed and call for global cooperation.",
          consequences: { food: -5, water: -5, energy: -5, hope: -20, worldHealth: 30, restorationProgress: 10 },
          nextScene: "ending"
        },
        {
          text: "Keep the seed safe and build slowly with what you know works.",
          consequences: { hope: 10, restorationProgress: 3, humanPopulation: 10 },
          nextScene: "ending"
        },
        {
          text: "Give the seed to the children and let them decide the future.",
          consequences: { hope: 25, knowledge: -2, worldHealth: 10 },
          nextScene: "ending"
        }
      ]
    }
  },

  endingConditions: [
    {
      id: "extinction",
      name: "The Last Light Dies",
      description: "Hope faded completely. The last humans died alone in the wasteland. Yet even in darkness, the seeds you planted might yet grow for no one to see.",
      requirements: { hope: 0 }
    },
    {
      id: "survival",
      name: "Embers in the Dark",
      description: "A small community survives, preserving the memory of what was lost. It's not the rebirth you hoped for, but it's not the end. The children learn, grow, and carry forward the dream of green things growing.",
      requirements: { hope: 30, relationships: 2 }
    },
    {
      id: "restoration", 
      name: "Seeds of Tomorrow",
      description: "Against all odds, life returns to the wasteland. The long work of healing begins. It will take generations, but green shoots push through poisoned soil, and hope takes root alongside them.",
      requirements: { hope: 70, worldHealth: 20, restorationProgress: 5 }
    },
    {
      id: "rebirth",
      name: "The World Reborn", 
      description: "Through sacrifice, hope, and impossible determination, you've given Earth a second chance. Forests will grow again. Rivers will run clean. The children laugh as they plant gardens in soil that blooms with life.",
      requirements: { hope: 90, worldHealth: 40, restorationProgress: 8, knowledge: 6 }
    }
  ]
};

// Current game state
let currentGameState = JSON.parse(JSON.stringify(gameData.gameState));
let currentScene = 'opening';

// DOM elements
let characterCreationScreen, gameScreen, endingScreen;
let backgroundOptions, startGameBtn;
let worldHealthBar, worldHealthValue, humanPopulation, daysSurvived;
let hopeBar, hopeValue, healthBar, healthValue, sanityBar, sanityValue;
let foodValue, waterValue, energyValue, knowledgeValue, seedsValue;
let sceneTitle, storyText, choicesArea;
let restorationBar, restorationValue, relationshipsArea;

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
  initializeDOM();
  initializeGame();
});

function initializeDOM() {
  // Get screen elements
  characterCreationScreen = document.getElementById('characterCreation');
  gameScreen = document.getElementById('gameScreen');
  endingScreen = document.getElementById('endingScreen');
  
  // Get character creation elements
  backgroundOptions = document.getElementById('backgroundOptions');
  startGameBtn = document.getElementById('startGameBtn');
  
  // Get game UI elements
  worldHealthBar = document.getElementById('worldHealthBar');
  worldHealthValue = document.getElementById('worldHealthValue');
  humanPopulation = document.getElementById('humanPopulation');
  daysSurvived = document.getElementById('daysSurvived');
  
  hopeBar = document.getElementById('hopeBar');
  hopeValue = document.getElementById('hopeValue');
  healthBar = document.getElementById('healthBar');
  healthValue = document.getElementById('healthValue');
  sanityBar = document.getElementById('sanityBar');
  sanityValue = document.getElementById('sanityValue');
  
  foodValue = document.getElementById('foodValue');
  waterValue = document.getElementById('waterValue');
  energyValue = document.getElementById('energyValue');
  knowledgeValue = document.getElementById('knowledgeValue');
  seedsValue = document.getElementById('seedsValue');
  
  sceneTitle = document.getElementById('sceneTitle');
  storyText = document.getElementById('storyText');
  choicesArea = document.getElementById('choicesArea');
  
  restorationBar = document.getElementById('restorationBar');
  restorationValue = document.getElementById('restorationValue');
  relationshipsArea = document.getElementById('relationshipsArea');
  
  // Event listeners
  if (startGameBtn) {
    startGameBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      startGame();
    });
  }
  
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      restartGame();
    });
  }
}

function initializeGame() {
  showCharacterCreation();
}

function showCharacterCreation() {
  characterCreationScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
  endingScreen.classList.add('hidden');
  
  // Populate background options
  backgroundOptions.innerHTML = '';
  gameData.characterBackgrounds.forEach(background => {
    const card = createBackgroundCard(background);
    backgroundOptions.appendChild(card);
  });
}

function createBackgroundCard(background) {
  const card = document.createElement('div');
  card.className = 'background-card';
  card.dataset.backgroundId = background.id;
  
  card.innerHTML = `
    <h3>${background.name}</h3>
    <p class="description">${background.description}</p>
    <div class="starting-stats">
      <div class="stat-preview">
        <span>Hope</span>
        <span>${background.startingStats.hope}</span>
      </div>
      <div class="stat-preview">
        <span>Science</span>
        <span>${background.startingStats.science}</span>
      </div>
      <div class="stat-preview">
        <span>Leadership</span>
        <span>${background.startingStats.leadership}</span>
      </div>
      <div class="stat-preview">
        <span>Seeds</span>
        <span>${background.startingResources.seeds}</span>
      </div>
    </div>
  `;
  
  card.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    selectBackground(background.id);
  });
  
  return card;
}

function selectBackground(backgroundId) {
  // Remove previous selection
  document.querySelectorAll('.background-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Select new background
  const selectedCard = document.querySelector(`[data-background-id="${backgroundId}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
  
  currentGameState.selectedBackground = backgroundId;
  startGameBtn.disabled = false;
}

function startGame() {
  if (!currentGameState.selectedBackground) return;
  
  // Apply background stats
  const background = gameData.characterBackgrounds.find(b => b.id === currentGameState.selectedBackground);
  if (background) {
    currentGameState.skills = { ...background.startingStats };
    currentGameState.playerHope = background.startingStats.hope;
    currentGameState.resources = { ...currentGameState.resources, ...background.startingResources };
  }
  
  // Show game screen
  characterCreationScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  
  // Start first scene
  displayScene(currentScene);
  updateUI();
}

function displayScene(sceneId) {
  const scene = gameData.storyScenes[sceneId];
  if (!scene) {
    // If no scene found, try to generate ending or procedural content
    generateProceduralScene();
    return;
  }
  
  currentScene = sceneId;
  
  // Update story content
  sceneTitle.textContent = scene.title;
  storyText.textContent = scene.text;
  
  // Clear and populate choices
  choicesArea.innerHTML = '';
  scene.choices.forEach((choice, index) => {
    const choiceBtn = createChoiceButton(choice, index);
    choicesArea.appendChild(choiceBtn);
  });
  
  // Add fade-in animation
  const storyArea = document.querySelector('.story-area');
  if (storyArea) {
    storyArea.classList.add('fade-in');
    setTimeout(() => {
      storyArea.classList.remove('fade-in');
    }, 500);
  }
}

function createChoiceButton(choice, index) {
  const btn = document.createElement('button');
  btn.className = 'choice-btn';
  btn.textContent = choice.text;
  
  // Check if choice is available
  if (choice.requirements) {
    const canChoose = checkRequirements(choice.requirements);
    if (!canChoose) {
      btn.disabled = true;
      btn.innerHTML += '<div class="choice-requirements">Requires: ' + formatRequirements(choice.requirements) + '</div>';
    }
  }
  
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    makeChoice(choice);
  });
  
  return btn;
}

function checkRequirements(requirements) {
  for (const [key, value] of Object.entries(requirements)) {
    if (currentGameState.resources[key] < value) {
      return false;
    }
  }
  return true;
}

function formatRequirements(requirements) {
  return Object.entries(requirements)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

function makeChoice(choice) {
  // Record choice
  currentGameState.choicesMade.push({
    scene: currentScene,
    choice: choice.text,
    day: currentGameState.daysSurvived
  });
  
  // Apply consequences
  applyConsequences(choice.consequences);
  if (choice.relationships) {
    applyRelationshipChanges(choice.relationships);
  }
  
  // Advance time
  currentGameState.daysSurvived++;
  
  // Natural degradation over time
  currentGameState.humanPopulation = Math.max(0, currentGameState.humanPopulation - Math.floor(Math.random() * 3));
  currentGameState.worldHealth = Math.max(0, currentGameState.worldHealth - 0.1);
  
  // Update UI
  updateUI();
  
  // Check for ending conditions first
  const ending = checkEndingConditions();
  if (ending) {
    setTimeout(() => showEnding(ending), 1000);
    return;
  }
  
  // Continue to next scene
  const nextScene = choice.nextScene;
  if (nextScene && nextScene !== 'ending') {
    if (gameData.storyScenes[nextScene]) {
      setTimeout(() => displayScene(nextScene), 500);
    } else {
      setTimeout(() => generateProceduralScene(), 500);
    }
  } else if (nextScene === 'ending' || currentGameState.daysSurvived >= 15) {
    // Force ending after certain number of days or if choice leads to ending
    setTimeout(() => {
      const finalEnding = checkEndingConditions();
      showEnding(finalEnding || gameData.endingConditions[1]);
    }, 1000);
  } else {
    // Generate procedural content or continue story
    setTimeout(() => generateNextStoryContent(), 500);
  }
}

function applyConsequences(consequences) {
  for (const [key, value] of Object.entries(consequences)) {
    if (key === 'hope') {
      currentGameState.playerHope = Math.max(0, Math.min(100, currentGameState.playerHope + value));
      if (currentGameState.playerHope <= 10) {
        document.querySelector('.character-panel').classList.add('hope-critical');
      } else {
        document.querySelector('.character-panel').classList.remove('hope-critical');
      }
    } else if (currentGameState.resources[key] !== undefined) {
      currentGameState.resources[key] = Math.max(0, currentGameState.resources[key] + value);
    } else if (currentGameState.skills[key] !== undefined) {
      currentGameState.skills[key] = Math.max(1, currentGameState.skills[key] + value);
    } else if (key === 'worldHealth') {
      currentGameState.worldHealth = Math.max(0, Math.min(100, currentGameState.worldHealth + value));
    } else if (key === 'humanPopulation') {
      currentGameState.humanPopulation = Math.max(0, currentGameState.humanPopulation + value);
    } else if (key === 'restorationProgress') {
      currentGameState.restorationProgress = Math.max(0, currentGameState.restorationProgress + value);
    }
  }
}

function applyRelationshipChanges(relationships) {
  for (const [character, change] of Object.entries(relationships)) {
    currentGameState.relationships[character] = (currentGameState.relationships[character] || 0) + change;
  }
}

function updateUI() {
  // World status
  if (worldHealthBar) worldHealthBar.style.width = `${currentGameState.worldHealth}%`;
  if (worldHealthValue) worldHealthValue.textContent = `${Math.round(currentGameState.worldHealth)}%`;
  if (humanPopulation) humanPopulation.textContent = currentGameState.humanPopulation.toLocaleString();
  if (daysSurvived) daysSurvived.textContent = currentGameState.daysSurvived;
  
  // Character stats
  if (hopeBar) hopeBar.style.width = `${currentGameState.playerHope}%`;
  if (hopeValue) hopeValue.textContent = currentGameState.playerHope;
  if (healthBar) healthBar.style.width = `${currentGameState.playerHealth}%`;
  if (healthValue) healthValue.textContent = currentGameState.playerHealth;
  if (sanityBar) sanityBar.style.width = `${currentGameState.playerSanity}%`;
  if (sanityValue) sanityValue.textContent = currentGameState.playerSanity;
  
  // Resources
  if (foodValue) foodValue.textContent = currentGameState.resources.food;
  if (waterValue) waterValue.textContent = currentGameState.resources.water;
  if (energyValue) energyValue.textContent = currentGameState.resources.energy;
  if (knowledgeValue) knowledgeValue.textContent = currentGameState.resources.knowledge;
  if (seedsValue) seedsValue.textContent = currentGameState.resources.seeds;
  
  // Restoration progress
  if (restorationBar) restorationBar.style.width = `${Math.min(100, currentGameState.restorationProgress * 10)}%`;
  if (restorationValue) restorationValue.textContent = `${Math.min(100, currentGameState.restorationProgress * 10)}%`;
  
  // Relationships
  updateRelationships();
}

function updateRelationships() {
  if (!relationshipsArea) return;
  
  relationshipsArea.innerHTML = '';
  
  if (Object.keys(currentGameState.relationships).length === 0) {
    relationshipsArea.innerHTML = '<span class="no-relationships">No relationships yet</span>';
    return;
  }
  
  for (const [character, level] of Object.entries(currentGameState.relationships)) {
    const relationshipEl = document.createElement('div');
    relationshipEl.className = 'relationship';
    relationshipEl.innerHTML = `
      <span class="relationship-name">${character}</span>
      <span class="relationship-level">${level > 0 ? '+' : ''}${level}</span>
    `;
    relationshipsArea.appendChild(relationshipEl);
  }
}

function generateNextStoryContent() {
  // Generate content based on current game state and day
  if (currentGameState.daysSurvived > 8 && currentGameState.restorationProgress >= 2) {
    displayScene('finalChoice');
  } else {
    generateProceduralScene();
  }
}

function generateProceduralScene() {
  // Create procedural scenes based on game state
  const scenes = [
    {
      title: "A Moment of Reflection",
      text: `Day ${currentGameState.daysSurvived} in this wasteland. You've seen ${currentGameState.restorationProgress > 0 ? 'hope take root in the poisoned soil' : 'nothing but death and decay'}. ${currentGameState.playerHope > 50 ? 'Despite everything, you still believe things can get better.' : 'You wonder if struggling is worth it anymore.'}`,
      choices: [
        {
          text: "Continue the fight for tomorrow.",
          consequences: { hope: 10, energy: -1 }
        },
        {
          text: "Rest and gather strength.",
          consequences: { energy: 2, hope: -5 }
        },
        {
          text: "Search for more survivors.",
          consequences: { energy: -2, hope: 5, humanPopulation: 2 }
        }
      ]
    },
    {
      title: "The Weight of Survival",
      text: `Resources are running low. The constant struggle for basic necessities weighs heavily on your mind. ${Object.keys(currentGameState.relationships).length > 0 ? 'At least you\'re not alone in this fight.' : 'The loneliness is almost unbearable.'} Every decision could mean the difference between life and death.`,
      choices: [
        {
          text: "Ration carefully and search for supplies.",
          consequences: { food: 1, water: 1, energy: -2 }
        },
        {
          text: "Take risks to find better resources.",
          consequences: { food: 2, energy: -3, hope: -5 }
        },
        {
          text: "Focus on restoration work instead of just survival.",
          consequences: { hope: 15, restorationProgress: 1, energy: -2 },
          requirements: { seeds: 1 }
        }
      ]
    }
  ];
  
  const scene = scenes[Math.floor(Math.random() * scenes.length)];
  sceneTitle.textContent = scene.title;
  storyText.textContent = scene.text;
  
  choicesArea.innerHTML = '';
  scene.choices.forEach(choice => {
    const btn = createChoiceButton(choice, 0);
    choicesArea.appendChild(btn);
  });
}

function checkEndingConditions() {
  // Check in priority order
  if (currentGameState.playerHope <= 0 || currentGameState.humanPopulation <= 0) {
    return gameData.endingConditions.find(e => e.id === 'extinction');
  }
  
  // Check other endings in reverse order (best first)
  for (let i = gameData.endingConditions.length - 1; i >= 0; i--) {
    const ending = gameData.endingConditions[i];
    if (ending.id === 'extinction') continue;
    
    let meetsRequirements = true;
    for (const [key, value] of Object.entries(ending.requirements)) {
      if (key === 'relationships') {
        if (Object.keys(currentGameState.relationships).length < value) {
          meetsRequirements = false;
          break;
        }
      } else if (currentGameState[key] < value) {
        meetsRequirements = false;
        break;
      }
    }
    
    if (meetsRequirements) {
      return ending;
    }
  }
  
  return null;
}

function showEnding(ending) {
  gameScreen.classList.add('hidden');
  endingScreen.classList.remove('hidden');
  
  document.getElementById('endingTitle').textContent = ending.name;
  document.getElementById('endingDescription').textContent = ending.description;
  
  // Show final stats
  const endingStats = document.getElementById('endingStats');
  endingStats.innerHTML = `
    <div class="final-stat">
      <span class="final-stat-label">Days Survived</span>
      <span class="final-stat-value">${currentGameState.daysSurvived}</span>
    </div>
    <div class="final-stat">
      <span class="final-stat-label">Final Hope</span>
      <span class="final-stat-value">${currentGameState.playerHope}%</span>
    </div>
    <div class="final-stat">
      <span class="final-stat-label">World Health</span>
      <span class="final-stat-value">${Math.round(currentGameState.worldHealth)}%</span>
    </div>
    <div class="final-stat">
      <span class="final-stat-label">Restoration Progress</span>
      <span class="final-stat-value">${currentGameState.restorationProgress}</span>
    </div>
    <div class="final-stat">
      <span class="final-stat-label">Relationships</span>
      <span class="final-stat-value">${Object.keys(currentGameState.relationships).length}</span>
    </div>
  `;
  
  // Show choice history
  const choiceHistory = document.getElementById('choiceHistory');
  choiceHistory.innerHTML = '';
  currentGameState.choicesMade.forEach((choice, index) => {
    const choiceEl = document.createElement('div');
    choiceEl.className = 'choice-item';
    choiceEl.innerHTML = `
      <span class="choice-number">Day ${choice.day}:</span>
      <div class="choice-text">${choice.choice}</div>
    `;
    choiceHistory.appendChild(choiceEl);
  });
}

function restartGame() {
  currentGameState = JSON.parse(JSON.stringify(gameData.gameState));
  currentScene = 'opening';
  const characterPanel = document.querySelector('.character-panel');
  if (characterPanel) {
    characterPanel.classList.remove('hope-critical');
  }
  showCharacterCreation();
}