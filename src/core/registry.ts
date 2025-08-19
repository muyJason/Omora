import { FeatureMeta } from './types';

export async function loadRegistry(): Promise<FeatureMeta[]> {
  const metas: FeatureMeta[] = [];
  try {
    const url = chrome.runtime.getURL('src/features/colorpicker/metadata.json');
    const res = await fetch(url);
    const meta = await res.json();
    metas.push(meta as FeatureMeta);
  } catch (_e) {
  }
  return metas;
}
