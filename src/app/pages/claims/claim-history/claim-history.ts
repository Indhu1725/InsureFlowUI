import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClaimService } from '../../../services/claim';
import { ClaimHistoryResponse } from '../../../models/claim-history-response';

@Component({
  selector: 'app-claim-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AsyncPipe
  ],
  templateUrl: './claim-history.html',
  styleUrl: './claim-history.css'
})
export class ClaimHistory implements OnInit {

  claimId = 0;

  history$!: Observable<ClaimHistoryResponse[]>;

  constructor(
    private route: ActivatedRoute,
    private claimService: ClaimService
  ) { }

  ngOnInit(): void {

    this.claimId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.history$ = this.claimService
      .getHistory(this.claimId)
      .pipe(
        map((response: any) => response.data ?? [])
      );

  }

}