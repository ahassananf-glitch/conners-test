
export type Subscale = 'inattention' | 'hyperactivity' | 'learning' | 'executive' | 'aggression' | 'peer';
export type SectionKey = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: string;
  text: string;
  subscale: Subscale;
  section: SectionKey;
}

export type Answers = Record<string, number>;

export type Scores = Record<Subscale, number>;

export interface Section {
  key: SectionKey;
  title: string;
  description: string;
}
