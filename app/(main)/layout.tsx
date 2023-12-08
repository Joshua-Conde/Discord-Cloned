/*
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main>{children}</main>
    </div>
  )
}
*/

import { Suspense } from 'react'
import DMLayout from '../../rediscord-components/islets/dm-layout'
import DMLayoutSkeleton from '../../rediscord-components/islets/dm-layout/dm-layout-skeleton'
import NavigationSidebar from '../../components/navigation/NavigationSidebar'

export const revalidate = 0

export default function SuspendedDMLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="flex h-full">
      {/* Navigation Sidebar */}
      <div className="hidden md:flex h-full w-[72px] fixed inset-y-0">
        <NavigationSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-200 h-full">
        {/* DMLayout */}
        <div className="hidden md:flex h-full w-full ml-[80px] flex-col inset-y-0">
          <Suspense fallback={<DMLayoutSkeleton>{children}</DMLayoutSkeleton>}>
            <DMLayout />
          </Suspense>
        </div>

        {/* Children */}
        <div>{children}</div>
      </div>
    </div>
  )
}
