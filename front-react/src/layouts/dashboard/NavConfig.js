// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },
  {
    title: '사용자정보',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: '강의등록',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: '강의신청',
    path: '/dashboard/lectureregister',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: '수강신청',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: '강의경매',
    path: '/dashboard/auction',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: '경매입찰',
    path: '/dashboard/auctionBid',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: '강의분류',
    path: '/dashboard/lecturecategory',
    icon: getIcon('ant-design:tag-filled'),
  },
  {
    title: '강의결제',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: '강의평가',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: '강의정산',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: '로그인',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },

];

export default navConfig;
