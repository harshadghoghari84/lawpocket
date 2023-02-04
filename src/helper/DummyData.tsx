const user1 =
  'https://images.unsplash.com/photo-1546456073-ea246a7bd25f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YmxhY2slMjBtYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60';
const user2 =
  'https://images.unsplash.com/photo-1529111290557-82f6d5c6cf85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDd8fGJsYWNrJTIwbWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60';
const user3 =
  'https://images.unsplash.com/photo-1529688530647-93a6e1916f5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YmxhY2slMjBtYW4lMjB3aXRoJTIwaGF0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60';

export const FeedsData = [
  {
    _id: 1,
    profile: user1,
    name: 'David Watson',
    time: '11:30 AM',
    description:
      'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum ',
    image: [
      {
        img: 'https://images.ctfassets.net/hrltx12pl8hq/3MbF54EhWUhsXunc5Keueb/60774fbbff86e6bf6776f1e17a8016b4/04-nature_721703848.jpg?fit=fill&w=480&h=270',
      },
      {
        img: 'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547__340.jpg',
      },
      {
        img: 'https://helpx.adobe.com/content/dam/help/en/photoshop/using/matching-replacing-mixing-colors/jcr_content/main-pars/before_and_after/image-after/match-outcome3.png',
      },
    ],
  },
  {
    _id: 2,
    profile: user2,
    name: 'James White',

    time: '10:25 AM',

    description:
      'Many desktop publishing packages and web page editors now use Lorem Ipsum ',
    video:
      'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_640_3MG.mp4',
  },
  {
    _id: 3,
    profile: user3,
    name: 'Michael Jordan',

    time: 'Yesterday',
    video: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',

    description:
      'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
  },
];
export const ReviewsData = [
  {
    id: 1,
    profile: user1,
    name: 'David Watson',

    date: '10/6/2021',
    starCount: 5,
    stars: [
      { star: 'star' },
      { star: 'star' },
      { star: 'star' },
      { star: 'star' },
      { star: 'star' },
    ],
    description:
      'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum ',
  },
  {
    id: 2,
    profile: user2,
    name: 'James White',
    date: '10/6/2021',
    starCount: 3,
    stars: [{ star: 'star' }, { star: 'star' }, { star: 'star' }],
    description:
      'Many desktop publishing packages and web page editors now use Lorem Ipsum ',
  },
  {
    id: 3,
    profile: user3,
    name: 'Michael Jordan',
    date: '10/6/2021',
    starCount: 1,
    stars: [{ star: 'star' }],
    description:
      'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
  },
];
export const ChatData = [
  {
    _id: 1,
    profile: user1,
    name: 'David Watson',
    disc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '11:30 AM',
    msgCount: 2,
  },
  {
    _id: 2,
    profile: user2,
    name: 'James White',
    disc: 'Okay',
    time: '10:25 AM',
    msgCount: 0,
  },
  {
    _id: 3,
    profile: user3,
    name: 'Michael Jordan',
    disc: 'document.pdf',
    time: 'Yesterday',
    msgCount: 0,
  },
];

export const SubScriptionData = [
  {
    icon: 'ios-add-outline',
    title: 'Plus',
    txt1: '1 Login allowed at a time.',
    txt2: 'Unlimited file storage',
    dollar: 65,
  },
  {
    icon: 'star',
    title: 'Gold',
    txt1: '2 Login allowed at a time.',
    txt2: 'Unlimited file storage',
    dollar: 105,
  },
  {
    icon: 'flash',
    title: 'Ultra',
    txt1: '5 Login allowed at a time.',
    txt2: 'Unlimited file storage',
    dollar: 250,
  },
];

export const LawyersData = [
  {
    _id: 1,
    profile: user1,
    name: 'David Watson',
    rating: '4.5',
    location: 'Ohio',
    lawyerType: 'Practitioner, Criminal Law, Contractor law',
    totalCase: '16',
    hrs: '48',
  },
  {
    _id: 2,
    profile: user2,
    name: 'James White',
    rating: '5.0',
    location: 'Ohio',
    lawyerType: 'Practitioner',
    totalCase: '16',
    hrs: '36',
  },
  {
    _id: 3,
    profile: user3,
    name: 'Michael Jordan',
    rating: '4.0',
    location: 'Ohio',
    lawyerType: 'Practitioner, Criminal Law, Contractor law',
    totalCase: '16',
    hrs: '24',
  },
];

export const lawTypeData = [
  { lawType: 'Admiralty (Maritime) Law' },
  { lawType: 'Bankruptcy Law' },
  { lawType: 'Business (Corporate) Law' },
  { lawType: 'Civil Rights Law' },
  { lawType: 'Criminal Law' },
  { lawType: 'Entertainment Law' },
  { lawType: 'Environmental Law' },
  { lawType: 'Family Law' },
  { lawType: 'Health Law' },
  { lawType: 'Immigration Law' },
  { lawType: 'Intellectual Property Law' },
  { lawType: 'International Law' },
  { lawType: 'Labor (Employment) Law' },
  { lawType: 'Labor (Employment) Law' },
];

export const RecentChatData = [
  {
    profile: user1,
    time: '2 hour ago',
    case: 'Case closed with ',
    name: 'James While',
  },
  {
    profile: user2,

    time: 'yesterday',
    case: 'New case Start with',
    name: 'Adam Clark',
  },
  {
    profile: user3,

    time: '3 days ago',
    case: 'New case Start with',
    name: 'Victoria Martin',
  },
];
