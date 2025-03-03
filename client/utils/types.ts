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
  title: string;
  response: string;
  action_type: string;
  chat: string;
  action_details: T; 
  created_at: string;
}

export interface RecordType {
  [key: string]: string | number | boolean | null; 
}

export interface error {
  column: string;
  issueType: string;
}
export interface Issue {
  row: number;
  errors: error[];
}

export interface Payload {
  email: string;
  firstName: string;
  lastName: string;
}

export interface Schema {
  [key: string]: string; 
}

export interface schemaTypeDefintion {
  "dataType": string;
  "unique": boolean;
  "numericSign": string | null;
  "precision": number | null;
  "format": string | null;
}

export interface SchemaDefinition {
  [key: string]: schemaTypeDefintion;
}

export interface SchemaType {
  // user_id: string;
  file_id: string;
  schema_definition: SchemaDefinition;
} 