'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import React from 'react'

import { ClientOnly } from '~/components/ClientOnly'

interface TableCell {
  _key: string
  _type: string
  cells: string[]
}

export function PortableTextTable({
  value,
}: PortableTextComponentProps<{
  _key: string
  _type: string
  rows: TableCell[]
}>) {
  const [head, ...rows] = value.rows
  return (
    <ClientOnly>
      <table>
        {head && head.cells.filter(Boolean).length > 0 && (
          <thead>
            <tr>
              {head.cells.map((cell, index) => (
                <th key={index}>{cell}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.cells.map((cell, cellIndex) => {
                return <td key={cellIndex}>{cell}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ClientOnly>
  )
}