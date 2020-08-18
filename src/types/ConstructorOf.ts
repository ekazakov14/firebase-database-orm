type ConstructorOf<T, P = {}> = {
  new (...args: any): T,
  name: string,
} & P;

export default ConstructorOf;
