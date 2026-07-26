import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ClaimRequest } from '../models/claim-request';
import { ClaimResponse } from '../models/claim-response';
import { ClaimReview } from '../models/claim-review';
import { ClaimDecision } from '../models/claim-decision';
import { ClaimDocumentRequest } from '../models/claim-document-request';
import { ClaimDocumentResponse } from '../models/claim-document-response';
import { ClaimHistoryResponse } from '../models/claim-history-response';
import { ClaimPaginationRequest } from '../models/claim-pagination-request';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  private apiUrl = 'https://localhost:7244/api/Claim';

  constructor(private http: HttpClient) { }

  //Get My Claims
  getMyClaims(): Observable<any> {

  return this.http.get<any>(`${this.apiUrl}/my`);

}
//Get All Claims
getAllClaims(): Observable<any> {

  return this.http.get<any>(this.apiUrl);

}
//Get Claim By Id
getClaimById(id: number): Observable<any> {

  return this.http.get<any>(`${this.apiUrl}/${id}`);

}
//Get Claim By Number
getClaimByNumber(claimNumber: string): Observable<any> {

  return this.http.get<any>(`${this.apiUrl}/number/${claimNumber}`);

}

//Get Claim by Status
getClaimsByStatus(status: string): Observable<any> {

  return this.http.get<any>(`${this.apiUrl}/status/${status}`);

}
//Create Claim
createClaim(request: ClaimRequest): Observable<any> {

  return this.http.post<any>(this.apiUrl, request);

}
//Upload Document

uploadDocument(request: ClaimDocumentRequest): Observable<any> {

  const formData = new FormData();

  formData.append('claimId',request.claimId.toString());

  formData.append('documentName',request.documentName);

  formData.append('documentType',request.documentType);

  formData.append('documentReference',request.documentReference,request.documentReference.name);

  return this.http.post<any>(`${this.apiUrl}/document`,formData);
}
//Get Documents
getDocuments(claimId: number): Observable<any> {

  return this.http.get<any>(`${this.apiUrl}/${claimId}/documents`);

}
//Get History
getHistory(claimId: number): Observable<any> {

  return this.http.get<any>(`${this.apiUrl}/${claimId}/history`);

}
//Staff Review
reviewClaim(claimId: number, request: ClaimReview): Observable<any> {

  return this.http.put<any>(`${this.apiUrl}/${claimId}/review`, request);

}
//admin decision
decideClaim(claimId: number, request: ClaimDecision): Observable<any> {

  return this.http.put<any>(`${this.apiUrl}/${claimId}/decision`, request);

}
getReviewClaims(): Observable<any> {

  return this.http.get<any>(`${this.apiUrl}/review`);

}
//Get paged Claims
getPagedClaims(request: ClaimPaginationRequest): Observable<any> {

  let params = new HttpParams()
    .set('pageNumber', request.pageNumber)
    .set('pageSize', request.pageSize)
    .set('sortBy', request.sortBy)
    .set('sortDirection', request.sortDirection);

  if (request.claimStatus) {
    params = params.set('claimStatus', request.claimStatus);
  }

  if (request.customerId) {
    params = params.set('customerId', request.customerId);
  }

  if (request.policyId) {
    params = params.set('policyId', request.policyId);
  }

  return this.http.get<any>(`${this.apiUrl}/paged`, { params });

}


}