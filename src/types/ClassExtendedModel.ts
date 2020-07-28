type ClassExtendedModel<T> = {
  new (...args: any): T,
  name: string,
  routeName: string,
  timestamps: boolean,
};

export default ClassExtendedModel;
