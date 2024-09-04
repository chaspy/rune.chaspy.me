'use client'

import { useState, useCallback, useMemo } from 'react'

const tokyoLocations = [
  { name: '青砥24', lat: 35.747797, lon: 139.857486 },
  { name: '亀戸24', lat: 35.697399, lon: 139.820022 },
  { name: '北砂', lat: 35.684191, lon: 139.825219 },
  { name: '曳舟24', lat: 35.718132, lon: 139.820936 },
  { name: '両国24', lat: 35.693879, lon: 139.792769 },
  { name: '東あずま24', lat: 35.723223, lon: 139.834034 },
  { name: '赤羽', lat: 35.777955, lon: 139.719302 },
  { name: '光が丘', lat: 35.764109, lon: 139.635586 },
  { name: '石神井公園24', lat: 35.745053, lon: 139.607648 },
  { name: '富士見台24', lat: 35.736117, lon: 139.627708 },
  { name: '早稲田', lat: 35.707528, lon: 139.71904 },
  { name: '三軒茶屋24', lat: 35.640806, lon: 139.668289 },
  { name: '経堂', lat: 35.64975, lon: 139.635835 },
  { name: '仙川24', lat: 35.66364, lon: 139.583397 },
  { name: 'ひばりヶ丘24', lat: 35.748987, lon: 139.543096 },
  { name: '東伏見24', lat: 35.727673, lon: 139.564292 },
  { name: '東久留米24', lat: 35.758006, lon: 139.529103 },
  { name: '国立24', lat: 35.697751, lon: 139.448645 },
  { name: '西国分寺24', lat: 35.699392, lon: 139.467294 },
  { name: '北千住24', lat: 35.748598, lon: 139.8063 },
  { name: 'KSC金町24', lat: 35.768141, lon: 139.871325 },
]

const saitamaLocations = [
  { name: '浦和24', lat: 35.879795610942224, lon: 139.64011593495226 },
  { name: '蕨24', lat: 35.82305596578032, lon: 139.6932897637855 },
  { name: '吉川', lat: 35.88764707068135, lon: 139.84236030981833 },
  { name: '新所沢', lat: 35.81196958288052, lon: 139.4622548669497 },
  { name: '北朝霞24', lat: 35.81584457322143, lon: 139.5875918725021 },
  { name: '北戸田24', lat: 35.825488755301386, lon: 139.66065498283058 },
  { name: '春日部', lat: 35.983684568053036, lon: 139.75117300982268 },
  { name: '吉川美南', lat: 35.86610725773631, lon: 139.85942716139976 },
  { name: 'ふじみ野24', lat: 35.88073040793992, lon: 139.52218996298268 },
]

const visitedLocations = [
  '三軒茶屋24',
  '経堂',
  '東伏見24',
  '仙川24',
  '石神井公園24',
  '富士見台24',
  '光が丘',
  '東久留米24',
]

// 場所の型を定義します。
type Location = {
  name: string
  lat: number
  lon: number
}

// MapComponent の props の型を定義します。
type MapComponentProps = {
  locations: Location[]
  visited: { [key: string]: boolean }
  toggleVisited: (name: string) => void
  filterVisited: 'all' | 'visited' | 'not-visited'
  title: string
}

const MapComponent = ({
  locations,
  visited,
  toggleVisited,
  filterVisited,
  title,
}: MapComponentProps) => {
  const [activeLocation, setActiveLocation] = useState<string | null>(null)

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      if (filterVisited === 'all') return true
      if (filterVisited === 'visited') return visited[location.name]
      return !visited[location.name]
    })
  }, [locations, visited, filterVisited])

  const bounds = useMemo(() => {
    return locations.reduce(
      (acc, loc) => ({
        minLat: Math.min(acc.minLat, loc.lat),
        maxLat: Math.max(acc.maxLat, loc.lat),
        minLon: Math.min(acc.minLon, loc.lon),
        maxLon: Math.max(acc.maxLon, loc.lon),
      }),
      {
        minLat: Infinity,
        maxLat: -Infinity,
        minLon: Infinity,
        maxLon: -Infinity,
      }
    )
  }, [locations])

  const toSVGCoords = useCallback(
    (lat: number, lon: number) => {
      const margin = 8
      const x =
        ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) *
          (100 - 2 * margin) +
        margin
      const y =
        90 -
        ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) *
          (80 - 2 * margin) -
        margin
      return { x, y }
    },
    [bounds]
  )

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="relative w-full" style={{ paddingBottom: '90%' }}>
        <svg viewBox="0 0 100 90" className="absolute inset-0 w-full h-full">
          <rect
            x="0"
            y="0"
            width="100"
            height="90"
            fill="#f0f0f0"
            stroke="#000"
            strokeWidth="0.5"
          />
          {locations.map((location) => {
            const { x, y } = toSVGCoords(location.lat, location.lon)
            return (
              <g key={location.name}>
                <circle
                  cx={x}
                  cy={y}
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
                  x={x}
                  y={y - 3}
                  fontSize="1.5"
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
            )
          })}
        </svg>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        {filteredLocations.map((location) => (
          <button
            key={location.name}
            onClick={() => toggleVisited(location.name)}
            className={`py-2 px-4 rounded transition-all duration-300 ease-in-out flex items-center justify-between
              ${
                visited[location.name]
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }
              ${activeLocation === location.name ? 'ring-2 ring-blue-500' : ''}
            `}
            onMouseEnter={() => setActiveLocation(location.name)}
            onMouseLeave={() => setActiveLocation(null)}
          >
            <span>{location.name}</span>
            <span className="ml-2" aria-hidden="true">
              {visited[location.name] ? '✓' : '○'}
            </span>
            <span className="sr-only">
              {visited[location.name] ? '訪問済み' : '未訪問'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Component() {
  const [visited, setVisited] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(
      [...tokyoLocations, ...saitamaLocations].map((loc) => [
        loc.name,
        visitedLocations.includes(loc.name),
      ])
    )
  )
  const [showAlert, setShowAlert] = useState(false)
  const [filterVisited, setFilterVisited] = useState<
    'all' | 'visited' | 'not-visited'
  >('all')

  const toggleVisited = useCallback((location: string) => {
    setVisited((prev) => ({ ...prev, [location]: !prev[location] }))
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }, [])

  const allLocations = [...tokyoLocations, ...saitamaLocations]

  const calculateProgress = useCallback(
    (locations: typeof tokyoLocations) => {
      const visitedCount = locations.filter((loc) => visited[loc.name]).length
      const totalCount = locations.length
      const progressPercentage = (visitedCount / totalCount) * 100
      return { visitedCount, totalCount, progressPercentage }
    },
    [visited]
  )

  const tokyoProgress = useMemo(
    () => calculateProgress(tokyoLocations),
    [calculateProgress]
  )
  const saitamaProgress = useMemo(
    () => calculateProgress(saitamaLocations),
    [calculateProgress]
  )
  const totalProgress = useMemo(
    () => calculateProgress(allLocations),
    [calculateProgress, allLocations]
  )

  const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">chaspy ルネサンス 制覇マップ</h1>
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
        <h2 className="text-xl font-semibold mb-4">進捗状況</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">東京</h3>
            <ProgressBar progress={tokyoProgress.progressPercentage} />
            <p className="text-center">
              {tokyoProgress.visitedCount} / {tokyoProgress.totalCount}{' '}
              店舗訪問済み ({tokyoProgress.progressPercentage.toFixed(1)}%)
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">埼玉</h3>
            <ProgressBar progress={saitamaProgress.progressPercentage} />
            <p className="text-center">
              {saitamaProgress.visitedCount} / {saitamaProgress.totalCount}{' '}
              店舗訪問済み ({saitamaProgress.progressPercentage.toFixed(1)}%)
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">合計</h3>
            <ProgressBar progress={totalProgress.progressPercentage} />
            <p className="text-center">
              {totalProgress.visitedCount} / {totalProgress.totalCount}{' '}
              店舗訪問済み ({totalProgress.progressPercentage.toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">
          フィルター:
        </label>
        <select
          id="filter"
          value={filterVisited}
          onChange={(e) =>
            setFilterVisited(
              e.target.value as 'all' | 'visited' | 'not-visited'
            )
          }
          className="border rounded p-1"
        >
          <option value="all">全て</option>
          <option value="visited">訪問済み</option>
          <option value="not-visited">未訪問</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MapComponent
          locations={tokyoLocations}
          visited={visited}
          toggleVisited={toggleVisited}
          filterVisited={filterVisited}
          title="東京"
        />
        <MapComponent
          locations={saitamaLocations}
          visited={visited}
          toggleVisited={toggleVisited}
          filterVisited={filterVisited}
          title="埼玉"
        />
      </div>
    </div>
  )
}
