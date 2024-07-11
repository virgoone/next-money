import './style.css'

export default function () {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg className="loading-ring" viewBox="25 25 50 50" strokeWidth="5">
        <circle cx="50" cy="50" r="20" />
      </svg>
    </div>
  )
}
