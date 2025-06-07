# ConfettiHeadless

A headless component for creating customizable confetti animations with extensive flexibility for developers. Confetti animations are used to celebrate achievements, special events, or to add a festive touch to user interactions.

## Usage

```jsx
import { ConfettiHeadless } from 'pulseui';
import { useState } from 'react';

function MyConfetti() {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <ConfettiHeadless.Root
      active={isActive}
      duration={5000}
      particleCount={100}
      gravity={0.9}
      wind={0.1}
      colors={['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3']}
      shapes={['square', 'circle', 'rectangle', 'triangle']}
      recycle={false}
      useCanvas={true}
      onComplete={() => setIsActive(false)}
    >
      <ConfettiHeadless.Container>
        <button
          onClick={() => setIsActive(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Celebrate!
        </button>
        
        <ConfettiHeadless.Canvas />
      </ConfettiHeadless.Container>
    </ConfettiHeadless.Root>
  );
}
```

## Creating Different Confetti Variants

```jsx
import { ConfettiHeadless } from 'pulseui';
import { useState } from 'react';

function ConfettiExample() {
  const [activeConfetti, setActiveConfetti] = useState(null);
  
  const confettiVariants = {
    basic: {
      particleCount: 100,
      colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'],
      shapes: ['square', 'circle', 'rectangle', 'triangle'],
      gravity: 0.9,
      wind: 0.1,
      recycle: false,
    },
    birthday: {
      particleCount: 150,
      colors: ['#ff9800', '#ffc107', '#ffeb3b', '#cddc39', '#8bc34a', '#4caf50'],
      shapes: ['circle', 'rectangle'],
      gravity: 0.7,
      wind: 0.2,
      recycle: false,
    },
    celebration: {
      particleCount: 200,
      colors: ['#f44336', '#ffeb3b', '#4caf50', '#2196f3'],
      shapes: ['square', 'triangle'],
      gravity: 0.8,
      wind: 0.05,
      recycle: false,
    },
    rain: {
      particleCount: 100,
      colors: ['#2196f3', '#03a9f4', '#00bcd4', '#b3e5fc'],
      shapes: ['rectangle'],
      gravity: 1.2,
      wind: 0.05,
      recycle: true,
    },
  };
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3>Choose a Confetti Style</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setActiveConfetti('basic')}>Basic</button>
          <button onClick={() => setActiveConfetti('birthday')}>Birthday</button>
          <button onClick={() => setActiveConfetti('celebration')}>Celebration</button>
          <button onClick={() => setActiveConfetti('rain')}>Rain</button>
          <button onClick={() => setActiveConfetti(null)}>Stop</button>
        </div>
      </div>
      
      <ConfettiHeadless.Root
        active={activeConfetti !== null}
        duration={activeConfetti === 'rain' ? 0 : 5000}
        particleCount={activeConfetti ? confettiVariants[activeConfetti].particleCount : 100}
        gravity={activeConfetti ? confettiVariants[activeConfetti].gravity : 0.9}
        wind={activeConfetti ? confettiVariants[activeConfetti].wind : 0.1}
        colors={activeConfetti ? confettiVariants[activeConfetti].colors : []}
        shapes={activeConfetti ? confettiVariants[activeConfetti].shapes : []}
        recycle={activeConfetti ? confettiVariants[activeConfetti].recycle : false}
        useCanvas={true}
        onComplete={() => setActiveConfetti(null)}
      >
        <ConfettiHeadless.Container>
          <div
            style={{
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <h2>Confetti Demo</h2>
            <p>Click one of the buttons above to start the confetti animation!</p>
            
            {activeConfetti && (
              <div style={{ marginTop: '16px' }}>
                <p>
                  <strong>Active Style:</strong> {activeConfetti}
                </p>
              </div>
            )}
          </div>
          
          <ConfettiHeadless.Canvas />
        </ConfettiHeadless.Container>
      </ConfettiHeadless.Root>
    </div>
  );
}
```

## Creating a Celebration Modal

```jsx
import { ConfettiHeadless } from 'pulseui';
import { useState } from 'react';

function CelebrationModal({ isOpen, onClose, title, message }) {
  return (
    <>
      {isOpen && (
        <ConfettiHeadless.Root
          active={isOpen}
          duration={5000}
          particleCount={150}
          gravity={0.8}
          wind={0.1}
          colors={['#f44336', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0']}
          shapes={['square', 'circle', 'rectangle', 'triangle']}
          recycle={false}
          useCanvas={true}
        >
          <ConfettiHeadless.Container>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '24px',
                  maxWidth: '400px',
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                }}
              >
                <h2 style={{ marginTop: 0, color: '#4caf50' }}>{title}</h2>
                <p>{message}</p>
                <div style={{ marginTop: '24px' }}>
                  <button
                    onClick={onClose}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '16px',
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
            
            <ConfettiHeadless.Canvas />
          </ConfettiHeadless.Container>
        </ConfettiHeadless.Root>
      )}
    </>
  );
}

// Usage
function App() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Celebration Modal Example</h1>
      
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '12px 24px',
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        Complete Task
      </button>
      
      <CelebrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Congratulations!"
        message="You've successfully completed the task. Great job!"
      />
    </div>
  );
}
```

## Creating a Reward Animation

```jsx
import { ConfettiHeadless } from 'pulseui';
import { useState, useEffect } from 'react';

function RewardAnimation({ points, onComplete }) {
  const [active, setActive] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  
  useEffect(() => {
    // Show points after a short delay
    const pointsTimer = setTimeout(() => {
      setShowPoints(true);
    }, 500);
    
    // Hide everything after animation completes
    const completeTimer = setTimeout(() => {
      setActive(false);
      if (onComplete) onComplete();
    }, 4000);
    
    return () => {
      clearTimeout(pointsTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);
  
  return (
    <ConfettiHeadless.Root
      active={active}
      duration={4000}
      particleCount={100}
      gravity={0.7}
      wind={0.1}
      colors={['#ffc107', '#ffeb3b', '#ff9800']}
      shapes={['circle', 'square']}
      recycle={false}
      useCanvas={true}
    >
      <ConfettiHeadless.Container>
        {showPoints && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1001,
              textAlign: 'center',
              animation: 'reward-points 1s ease-out',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#ffc107',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              +{points}
            </div>
            <div
              style={{
                fontSize: '24px',
                color: 'white',
                textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
              }}
            >
              POINTS
            </div>
          </div>
        )}
        
        <ConfettiHeadless.Canvas />
      </ConfettiHeadless.Container>
    </ConfettiHeadless.Root>
  );
}

// Usage
function App() {
  const [showReward, setShowReward] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  
  const handleCompleteTask = () => {
    const pointsEarned = Math.floor(Math.random() * 50) + 10;
    setShowReward(true);
    setTotalPoints(prev => prev + pointsEarned);
    
    // Add points to the total
    return pointsEarned;
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Reward Animation Example</h1>
      
      <div style={{ marginBottom: '24px' }}>
        <h3>Total Points: {totalPoints}</h3>
      </div>
      
      <button
        onClick={() => {
          const points = handleCompleteTask();
          setShowReward({ points });
        }}
        style={{
          padding: '12px 24px',
          backgroundColor: '#ff9800',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
        disabled={showReward}
      >
        Complete Task
      </button>
      
      {showReward && (
        <RewardAnimation
          points={showReward.points}
          onComplete={() => setShowReward(false)}
        />
      )}
    </div>
  );
}
```

## Creating a Game Win Celebration

```jsx
import { ConfettiHeadless } from 'pulseui';
import { useState } from 'react';

function GameWinCelebration({ isOpen, onClose, score, level }) {
  return (
    <>
      {isOpen && (
        <ConfettiHeadless.Root
          active={isOpen}
          duration={6000}
          particleCount={200}
          gravity={0.7}
          wind={0.1}
          colors={['#f44336', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#ff9800']}
          shapes={['square', 'circle', 'rectangle', 'triangle']}
          recycle={false}
          useCanvas={true}
        >
          <ConfettiHeadless.Container>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '32px',
                  maxWidth: '500px',
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                }}
              >
                <h1 style={{ marginTop: 0, color: '#ff9800', fontSize: '36px' }}>Level Complete!</h1>
                
                <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    <strong>Score:</strong> {score}
                  </div>
                  <div style={{ fontSize: '20px' }}>
                    <strong>Level:</strong> {level}
                  </div>
                </div>
                
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <button
                    onClick={onClose}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    Next Level
                  </button>
                  
                  <button
                    onClick={onClose}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'transparent',
                      color: '#333',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '16px',
                    }}
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
            
            <ConfettiHeadless.Canvas />
          </ConfettiHeadless.Container>
        </ConfettiHeadless.Root>
      )}
    </>
  );
}

// Usage
function App() {
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    showWinScreen: false,
  });
  
  const handleWinLevel = () => {
    // Simulate winning a level
    const newScore = gameState.score + Math.floor(Math.random() * 500) + 100;
    
    setGameState({
      score: newScore,
      level: gameState.level + 1,
      showWinScreen: true,
    });
  };
  
  const handleCloseWinScreen = () => {
    setGameState({
      ...gameState,
      showWinScreen: false,
    });
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Game Win Celebration Example</h1>
      
      <div style={{ marginBottom: '24px' }}>
        <h3>Current Game Stats</h3>
        <div>Score: {gameState.score}</div>
        <div>Level: {gameState.level}</div>
      </div>
      
      <button
        onClick={handleWinLevel}
        style={{
          padding: '12px 24px',
          backgroundColor: '#673ab7',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
        disabled={gameState.showWinScreen}
      >
        Win Level
      </button>
      
      <GameWinCelebration
        isOpen={gameState.showWinScreen}
        onClose={handleCloseWinScreen}
        score={gameState.score}
        level={gameState.level}
      />
    </div>
  );
}
```

## API

### ConfettiHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `boolean` | `false` | Whether the confetti is active |
| `duration` | `number` | `5000` | Duration of the confetti animation in milliseconds |
| `particleCount` | `number` | `100` | Number of particles to show |
| `gravity` | `number` | `0.9` | Gravity factor (affects falling speed) |
| `wind` | `number` | `0.1` | Wind factor (affects horizontal movement) |
| `colors` | `string[]` | `['#f44336', '#e91e63', ...]` | Colors to use for the particles |
| `shapes` | `Array<'square' \| 'circle' \| 'rectangle' \| 'triangle'>` | `['square', 'circle', 'rectangle', 'triangle']` | Shapes to use for the particles |
| `recycle` | `boolean` | `true` | Whether to recycle particles when they go off screen |
| `stopAfterInitial` | `boolean` | `false` | Whether to stop creating new particles after the initial burst |
| `useCanvas` | `boolean` | `true` | Whether to use a canvas for rendering (better performance) |
| `autoStart` | `boolean` | `false` | Whether to start the animation automatically |
| `onComplete` | `() => void` | - | Callback when the animation completes |

### Other Components

- `ConfettiHeadless.Container`: Container for the confetti
- `ConfettiHeadless.Canvas`: Canvas element for rendering confetti (recommended for performance)
- `ConfettiHeadless.Particles`: Container for DOM-based particles (alternative to Canvas)
- `ConfettiHeadless.Particle`: Individual particle element (used by Particles)
- `ConfettiHeadless.Trigger`: Button to trigger the confetti animation

### useConfetti Hook

For even more control, you can use the `useConfetti` hook directly:

```jsx
import { useConfetti } from 'pulseui';

function MyCustomConfetti() {
  const {
    active,
    setActive,
    start,
    stop,
    reset,
    particles,
    getContainerProps,
    getCanvasProps,
    canvasRef,
  } = useConfetti({
    active: false,
    duration: 5000,
    particleCount: 100,
    gravity: 0.9,
    wind: 0.1,
    colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'],
    shapes: ['square', 'circle', 'rectangle', 'triangle'],
    recycle: true,
    useCanvas: true,
    autoStart: false,
    onComplete: () => console.log('Confetti animation complete!'),
  });
  
  // Custom implementation
}
```

## Accessibility

The Confetti component follows accessibility best practices:

- The confetti container has `role="presentation"` to indicate it's a decorative element
- The confetti has `aria-hidden="true"` to hide it from screen readers
