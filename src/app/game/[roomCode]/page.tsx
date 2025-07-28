'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card as UICard } from '@/components/ui/card' // Assuming Shadcn/UI card for player panels
import { Home } from 'lucide-react'
import Link from 'next/link'
import Loading from "@/components/Loading" // Your loading component
import { Card } from "@/components/Card" // Your custom Card component for SVG cards

const BACKEND_URL = 'https://bluffy-game-backend.tentaciouspersona-01c.workers.dev' // Local development URL

// Type definitions from backend (simplified for frontend)
type Phase = 'WAITING' | 'PLAYING' | 'ENDED'
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'
type CardType = string // e.g., 'AH'

interface Player {
  name: string
  orderIndex: number
  hand: CardType[]
  passesUsed: number
}

interface GameState {
  phase: Phase
  playerCount: number
  players: Player[]
  currentPlayerIndex: number
  declaredRank: Rank | null
  roundPile: any[] // Simplified
  discardPile: CardType[]
  passesCounter: number
  roomCode: string
  revealedCards?: CardType[] // New: Assume backend adds this on challenge resolution
  previousPlayer?: string // New: Assume backend adds this for who was challenged
}

const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

export default function Game() {
  const router = useRouter()
  const { roomCode } = useParams() as { roomCode: string }
  const [playerName, setPlayerName] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCards, setSelectedCards] = useState<CardType[]>([])
  const [declaredRank, setDeclaredRank] = useState<Rank | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [revealedCards, setRevealedCards] = useState<CardType[]>([]) // For displaying challenge reveals

  // Fetch player name from sessionStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedPlayerName = sessionStorage.getItem('playerName')
        setPlayerName(storedPlayerName)
      }
    } catch (error) {
      console.error('Error accessing sessionStorage for playerName:', error)
      toast.error('Failed to load player name from storage.')
    }
  }, [])

  // Polling for game state every 3 seconds (stop on ENDED)
  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/game/state/${roomCode}`)
        const state: GameState = response.data
        setGameState(state)
        setIsLoading(false)

        // Store only current player's cards in sessionStorage
        if (playerName) {
          const currentPlayer = state.players.find(p => p.name === playerName)
          if (currentPlayer && state.phase === 'PLAYING') {
            sessionStorage.setItem('myHand', JSON.stringify(currentPlayer.hand))
          }
        }

        // Handle room full
        if (state.phase === 'WAITING' && state.players.length === state.playerCount) {
          toast.info('Room is full! Game starting soon...')
        }

        // Handle game end
        if (state.phase === 'ENDED') {
          const winner = state.players.find(p => p.hand.length === 0)?.name
          toast.success(`Game over! Winner: ${winner || 'Unknown'}`)
          sessionStorage.removeItem('myHand')
        }

        // Handle challenge reveal (if backend provides revealedCards)
        if (state.revealedCards && state.revealedCards.length > 0 && !revealedCards.length) {
          setRevealedCards(state.revealedCards)
          toast.warning(`Challenge by ${state.previousPlayer || 'someone'}! Revealed cards: ${state.revealedCards.join(', ')}`)
          // Clear after display (e.g., after 5s)
          setTimeout(() => setRevealedCards([]), 5000)
        }
      } catch (error) {
        console.error('Error fetching game state:', error)
        toast.error('Failed to load game state.')
        setGameState(null)
      }
    }

    if (roomCode && playerName && gameState?.phase !== 'ENDED') {
      fetchState() // Initial fetch
      const interval = setInterval(fetchState, 3000)
      return () => clearInterval(interval)
    }
  }, [roomCode, playerName, gameState?.phase, revealedCards])

  // Watch for phase changes to 'PLAYING'
  useEffect(() => {
    if (gameState?.phase === 'PLAYING') {
      toast.info('Game has started! Your turn will be highlighted when ready.')
      try {
        const currentPlayer = gameState.players.find(p => p.name === playerName)
        if (currentPlayer) {
          sessionStorage.setItem('myHand', JSON.stringify(currentPlayer.hand))
        }
      } catch (error) {
        console.error('Error refreshing hand on phase change:', error)
      }
    }
  }, [gameState?.phase, playerName])

  // Load current player's hand from sessionStorage
  let myHand: CardType[] = []
  try {
    myHand = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('myHand') || '[]') : []
  } catch (error) {
    console.error('Error parsing myHand from sessionStorage:', error)
    toast.error('Failed to load your hand.')
  }

  // Determine player count from roomCode length
  const playerCount = Math.min(Math.max(roomCode?.length || 4, 4), 6)

  // Check if it's my turn
  const currentPlayer = gameState?.players.find(p => p.name === playerName)
  const isMyTurn = gameState?.currentPlayerIndex === currentPlayer?.orderIndex

  // Handle card selection (toggle, max 4, only on my turn)
  const toggleCard = (card: CardType) => {
    if (!isMyTurn) {
      toast.info('Not your turn yet!')
      return
    }
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card))
    } else if (selectedCards.length < 4) {
      setSelectedCards([...selectedCards, card])
    } else {
      toast.warning('You can select up to 4 cards only.')
    }
  }

  // Submit action to backend
  const submitAction = async (type: 'PLAY' | 'PASS' | 'CHALLENGE') => {
    if (!isMyTurn || !gameState || !playerName) {
      return
    }
    setIsSubmitting(true)

    let actionData: any = { type }
    if (type === 'PLAY') {
      const quantity = selectedCards.length
      if (quantity < 1 || quantity > 4) {
        toast.error('Select 1-4 cards to play.')
        setIsSubmitting(false)
        return
      }
      if (!declaredRank) {
        toast.error('Select a rank to declare/bluff.')
        setIsSubmitting(false)
        return
      }
      if (gameState?.declaredRank && declaredRank !== gameState.declaredRank) {
        toast.error('Rank must match the current declared rank for this round.')
        setIsSubmitting(false)
        return
      }
      actionData = { type, cards: selectedCards, declaredQuantity: quantity, declaredRank }
    }

    try {
      await axios.post(`${BACKEND_URL}/api/game/action`, {
        roomCode,
        playerName,
        action: actionData
      })
      toast.success(`${type} action submitted!`)
      // Reset selections
      setSelectedCards([])
      setDeclaredRank(null)
    } catch (error) {
      console.error('Error submitting action:', error)
      toast.error('Failed to submit action.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Start game (if host)
  const startGame = async () => {
    if (gameState?.phase !== 'WAITING' || gameState.players.length !== playerCount || currentPlayer?.orderIndex !== 0) return
    try {
      await axios.post(`${BACKEND_URL}/api/game/start`, { roomCode })
      toast.info('Game started!')
    } catch (error) {
      console.error('Error starting game:', error)
      toast.error('Failed to start game.')
    }
  }

  // Render player panels
  const renderPlayers = () => {
    if (!gameState) return null

    let positions: { top: string; left: string }[] = []
    if (playerCount === 4) {
      positions = [
        { top: '10%', left: '50%' },
        { top: '50%', left: '10%' },
        { top: '50%', left: '90%' },
        { top: '90%', left: '50%' }
      ]
    } else if (playerCount === 5) {
      positions = [
        { top: '10%', left: '50%' },
        { top: '30%', left: '20%' },
        { top: '30%', left: '80%' },
        { top: '70%', left: '20%' },
        { top: '70%', left: '80%' }
      ]
    } else {
      positions = [
        { top: '10%', left: '50%' },
        { top: '30%', left: '20%' },
        { top: '30%', left: '80%' },
        { top: '70%', left: '10%' },
        { top: '70%', left: '50%' },
        { top: '70%', left: '90%' }
      ]
    }

    const sortedPlayers = [...gameState.players].sort((a, b) => a.orderIndex - b.orderIndex)
    const selfIndex = sortedPlayers.findIndex(p => p.name === playerName)
    const rotatedPlayers = selfIndex !== -1 
      ? [...sortedPlayers.slice(selfIndex + 1), ...sortedPlayers.slice(0, selfIndex + 1)]
      : sortedPlayers

    return rotatedPlayers.map((player, idx) => (
      <UICard
        key={player.name}
        className={`absolute p-4 bg-gray-800/80 border-gray-600 rounded-xl text-white text-center ${player.name === playerName ? 'border-blue-500' : ''} ${gameState.currentPlayerIndex === player.orderIndex ? 'ring-2 ring-blue-400' : ''}`}
        style={{ top: positions[idx]?.top, left: positions[idx]?.left, transform: 'translate(-50%, -50%)' }}
      >
        <p className="font-bold">{player.name} {player.name === playerName ? '(You)' : ''}</p>
        <p>Hand: {player.hand.length} cards</p>
        <p>Passes Used: {player.passesUsed}/4</p>
      </UICard>
    ))
  }

  if (isLoading || !gameState) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black p-4 relative overflow-hidden">
      {/* Home Button */}
      <Link href="/">
        <Button className="absolute top-4 left-4" variant="outline">
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </Link>

      <h2 className="text-4xl font-bold text-white text-center mb-8" style={{ fontFamily: "var(--font-spacemono)" }}>
        Bluffy - Room {roomCode} ({gameState.phase})
      </h2>

      {/* Game Table */}
      <div className="relative w-full h-[70vh] max-w-6xl mx-auto">
        {/* Middle Display: Joker + Piles + Revealed Cards */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <Card src="/cards/joker.svg" alt="Joker" height={150} width={100} />
          <p className="mt-2 text-white">Round Pile: {gameState.roundPile.length}</p>
          <p>Discard Pile: {gameState.discardPile.length}</p>
          <p className='bg-green-400'>Declared Rank: {gameState.declaredRank || 'None'}</p>
          <p>Passes: {gameState.passesCounter}</p>
          {/* Display revealed cards on challenge */}
          {revealedCards.length > 0 && (
            <div className="mt-4">
              <p className="text-red-400 font-bold">Revealed Cards:</p>
              <div className="flex justify-center gap-2">
                {revealedCards.map((card) => (
                  <Card key={card} src={`/cards/${card.toLowerCase()}.svg`} alt={card} height={80} width={50} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Player Positions */}
        {renderPlayers()}
      </div>

      {/* My Hand (only shown if PLAYING) */}
      {gameState.phase === 'PLAYING' && (
        <div className="mt-8">
          <h3 className="text-2xl text-white mb-4">Your Hand ({myHand.length} cards)</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {myHand.map((card) => {
              const isSelected = selectedCards.includes(card);
              return (
                <motion.div
                  key={card}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    opacity: isSelected ? 1 : 0.7, // Reduce opacity for non-selected
                    border: isSelected ? '2px solid blue' : 'none', // Blue border for selected
                    borderRadius: '8px', // Optional rounding
                    padding: isSelected ? '4px' : '0', // Slight padding for border visibility
                  }}
                >
                  <Card
                    src={`/cards/${card.toLowerCase()}.svg`}
                    alt={card}
                    height={120}
                    width={80}
                    selected={isSelected} // Pass to Card for any internal styling
                    onClick={() => toggleCard(card)}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions (only if my turn and PLAYING) */}
      {isMyTurn && gameState.phase === 'PLAYING' && (
  <div className="mt-8 flex flex-col items-center gap-4">
    {/* Selected Cards Count Display */}
    <p className="text-white font-bold">Selected: {selectedCards.length} cards (Max 4)</p>

    {/* Declared Rank Display */}
    <p className="text-white font-bold">Declared Rank: {declaredRank || '?'}</p>

    <div className="flex gap-4 items-center  bg-black/40 px-6 py-3 rounded">
      {/* Rank selection is always visible on your turn */}
      <Select
        disabled={isSubmitting}
        value={declaredRank ?? ''}
        onValueChange={(val) => setDeclaredRank(val as Rank)}
      >
        <SelectTrigger className="bg-gray-800 text-white border border-gray-500 rounded">
          <SelectValue placeholder="Declare Rank (Bluff?)" />
        </SelectTrigger>

          <SelectContent>
            {RANKS.map(r => (
              <SelectItem
                className="text-white py-2 px-4 cursor-pointer rounded-md hover:bg-gray-700 hover:text-blue-500 transition-all ease-in-out duration-200"
                key={r}
                value={r}
              >
                {r}
              </SelectItem>
            ))}
          </SelectContent>

      </Select>
      <Button
       className="bg-green-600 text-white font-semibold px-6"
        onClick={() => submitAction('PLAY')}
        disabled={
          isSubmitting ||
          selectedCards.length === 0 ||
          selectedCards.length > 4 ||
          !declaredRank
        }
      >
        Play {selectedCards.length ? selectedCards.length : ''}{' '}
        Card{selectedCards.length !== 1 ? 's' : ''} as {declaredRank || '?'}
      </Button>
    </div>

    <div className="flex gap-3 mt-3">
      <Button
        onClick={() => submitAction('PASS')}
        disabled={isSubmitting || (currentPlayer?.passesUsed ?? 0) >= 4}
        variant="outline"
        className='bg-green-600 text-white font-semibold px-6'
      >
        Pass
      </Button>
      {gameState.roundPile.length > 0 && (
        <Button
        className='bg-green-600 text-white font-semibold px-6'
          onClick={() => submitAction('CHALLENGE')}
          disabled={isSubmitting}
          variant="secondary"
        >
          Challenge
        </Button>
      )}
    </div>
  </div>
)}


      {gameState.phase === 'WAITING' && (
        <div className="text-white text-center mt-8">
          <p>Waiting for {playerCount - gameState.players.length} more players...</p>
          {currentPlayer?.orderIndex === 0 && (
            <Button onClick={startGame}>Start Game Manually</Button>
          )}
        </div>
      )}

      {gameState.phase === 'ENDED' && (
        <div className="text-white text-center mt-8">
          <p className="text-2xl font-bold">Game Over! Winner: {gameState.players.find(p => p.hand.length === 0)?.name || 'Unknown'}</p>
          <Button onClick={() => router.push('/')}>Restart or New Game</Button>
        </div>
      )}
    </div>
  )
}
