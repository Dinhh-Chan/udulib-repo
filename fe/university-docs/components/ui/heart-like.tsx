"use client"

import React, { useRef, useEffect } from 'react'

interface HeartLikeProps {
  isLiked: boolean
  onToggle: () => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function HeartLike({ isLiked, onToggle, disabled = false, size = 'md' }: HeartLikeProps) {
  const checkboxRef = useRef<HTMLInputElement>(null)

  // Sync checkbox với isLiked prop
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = isLiked
    }
  }, [isLiked])

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  return (
    <div className="heart-like-wrapper">
      <div className={`heart-container ${sizeClasses[size]}`} title={isLiked ? "Bỏ thích" : "Thích"}>
        <input 
          ref={checkboxRef}
          type="checkbox" 
          className="heart-checkbox" 
          checked={isLiked}
          onChange={onToggle}
          disabled={disabled}
        />
        <div className="svg-container">
          <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
          </svg>
          <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
          </svg>
          <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="10,10 20,20" />
            <polygon points="10,50 20,50" />
            <polygon points="20,80 30,70" />
            <polygon points="90,10 80,20" />
            <polygon points="90,50 80,50" />
            <polygon points="80,80 70,70" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        .heart-container {
          --heart-color: rgb(255, 91, 137);
          position: relative;
          transition: .3s;
          cursor: pointer;
        }

        .heart-container:hover {
          transform: scale(1.1);
        }

        .heart-checkbox {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          z-index: 20;
          cursor: pointer;
        }

        .heart-checkbox:disabled {
          cursor: not-allowed;
        }

        .svg-container {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .svg-outline,
        .svg-filled {
          fill: var(--heart-color);
          position: absolute;
          width: 70%;
          height: 70%;
        }

        .svg-filled {
          animation: keyframes-svg-filled 1s;
          display: none;
        }

        .svg-celebrate {
          position: absolute;
          animation: keyframes-svg-celebrate .5s;
          animation-fill-mode: forwards;
          display: none;
          stroke: var(--heart-color);
          fill: var(--heart-color);
          stroke-width: 2px;
          width: 100%;
          height: 100%;
        }

        .heart-checkbox:checked ~ .svg-container .svg-filled {
          display: block;
        }

        .heart-checkbox:checked ~ .svg-container .svg-celebrate {
          display: block;
        }

        .heart-checkbox:checked ~ .svg-container .svg-outline {
          display: none;
        }

        @keyframes keyframes-svg-filled {
          0% {
            transform: scale(0);
          }
          25% {
            transform: scale(1.2);
          }
          50% {
            transform: scale(1);
            filter: brightness(1.5);
          }
        }

        @keyframes keyframes-svg-celebrate {
          0% {
            transform: scale(0);
          }
          50% {
            opacity: 1;
            filter: brightness(1.5);
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
            display: none;
          }
        }

        /* Dark mode support */
        :global(.dark) .heart-container {
          --heart-color: rgb(255, 105, 147);
        }

        /* Disabled state */
        .heart-container:has(.heart-checkbox:disabled) {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .heart-container:has(.heart-checkbox:disabled):hover {
          transform: none;
        }
      `}</style>
    </div>
  )
} 