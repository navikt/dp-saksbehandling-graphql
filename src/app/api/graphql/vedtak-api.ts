import { RESTDataSource, AugmentedRequest } from '@apollo/datasource-rest';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

import { getEnv } from './utils/env.utils';

export interface IVedtak {
  rammer: {
    vedtakId: string;
    virkningsdato: string;
  }[];
  utbetalinger: {
    vedtakId: string;
    fraOgMed: string;
    tilOgMed: string;
    sumUtbetalt: number;
  }[];
}
export class VedtakAPI extends RESTDataSource {
  override baseURL = getEnv("DP_VEDTAK_URL")
  private token: string;

  constructor(options: { token: string; cache: KeyValueCache }) {
    super(options);
    this.token = options.token;
  }

  async hentVedtak(): Promise<IVedtak[]> {
    console.log("WITH BEARER: ", `Bearer ${this.token}`);

    return this.post<IVedtak[]>("/vedtak", {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
    });
  }



}