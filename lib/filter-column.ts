import {
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  not,
  notIlike,
  type Column,
  type ColumnBaseConfig,
  type ColumnDataType,
} from 'drizzle-orm'

import { type DataTableConfig } from '@/config/data-table'

export function filterColumn({
  column,
  value,
  isSelectable,
}: {
  column: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>
  value: string
  isSelectable?: boolean
}) {
  const [filterValue, filterOperator] = (value?.split('~').filter(Boolean) ??
    []) as [
    string,
    DataTableConfig['comparisonOperators'][number]['value'] | undefined,
  ]

  if (!filterValue) return

  if (isSelectable) {
    switch (filterOperator) {
      case 'eq':
        return inArray(column, filterValue?.split('.').filter(Boolean) ?? [])
      case 'notEq':
        return not(
          inArray(column, filterValue?.split('.').filter(Boolean) ?? []),
        )
      case 'isNull':
        return isNull(column)
      case 'isNotNull':
        return isNotNull(column)
      default:
        return inArray(column, filterValue?.split('.') ?? [])
    }
  }

  switch (filterOperator) {
    case 'ilike':
      return ilike(column, `%${filterValue}%`)
    case 'notIlike':
      return notIlike(column, `%${filterValue}%`)
    case 'startsWith':
      return like(column, `${filterValue}%`)
    case 'endsWith':
      return like(column, `%${filterValue}`)
    case 'eq':
      return eq(column, filterValue)
    case 'notEq':
      return not(eq(column, filterValue))
    case 'isNull':
      return isNull(column)
    case 'isNotNull':
      return isNotNull(column)
    default:
      return like(column, `%${filterValue}%`)
  }
}