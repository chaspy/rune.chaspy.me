'use client'

import { useState } from 'react'

const locations = [
  { name: '青砥24', x: 80, y: 45 },
  { name: 'KSC金町24', x: 88, y: 35 },
  { name: '北千住24', x: 75, y: 30 },
  { name: '綾瀬24', x: 70, y: 40 },
  { name: '亀戸24', x: 85, y: 50 },
  { name: '北砂', x: 88, y: 55 },
  { name: '西国分寺24', x: 20, y: 45 },
  { name: '国立24', x: 15, y: 40 },
  { name: '三軒茶屋24', x: 50, y: 68 },
  { name: '経堂', x: 45, y: 72 },
  { name: '東伏見24', x: 25, y: 25 },
  { name: 'ひばりヶ丘24', x: 20, y: 30 },
  { name: '仙川24', x: 30, y: 35 },
  { name: '東久留米24', x: 25, y: 20 },
  { name: '早稲田', x: 55, y: 55 },
  { name: '赤羽', x: 55, y: 20 },
  { name: '両国24', x: 70, y: 60 },
  { name: '曳舟24', x: 75, y: 55 },
  { name: '光が丘', x: 45, y: 25 },
  { name: '石神井公園24', x: 35, y: 30 },
  { name: '富士見台24', x: 40, y: 35 },
]

const visitedLocations = [
  '青砥24',
  'KSC金町24',
  '北千住24',
  '綾瀬24',
  // 訪問済みの場所をここに追加
]

export default function Home() {
  const [visited, setVisited] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(
      locations.map((loc) => [loc.name, visitedLocations.includes(loc.name)])
    )
  )
  const [activeLocation, setActiveLocation] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)

  const toggleVisited = (location: string) => {
    setVisited((prev) => ({ ...prev, [location]: !prev[location] }))
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const visitedCount = Object.values(visited).filter(Boolean).length
  const progress = (visitedCount / locations.length) * 100

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ルネサンス東京 制覇マップ</h1>
      {showAlert && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
          role="alert"
        >
          <p className="font-bold">注意</p>
          <p>
            この変更はページをリロードすると元に戻ります。実際の訪問記録は管理者が更新します。
          </p>
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">進捗状況</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center">
          {visitedCount} / {locations.length} 店舗訪問済み (
          {progress.toFixed(1)}%)
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative w-full" style={{ paddingBottom: '85%' }}>
          <svg viewBox="0 0 100 85" className="absolute inset-0 w-full h-full">
            <rect
              x="5"
              y="5"
              width="90"
              height="75"
              fill="#f0f0f0"
              stroke="#000"
              strokeWidth="0.5"
            />
            <line
              x1="50"
              y1="5"
              x2="50"
              y2="80"
              stroke="#ccc"
              strokeWidth="0.5"
            />
            <line
              x1="5"
              y1="42.5"
              x2="95"
              y2="42.5"
              stroke="#ccc"
              strokeWidth="0.5"
            />

            {locations.map((location) => (
              <g key={location.name}>
                <circle
                  cx={location.x}
                  cy={location.y}
                  r={activeLocation === location.name ? '2.5' : '2'}
                  fill={visited[location.name] ? '#4CAF50' : '#FF5722'}
                  stroke={activeLocation === location.name ? '#000' : 'none'}
                  strokeWidth="0.5"
                  className="cursor-pointer transition-all duration-300 ease-in-out"
                  onClick={() => toggleVisited(location.name)}
                  onMouseEnter={() => setActiveLocation(location.name)}
                  onMouseLeave={() => setActiveLocation(null)}
                />
                <text
                  x={location.x}
                  y={location.y - 2.5}
                  fontSize="2"
                  textAnchor="middle"
                  fill={activeLocation === location.name ? '#000' : '#333'}
                  className="pointer-events-none transition-all duration-300 ease-in-out"
                  style={{
                    fontWeight:
                      activeLocation === location.name ? 'bold' : 'normal',
                  }}
                >
                  {location.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {locations.map((location) => (
            <button
              key={location.name}
              onClick={() => toggleVisited(location.name)}
              className={`py-2 px-4 rounded transition-all duration-300 ease-in-out flex items-center justify-between
                ${
                  visited[location.name]
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }
                ${
                  activeLocation === location.name ? 'ring-2 ring-blue-500' : ''
                }
              `}
              onMouseEnter={() => setActiveLocation(location.name)}
              onMouseLeave={() => setActiveLocation(null)}
            >
              <span>{location.name}</span>
              <span className="ml-2">{visited[location.name] ? '✓' : '○'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
