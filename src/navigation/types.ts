export enum Routes {
  Example = 'Example',
}

export type AppParamList = {
  [Routes.Example]: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppParamList {}
  }
}
