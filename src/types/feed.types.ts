import { LoadingState } from 'src/types/global.types';
import { CurrentUser } from 'src/types/user.types';

export interface feedsState {
  loading: LoadingState;
}

export interface feedMediaProps {
  uri: string;
  mimetype: string;
  type?: string;
  originalname: string;
  acl?: string;
  key?: string;
  etag?: string;
  size?: number;
  bucket?: string;
  encoding?: string;
  location?: string;
  metadata?: string;
  fieldname?: string;
  // contentType?: string;
  storageClass?: string;
  contentEncoding?: string;
  contentDisposition?: string;
  serverSideEncryption?: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  date: {
    created: string;
    updated: string;
  };
}

export interface feedsProps {
  id: number;
  isDraft?: boolean;
  description: string;
  media: feedMediaProps[];
  date: {
    created: string;
    updated: string;
  };
  user: CurrentUser;
  admin?: AdminUser;
  comments: number;
  likes: number;
  isLiked: boolean;
  pauseVideo?: boolean;
  setPauseVideo?: (val: boolean) => void;
  edit?: boolean;
  onPressLike?: () => void;
  onPressComment?: () => void;
  onPressDeletePost?: () => void;
  onPressEdit?: () => void;
}

export interface feedsComments {
  id: number;
  comment: string;
  date: {
    created: string;
    updated: string;
  };
  user: CurrentUser;
  admin: AdminUser;
}
export interface feedsLikes {
  id: number;
  date: {
    created: string;
    updated: string;
  };
  user: CurrentUser;
}

export interface feedsByIdProps {
  id: number;
  isDraft?: boolean;
  description: string;
  media: feedMediaProps[];
  date: {
    created: string;
    updated: string;
  };
  user: CurrentUser;
  admin?: AdminUser;
  comments: feedsComments[];
  likes: feedsLikes[];
}
