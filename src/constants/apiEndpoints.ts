export const API = {
  ME: '/api/me',
  GET_USER_BY_ID: '/api/user',
  OAUTH: '/api/auth/oauth',
  REGISTRATION: '/api/auth/register',
  VERIFY_TOKEN: '/api/auth/verify-email',
  LOGIN: '/api/auth/login',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  CHANGE_PASSWORD: '/api/change-password',
  SET_PROFILE: '/api/set-profile',
  GET_AREA_OF_LAW: '/api/practice',
  GET_COMMON_CASES: '/api/practice/common-cases',
  STATE: '/api/state',
  CITY_OF_STATE: '/api/city',
  SEND_OTP_FOR_STUDENT_EMAIL: '/api/student-email-verification-request',
  VERIFY_OTP_FOR_STUDENT_EMAIL: '/api/otp-student-email-verification',
  LOGOUT: '/api/logout',

  // Lawyers
  LAWYERS_LIST: '/api/lawyer/lawyer-find',
  RATE_REVIEW: '/api/rate-review',
  RATE_REVIEW_BY_ID: '/api/rate-review-by-user',

  // chat
  CHATS_LIST: '/api/chat',
  CREATE_CHAT: '/api/chat/initialize-chat',
  CHAT_CLOSE: '/api/chat/chat-closed',
  // block unblock user
  BLOCK_USER: '/api/block-user',
  UNBLOCK_USER: '/api/unblock-user',
  BLOCKED_USER_LIST: '/api/get-blocked-users',

  // myPockets
  MY_POCKET: '/api/my-pocket',
  All_SHARED_FILE: '/api/shared-document/get-documents',
  SHARE_FILE: '/api/shared-document/share',
  SHARED_FILES: '/api/shared-document/get-documents-byId',
  DELETE_FILES: '/api/remove-from-pocket',

  // user update profile
  UPDATE_PROFILE: '/api/update-profile',
  UPDATE_EMAIL: '/api/update-email',
  RESEND_VERIFY_EMAIL: '/api/auth/resend-verify-email',

  // dashBoard
  DASHBOARD_LIST: '/api/dashboard/dasboard-data',

  // otherProfile
  MARK_MY_CLIENT: '/api/my-client',

  // case file
  CREATE_CASE_FILE: '/api/case-file',
  UPDATE_CASE_FILE: '/api/case-file',
  GET_CASE_FILE_BY_ID: '/api/case-file',

  // subscription
  GET_SUBSCRIPTION: '/api/subscription/get-subscription-options',
  VERIFY_SUBSCRIPTION_RECEIPT: '/api/subscription/verify-receipt',

  // feeds
  CREATE_FEEDS: '/api/feed/create-feed',
  LIKE_UNLIKE_FEED: '/api/feed/like',
  COMMENT_ON_FEED: '/api/feed/comment',
  GET_LIST_FEEDS: '/api/feed',
  UPDATE_FEEDS: '/api/feed',
  DELETE_FEEDS: '/api/feed',
  DELETE_FEEDS_MEDIA: '/api/feed/media',

  // notification
  NOTIFICATION_LIST: '/api/notification/get-notifications',
  MARK_AS_READ_NOTIFICATION: '/api/notification/mark-read',

  // myClients
  MY_CLIENTS_LIST: '/api/my-client',
};
