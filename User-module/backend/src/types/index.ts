export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: Date;
  address: Address;
  department: string;
  position: string;
  startDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
