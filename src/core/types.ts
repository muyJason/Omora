
export interface FeatureMeta {
  id: string;
  name: string;
  tooltip: string;
  icon: string;
  entry: {
    script: string;
    html: string;
  };
  capabilities?: string[];
  version?: string;
  minOmora?: string;
}
