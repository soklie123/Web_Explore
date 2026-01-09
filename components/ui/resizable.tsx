'use client'

import * as React from 'react'
import { GripVerticalIcon } from 'lucide-react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { cn } from '@/lib/utils'

export function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof Group>) {
  return (
    <Group
      className={cn('flex h-full w-full flex-col', className)}
      {...props}
    />
  )
}

export function ResizablePanel({ ...props }: React.ComponentProps<typeof Panel>) {
  return <Panel {...props} />
}

export function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & { withHandle?: boolean }) {
  return (
    <Separator
      className={cn(
        'bg-border relative flex w-px items-center justify-center',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </Separator>
  )
}
