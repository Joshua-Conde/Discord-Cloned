import { ListedServer } from '../../../rediscord-lib/entities/server'
import { delay } from '../../../rediscord-lib/utils'
import {
  MOCK_DELAY,
  generateRandomFakeServers,
} from '../../../rediscord-lib/utils/mock'
import SideMenuTrack from './side-menu-track'
import SideMenuWrapper from './side-menu-wrapper'

export const getData = async (): Promise<{ servers: ListedServer[] }> => {
  /*
   * Generate fake servers for testing
   */
  const servers: ListedServer[] = generateRandomFakeServers(18)
  await delay(MOCK_DELAY)
  return { servers }
}

export default async function SideMenu() {
  const { servers } = await getData()
  return (
    <SideMenuWrapper>
      <SideMenuTrack servers={servers} />
    </SideMenuWrapper>
  )
}
