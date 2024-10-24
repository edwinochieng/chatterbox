export interface Friend {
  id: string;
  fullName: string;
  email: string;
  imageUrl: string | null;
  bio: string | null;
  publicKey: string;
}

export interface SearchedFriend {
  id: string;
  fullName: string;
  email: string;
  imageUrl: string | null;
}

export interface SearchedUser {
  id: string;
  fullName: string;
  email: string;
  profilePicture: string;
  isRequested: boolean;
  isFriend: boolean;
}
