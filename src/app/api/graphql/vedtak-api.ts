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

  async hentVedtak(ident: String): Promise<IVedtak[]> {

    console.log("request options: ", { token: this.token, url: this.baseURL, body: JSON.stringify({ ident }) });

    return this.post<IVedtak[]>("/vedtak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify({ ident }),
    });
  }



}