export interface UserPracticeAreaProps {
  id: number;
  name: string;
}
export interface GetLawyersProps {
  id: number;
  firstName: string;
  lastName: string;
  state: string;
  city: string;
  profilePhoto: string;
  rateOfHour: string;
  userPracticeArea: UserPracticeAreaProps[];
  ratingReview: number;
  myCustomer: number;
}
