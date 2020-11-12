export class User {
  userId: string;

  firstName: string;

  lastName: string;

  constructor(options: {
    userId: string;
    firstName?: string;
    lastName?: string;
  }) {
    this.userId = options.userId;
    this.firstName = options.firstName;
    this.lastName = options.lastName;
  }
}
