import { getDateFromObjectId } from '../src/utils/dates/dates';
import { ObjectId } from 'mongodb';

export const testSeeder = {
  createUserDto() {
    return {
      login: 'test',
      email: 'test@gmail.com',
      password: '123456789',
    };
  },

  createDocumentsDto() {
    return {
      ip: '1',
      url: 'url',
      date: getDateFromObjectId(new ObjectId()),
      _id: new ObjectId(),
    };
  },

  createDocumentsListDto(count: number) {
    return new Array(count).fill(null).map(() => {
      return {
        ip: '1',
        url: 'url',
        date: getDateFromObjectId(new ObjectId()),
        _id: new ObjectId(),
      };
    });
  },
};
