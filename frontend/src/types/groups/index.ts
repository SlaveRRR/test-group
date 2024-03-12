interface IUser {
    first_name: string;
    last_name: string;
  }

export interface IGroup {
  id: number;
  name: string;
  closed: boolean;
  avatar_color?: string;
  members_count: number;
  friends?: IUser[];
}

export interface AxiosResponse {
    result: 1 | 0;
    data?: IGroup[];
  }