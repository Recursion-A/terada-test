import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GlobalNavi } from '@freee_jp/vibes'
import {
  MdHome,
  MdInbox,
  MdAssessment,
  MdLibraryBooks,
  MdCreditCard,
  MdSettings,
  MdSearch,
  MdAutoAwesome
} from 'react-icons/md'
import { isTokenValid } from '../Auth/authHelper'

const NavigationBar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const links = [
    { title: 'ホーム', url: '/', IconComponent: MdHome },
    { title: '上映中の映画', url: '/now_playing', IconComponent: MdInbox },
    { title: '近日公開の映画', url: '/upcoming', IconComponent: MdAssessment },
    {
      title: '評価の高い映画',
      url: '/top_rated',
      IconComponent: MdAutoAwesome
    },
    {
      title: 'お気に入りの映画',
      url: '/favorite_movies',
      IconComponent: MdLibraryBooks
    },
    { title: 'レビューした映画', url: '/reviews', IconComponent: MdCreditCard },
    { title: '映画をタイトルで検索', url: '/search', IconComponent: MdSearch }
  ]

  if (isTokenValid()) {
    links.push({
      title: 'ログアウト',
      url: '/logout',
      IconComponent: MdSettings
    })
  } else {
    links.push({ title: 'ログイン', url: '/login', IconComponent: MdSettings })
    localStorage.removeItem('token')
  }

  return (
    <GlobalNavi
      links={links.map((link) => ({
        ...link,
        current: location.pathname === link.url,
        onClick: () => navigate(link.url)
      }))}
      hideHelpForm
      disableGutters={true}
    />
  )
}

export default NavigationBar
