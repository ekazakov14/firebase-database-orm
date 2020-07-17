type ClassExtendedModel<T> = {
  new (...args: any): T,
  name: string,
  routeName: string
};

export default ClassExtendedModel;
