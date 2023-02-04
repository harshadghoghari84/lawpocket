interface byUserProps {
  id?: number;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
}

export interface RateReviewDataProps {
  rate?: number;
  id?: number;
  review?: string;
  date?: { updated: string };
  byUser?: byUserProps;
}

export interface GetRateReview {
  data: RateReviewDataProps[];
  count: number;
}

// export interface GetRateReviewProps {
//   data: GetRateReview;
// }

const byUserProps = {
  id: 1,
  firstName: 'Testing',
  lastName: 'Review',
  profilePhoto:
    'https://lawpocket-dev.s3.ap-south-1.amazonaws.com/UserEntity/profilePhoto-1648727160998-342688948.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5A5JOWOM2BE3DFVQ%2F20220401%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220401T061940Z&X-Amz-Expires=518400&X-Amz-Signature=9bf7fdbdd77c082e8354a21880c70c20ae930e2b157c5a79f5a5d3724546fbbe&X-Amz-SignedHeaders=host',
};

export const rateReview = {
  rate: 4,
  id: 13,
  review: 'This review we create for testing purpose',
  date: { updated: '22-2-2022' },
  byUser: byUserProps,
};
