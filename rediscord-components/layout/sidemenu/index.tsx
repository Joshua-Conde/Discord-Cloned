import NavigationSidebar from '../../../components/navigation/NavigationSidebar'
import Sidebar from '../sidebar'
import SideMenuWrapper from './side-menu-wrapper'

export default async function SideMenu() {
  return (
    <SideMenuWrapper>
      <NavigationSidebar />
    </SideMenuWrapper>
  )
}
