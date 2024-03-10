import { GlobalNavi } from "@freee_jp/vibes";
import { useLocation } from "react-router";
import { MdHome, MdInbox, MdAssessment, MdLibraryBooks, MdCreditCard, MdSettings, MdSearch } from 'react-icons/md';
const NavigationBar: React.FC = () => {
  const location = useLocation();

  const generateLinks = () => {
    const links = [
      { title: 'ホーム', url: '/', IconComponent: MdHome },
      { title: '上映中の映画', url: '/now_playing', IconComponent: MdInbox },
      { title: '人気の映画', url: '/popular_movies', IconComponent: MdAssessment },
      { title: '評価の高い映画', url: '/top_rated', IconComponent: MdAssessment },
      { title: 'お気に入りの映画', url: '/favorites', IconComponent: MdLibraryBooks },
      { title: 'レビューした映画', url: '/reviews', IconComponent: MdCreditCard },
      { title: 'アカウント登録', url: '/register', IconComponent: MdSettings },
      { title: '映画をタイトルで検索', url: '/search', IconComponent: MdSearch },
    ];
    return links.map(link => ({
      ...link,
      current: location.pathname === link.url
    }));
  };

  return (
    <GlobalNavi links={generateLinks()} hideHelpForm disableGutters={true} />
  );
}

export default NavigationBar