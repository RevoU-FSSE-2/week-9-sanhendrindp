export interface User {
  id: number;
  name: string;
  address: string;
  balance: number;
  expense: number;
}

export let user: User[] = [
  {
    id: 1,
    name: "Hendrin",
    address: "Malang",
    balance: 100000,
    expense: 5000,
  },
];
