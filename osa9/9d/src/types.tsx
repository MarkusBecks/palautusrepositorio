export interface CoursePartBase {
  name: string;
  exerciseCount: number;
  kind: string;
}

export interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: 'group';
}

export interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

export interface CoursePartBasic extends CoursePartWithDescription {
  kind: 'basic';
}

export interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string;
  kind: 'background';
}

export interface CoursePartWithRequirements extends CoursePartWithDescription {
  requirements: string[];
  kind: 'special';
}

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartWithRequirements;
