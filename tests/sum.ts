//https://basarat.gitbooks.io/typescript/docs/testing/jest.html
//simple example function to test jest
export const sum
  = (...a: number[]) =>
    a.reduce((acc, val) => acc + val, 0);