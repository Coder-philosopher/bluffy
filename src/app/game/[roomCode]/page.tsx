'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'

const BACKEND_URL = 'https://bluffy-game-backend.tentaciouspersona-01c.workers.dev'

export default function Game() {
  const { roomCode } = useParams()
  const playerName = localStorage.getItem('playerName')
  const [gameState, setGameState] = useState<any>(null) // Replace with typed GameState later

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/game/state/${roomCode}`)
        setGameState(response.data)
        toast.info('Game state loaded!')
      } catch (error) {
        toast.error('Failed to load game state.')
        console.error(error)
      }
    }
    fetchState()
  }, [roomCode])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 to-black p-4">
      <h2 className="text-4xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-spacemono)" }}>
        Bluffy Game - Room {roomCode}
      </h2>
      <p className="text-lg text-gray-300 mb-4">Welcome, {playerName}!</p>
      {gameState ? (
        <pre className="text-white bg-gray-800 p-4 rounded-xl">{JSON.stringify(gameState, null, 2)}</pre>
      ) : (
        <p className="text-gray-400">Loading game state...</p>
      )}
      {/* TODO: Add player hand, actions, polling */}
    </div>
  )
}
