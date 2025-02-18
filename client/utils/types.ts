export interface projectType {
    file_id:string;
    original_name:string;
    description:string;
    category:string;
    progress:number;
}

export interface IssueDistributionType  {
    IssueType:string;
    IssueDetected: number;
    fill?:string;
  }

export interface ColumnProblem {
  column: string;
  numberOfProblems: number;
}

export interface ErrorDetectionType {
  DataInconsistency: string;
  DetectionStatus: number;
  ImpactLevel: string;
  Questions: string;
  HowManyDetected: number;
  AffectedPercentage: string;
  FieldColumnName: string[];
  RecommendedAction: string;
}


export type Props = {
  params: Promise<{
    fileid: string | undefined;
  }>;
};

export interface fileDetailsType {
  original_name: string;
  description: string;
}

export interface Action<T = unknown> { 
  action_id: string;
  file_id: string;
  user_id: string;
  action_type: string;
  chat: string;
  action_details: T; 
  created_at: string;
}




// // types.ts

    // export interface User {
    // firstName: string;
    // lastName: string;
    // }

    // export interface Tag {
    // id: string;
    // name: string;
    // }

    // export interface BlogTag {
    // id: string;
    // tagId: string;
    // blogId: string;
    // tag: Tag; // Add the nested tag structure
    // }

    // export interface Blog {
    // id: string;
    // blogName: string;
    // hook: string;
    // blogCover: string;
    // blogCoverPublicId?: string | null;
    // desc: string;
    // status: boolean;
    // createdAt: Date;
    // updatedAt?: Date;
    // userId: string;
    // user: User;
    // blogTags: BlogTag[];
    // }
