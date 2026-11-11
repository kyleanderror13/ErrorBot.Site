export interface CommandRecord {
  name: string;
  description: string;
  availability: string;
}

export interface CommandRegister {
  records: CommandRecord[];
}