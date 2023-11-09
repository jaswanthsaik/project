import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CpuAnalysisService {
  private baseUrl = 'https://kalibr8analyticspoc.azurewebsites.net';
  //  private apiUrl = `${this.baseUrl}/CpuAnalysis/v2/${idCompany}/savings`;

  constructor(private http: HttpClient) { }

  getAverageSavingsValues(idCompany: number): Observable<any> {
    const headers = {
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2thbGlicjhkZXYuYjJjbG9naW4uY29tLzA5YzU4MjcxLWRjMGYtNDNiMS05NzdmLWQ5MDI5NzM0Yjg2Mi92Mi4wLyIsInN1YiI6ImE4MDQ5NWNmLWNjMDEtNDIyYy1hYzQ2LWU4OGM1YTRkODE4OCIsImF1ZCI6ImUzNTU0MDhmLWNlZmItNDYwOS1hY2E4LWE2ZjM1MWU2NmQ5NSIsImV4cCI6MTY5NjA2OTE3MSwibm9uY2UiOiIwMDU5NThiNC1mOWQ5LTQxOTctYmUyZC04YWRjNGIzN2Q5MWMiLCJpYXQiOjE2OTYwNjU1NzEsImF1dGhfdGltZSI6MTY5NjA2NTU2OSwib2lkIjoiYTgwNDk1Y2YtY2MwMS00MjJjLWFjNDYtZTg4YzVhNGQ4MTg4IiwibmFtZSI6IkRFTU8gVVNFUiIsImdpdmVuX25hbWUiOiJERU1PIiwiZmFtaWx5X25hbWUiOiJVU0VSIiwiZW1haWxzIjpbIkVuc2FydGVzdEBnbWFpbC5jb20iXSwidGZwIjoiQjJDXzFfU2lnbkluIiwiYXRfaGFzaCI6Ino3dXRYRFBRclRtSDA0TFdOS0RGSlEiLCJuYmYiOjE2OTYwNjU1NzF9.nh6ZyenwNiNzeIp-AW8KLNhw5BQEGKXETauog7AoeLlk-IekrgeoBY01ydJGiK6QXTOFx5U01xCUCtGSHKTzo_VGbd6g-WEvu6vX02ua1sbJROQxtTTcec_2AVQAyX0DQ80kURZrJluSvHLlog3wClKVEmKvto6pVRF-sLzNv6nSSFx45bPt4-AO2CcDG2GRQl4i2fbbxVkhuOb10XQJlMwoItumxQemCKqi0BmomNlEb2tE8aB2rnilYH1D9eVUM203C4nhWIoXuLU4nnM6lZq-GhxwGcfoBjI-gEGD_BGUtImbgoZr3iNmZBbnJxBZIp3h5nEmNy3FclVgCeTk6Q'
    };
    const params = {
      idCompany: idCompany.toString()
    };
    const costUrl = `${this.baseUrl}/CpuAnalysis/v2/${idCompany}/savings`;
    return this.http.get<any>(costUrl, { headers: headers, params: params });
  }

  getAverageCostValues(idCompany: number): Observable<any> {
    const headers = {
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2thbGlicjhkZXYuYjJjbG9naW4uY29tLzA5YzU4MjcxLWRjMGYtNDNiMS05NzdmLWQ5MDI5NzM0Yjg2Mi92Mi4wLyIsInN1YiI6ImE4MDQ5NWNmLWNjMDEtNDIyYy1hYzQ2LWU4OGM1YTRkODE4OCIsImF1ZCI6ImUzNTU0MDhmLWNlZmItNDYwOS1hY2E4LWE2ZjM1MWU2NmQ5NSIsImV4cCI6MTY5NjA2OTE3MSwibm9uY2UiOiIwMDU5NThiNC1mOWQ5LTQxOTctYmUyZC04YWRjNGIzN2Q5MWMiLCJpYXQiOjE2OTYwNjU1NzEsImF1dGhfdGltZSI6MTY5NjA2NTU2OSwib2lkIjoiYTgwNDk1Y2YtY2MwMS00MjJjLWFjNDYtZTg4YzVhNGQ4MTg4IiwibmFtZSI6IkRFTU8gVVNFUiIsImdpdmVuX25hbWUiOiJERU1PIiwiZmFtaWx5X25hbWUiOiJVU0VSIiwiZW1haWxzIjpbIkVuc2FydGVzdEBnbWFpbC5jb20iXSwidGZwIjoiQjJDXzFfU2lnbkluIiwiYXRfaGFzaCI6Ino3dXRYRFBRclRtSDA0TFdOS0RGSlEiLCJuYmYiOjE2OTYwNjU1NzF9.nh6ZyenwNiNzeIp-AW8KLNhw5BQEGKXETauog7AoeLlk-IekrgeoBY01ydJGiK6QXTOFx5U01xCUCtGSHKTzo_VGbd6g-WEvu6vX02ua1sbJROQxtTTcec_2AVQAyX0DQ80kURZrJluSvHLlog3wClKVEmKvto6pVRF-sLzNv6nSSFx45bPt4-AO2CcDG2GRQl4i2fbbxVkhuOb10XQJlMwoItumxQemCKqi0BmomNlEb2tE8aB2rnilYH1D9eVUM203C4nhWIoXuLU4nnM6lZq-GhxwGcfoBjI-gEGD_BGUtImbgoZr3iNmZBbnJxBZIp3h5nEmNy3FclVgCeTk6Q'
    };
    const params = {
      idCompany: idCompany.toString()
    };
    const costUrl = `${this.baseUrl}/CpuAnalysis/v2/${idCompany}/cost`;
    return this.http.get<any>(costUrl, { headers: headers,  params: params });
  }

  getTopOffenderValues(idCompany: number): Observable<any> {
    const headers = {
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2thbGlicjhkZXYuYjJjbG9naW4uY29tLzA5YzU4MjcxLWRjMGYtNDNiMS05NzdmLWQ5MDI5NzM0Yjg2Mi92Mi4wLyIsInN1YiI6ImE4MDQ5NWNmLWNjMDEtNDIyYy1hYzQ2LWU4OGM1YTRkODE4OCIsImF1ZCI6ImUzNTU0MDhmLWNlZmItNDYwOS1hY2E4LWE2ZjM1MWU2NmQ5NSIsImV4cCI6MTY5NjA2OTE3MSwibm9uY2UiOiIwMDU5NThiNC1mOWQ5LTQxOTctYmUyZC04YWRjNGIzN2Q5MWMiLCJpYXQiOjE2OTYwNjU1NzEsImF1dGhfdGltZSI6MTY5NjA2NTU2OSwib2lkIjoiYTgwNDk1Y2YtY2MwMS00MjJjLWFjNDYtZTg4YzVhNGQ4MTg4IiwibmFtZSI6IkRFTU8gVVNFUiIsImdpdmVuX25hbWUiOiJERU1PIiwiZmFtaWx5X25hbWUiOiJVU0VSIiwiZW1haWxzIjpbIkVuc2FydGVzdEBnbWFpbC5jb20iXSwidGZwIjoiQjJDXzFfU2lnbkluIiwiYXRfaGFzaCI6Ino3dXRYRFBRclRtSDA0TFdOS0RGSlEiLCJuYmYiOjE2OTYwNjU1NzF9.nh6ZyenwNiNzeIp-AW8KLNhw5BQEGKXETauog7AoeLlk-IekrgeoBY01ydJGiK6QXTOFx5U01xCUCtGSHKTzo_VGbd6g-WEvu6vX02ua1sbJROQxtTTcec_2AVQAyX0DQ80kURZrJluSvHLlog3wClKVEmKvto6pVRF-sLzNv6nSSFx45bPt4-AO2CcDG2GRQl4i2fbbxVkhuOb10XQJlMwoItumxQemCKqi0BmomNlEb2tE8aB2rnilYH1D9eVUM203C4nhWIoXuLU4nnM6lZq-GhxwGcfoBjI-gEGD_BGUtImbgoZr3iNmZBbnJxBZIp3h5nEmNy3FclVgCeTk6Q'
    };
    const params = {
      idCompany: idCompany.toString()
    };
    const url = `${this.baseUrl}/CpuAnalysis/v2/${idCompany}/topoffenders`;
    return this.http.get<any>(url, { headers: headers,  params: params });
  }

  getUsageAverageValues(idCompany: number): Observable<any> {
    const headers = {
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2thbGlicjhkZXYuYjJjbG9naW4uY29tLzA5YzU4MjcxLWRjMGYtNDNiMS05NzdmLWQ5MDI5NzM0Yjg2Mi92Mi4wLyIsInN1YiI6ImE4MDQ5NWNmLWNjMDEtNDIyYy1hYzQ2LWU4OGM1YTRkODE4OCIsImF1ZCI6ImUzNTU0MDhmLWNlZmItNDYwOS1hY2E4LWE2ZjM1MWU2NmQ5NSIsImV4cCI6MTY5NjA2OTE3MSwibm9uY2UiOiIwMDU5NThiNC1mOWQ5LTQxOTctYmUyZC04YWRjNGIzN2Q5MWMiLCJpYXQiOjE2OTYwNjU1NzEsImF1dGhfdGltZSI6MTY5NjA2NTU2OSwib2lkIjoiYTgwNDk1Y2YtY2MwMS00MjJjLWFjNDYtZTg4YzVhNGQ4MTg4IiwibmFtZSI6IkRFTU8gVVNFUiIsImdpdmVuX25hbWUiOiJERU1PIiwiZmFtaWx5X25hbWUiOiJVU0VSIiwiZW1haWxzIjpbIkVuc2FydGVzdEBnbWFpbC5jb20iXSwidGZwIjoiQjJDXzFfU2lnbkluIiwiYXRfaGFzaCI6Ino3dXRYRFBRclRtSDA0TFdOS0RGSlEiLCJuYmYiOjE2OTYwNjU1NzF9.nh6ZyenwNiNzeIp-AW8KLNhw5BQEGKXETauog7AoeLlk-IekrgeoBY01ydJGiK6QXTOFx5U01xCUCtGSHKTzo_VGbd6g-WEvu6vX02ua1sbJROQxtTTcec_2AVQAyX0DQ80kURZrJluSvHLlog3wClKVEmKvto6pVRF-sLzNv6nSSFx45bPt4-AO2CcDG2GRQl4i2fbbxVkhuOb10XQJlMwoItumxQemCKqi0BmomNlEb2tE8aB2rnilYH1D9eVUM203C4nhWIoXuLU4nnM6lZq-GhxwGcfoBjI-gEGD_BGUtImbgoZr3iNmZBbnJxBZIp3h5nEmNy3FclVgCeTk6Q'
    };
    const params = {
      idCompany: idCompany.toString()
    };
    const url = `${this.baseUrl}/CpuAnalysis/v2/${idCompany}/usageaverage`;
    return this.http.get<any>(url, {  headers: headers,  params: params });
  }

  getUsageAnalysis(idCompany: number, referenceDate: Date): Observable<any> {
    const url = `${this.baseUrl}/CpuAnalysis/v2/${idCompany}/usageanalysis`;
    const params = { ...this.getParams(idCompany), referenceDate: referenceDate.toISOString() };
    return this.http.get<any>(url, { headers: this.getHeaders(), params: params });
  }


  getPeakUsage(idCompany: number, referenceDate: Date): Observable<any> {
    const url = `${this.baseUrl}/CpuAnalysis/v2/${idCompany}/peakinstance`;
    const params = { ...this.getParams(idCompany), referenceDate: referenceDate.toISOString() };
    return this.http.get<any>(url, { headers: this.getHeaders(), params: params });
  }

  getIdleUsage(idCompany: number, referenceDate: Date): Observable<any> {
    const url = `${this.baseUrl}/CpuAnalysis/v2/${idCompany}/idleinstance`;
    const params = { ...this.getParams(idCompany), referenceDate: referenceDate.toISOString() };
    return this.http.get<any>(url, { headers: this.getHeaders(), params: params });
  }
  private getHeaders(): any {
    return {
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2thbGlicjhkZXYuYjJjbG9naW4uY29tLzA5YzU4MjcxLWRjMGYtNDNiMS05NzdmLWQ5MDI5NzM0Yjg2Mi92Mi4wLyIsInN1YiI6ImE4MDQ5NWNmLWNjMDEtNDIyYy1hYzQ2LWU4OGM1YTRkODE4OCIsImF1ZCI6ImUzNTU0MDhmLWNlZmItNDYwOS1hY2E4LWE2ZjM1MWU2NmQ5NSIsImV4cCI6MTY5NjA2OTE3MSwibm9uY2UiOiIwMDU5NThiNC1mOWQ5LTQxOTctYmUyZC04YWRjNGIzN2Q5MWMiLCJpYXQiOjE2OTYwNjU1NzEsImF1dGhfdGltZSI6MTY5NjA2NTU2OSwib2lkIjoiYTgwNDk1Y2YtY2MwMS00MjJjLWFjNDYtZTg4YzVhNGQ4MTg4IiwibmFtZSI6IkRFTU8gVVNFUiIsImdpdmVuX25hbWUiOiJERU1PIiwiZmFtaWx5X25hbWUiOiJVU0VSIiwiZW1haWxzIjpbIkVuc2FydGVzdEBnbWFpbC5jb20iXSwidGZwIjoiQjJDXzFfU2lnbkluIiwiYXRfaGFzaCI6Ino3dXRYRFBRclRtSDA0TFdOS0RGSlEiLCJuYmYiOjE2OTYwNjU1NzF9.nh6ZyenwNiNzeIp-AW8KLNhw5BQEGKXETauog7AoeLlk-IekrgeoBY01ydJGiK6QXTOFx5U01xCUCtGSHKTzo_VGbd6g-WEvu6vX02ua1sbJROQxtTTcec_2AVQAyX0DQ80kURZrJluSvHLlog3wClKVEmKvto6pVRF-sLzNv6nSSFx45bPt4-AO2CcDG2GRQl4i2fbbxVkhuOb10XQJlMwoItumxQemCKqi0BmomNlEb2tE8aB2rnilYH1D9eVUM203C4nhWIoXuLU4nnM6lZq-GhxwGcfoBjI-gEGD_BGUtImbgoZr3iNmZBbnJxBZIp3h5nEmNy3FclVgCeTk6Q'
    };
  }

  private getParams(idCompany: number): any {
    return {
      idCompany: idCompany.toString()
    };
  }
}