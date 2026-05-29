export interface Room {

  id: string;

  name: string;

  ownerId: string;

  participants: string[];

  createdAt: Date;

  updatedAt?: Date;

}