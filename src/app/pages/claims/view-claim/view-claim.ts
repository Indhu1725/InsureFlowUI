import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';

import { ClaimService } from '../../../services/claim';
import { ClaimResponse } from '../../../models/claim-response';

@Component({
  selector: 'app-view-claim',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AsyncPipe
  ],
  templateUrl: './view-claim.html',
  styleUrl: './view-claim.css'
})
export class ViewClaim implements OnInit {

  claim$!: Observable<ClaimResponse>;

  constructor(
    private route: ActivatedRoute,
    private claimService: ClaimService
  ) { }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.loadClaim(id);

  }

  loadClaim(id: number): void {

    this.claim$ = this.claimService.getClaimById(id).pipe(

      map((response: any) => response.data)

    );

  }

}