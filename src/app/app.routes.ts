import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

import { DashboardComponent } from './pages/dashboard/dashboard';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

//Users
import { Users } from './pages/users/users';
import { AddUser } from './pages/users/add-user/add-user';

//Premium payments
import { PremiumPayments } from './pages/premium-payments/premium-payments';
import { AddPremiumPaymentComponent } from './pages/premium-payments/add-premium-payment/add-premium-payment';
import { ViewPremiumPaymentComponent } from './pages/premium-payments/view-premium-payment/view-premium-payment';

//Customers
import { ViewCustomer } from './pages/customers/customers';
import { AddCustomer } from './pages/customers/add-customer/add-customer';
import { MyProfile } from './pages/customers/my-profile/my-profile';
import { EditProfile } from './pages/customers/edit-profile/edit-profile';

//Insurance products
import { ViewProduct } from './pages/products/products';
import { AddProduct } from './pages/products/add-product/add-product';
import { EditProduct } from './pages/products/edit-product/edit-product';

//Policy Plans
import { PolicyPlans } from './pages/policy-plans/policy-plans';
import { AddPolicyPlan } from './pages/policy-plans/add-policy-plan/add-policy-plan';
import { EditPolicyPlan } from './pages/policy-plans/edit-policy-plan/edit-policy-plan';

//Claims
import { Claims } from './pages/claims/claims';
import { AddClaim } from './pages/claims/add-claim/add-claim';
import { ViewClaim } from './pages/claims/view-claim/view-claim';
import { ReviewClaim } from './pages/claims/review-claim/review-claim';
import { ClaimDecisionComponent } from './pages/claims/claim-decision/claim-decision';
import { ClaimDocuments } from './pages/claims/claim-documents/claim-documents';
import { ClaimHistory } from './pages/claims/claim-history/claim-history';
import { UploadDocument } from './pages/claims/upload-document/upload-document';

//Policies
import { Policies } from './pages/policies/policies';
import { PurchasePolicy } from './pages/policies/purchase-policy/purchase-policy';
import { IssuePolicy } from './pages/policies/issue-policy/issue-policy';

import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [

{ path:'',redirectTo:'login',pathMatch:'full'},

{ path:'login',component:Login},

{ path:'register',component:Register},

{ path:'',component:MainLayoutComponent,

children:[
{ path:'dashboard',component:DashboardComponent, canActivate: [authGuard]},

// users
{ path: 'users', component: Users, canActivate: [authGuard, roleGuard],data: { role: 'Admin' }},
{ path: 'users/add', component: AddUser,canActivate: [authGuard, roleGuard],data: { role: 'Admin' }},

// customers
{ path: 'customers', component: ViewCustomer,canActivate: [authGuard, roleGuard],data: { role: ['Admin', 'InternalStaff'] }},
{ path: 'customers/add', component: AddCustomer, canActivate: [authGuard, roleGuard],data: { role: ['Admin'] }},
{ path: 'customers/my-profile', component: MyProfile,canActivate: [authGuard, roleGuard],data: { role: ['Customer'] }},
{ path: 'customers/edit-profile', component: EditProfile, canActivate: [authGuard, roleGuard],data: { role: ['Customer'] }},

// policies
{ path: 'policies',component: Policies,canActivate: [authGuard]},
{ path: 'policy-purchase', component: PurchasePolicy, canActivate: [authGuard, roleGuard],data: { role: 'Customer' }},
{ path: 'policy-issue',component: IssuePolicy, canActivate: [authGuard, roleGuard],data: { role: ['Admin','InternalStaff']}},

//Policy plans

{ path: 'policy-plans', component: PolicyPlans, canActivate: [authGuard, roleGuard], data: { role: ['Admin', 'InternalStaff', 'Customer'] }},
{ path: 'policy-plans/add', component: AddPolicyPlan, canActivate: [authGuard, roleGuard],data: { role: 'Admin' }},
{ path: 'policy-plans/edit/:id', component: EditPolicyPlan, canActivate: [authGuard, roleGuard],data: { role: 'Admin' }},

//Premium Payments
{ path: 'premium-payments', component: PremiumPayments,canActivate: [authGuard]},
{ path: 'premium-payments/add', component: AddPremiumPaymentComponent,canActivate: [authGuard, roleGuard],data: { role: 'Customer' }},
{ path: 'premium-payments/view/:id',component: ViewPremiumPaymentComponent,canActivate: [authGuard]},

//Insurance Products

{ path: 'products', component: ViewProduct, canActivate: [authGuard, roleGuard],data: { role: ['Admin', 'InternalStaff'] }},
{ path: 'products/edit/:id', component: EditProduct, canActivate: [authGuard, roleGuard],data: { role: 'Admin' }},
{ path: 'products/add', component: AddProduct, canActivate: [authGuard, roleGuard],data: { role: 'Admin' }},

// Claims 
{ path: 'claims',component: Claims,canActivate: [authGuard]},
{ path: 'claims/add', component: AddClaim,canActivate: [authGuard, roleGuard],data: { role: 'Customer' }},
{ path: 'claims/view/:id',component: ViewClaim,canActivate: [authGuard]},
{ path: 'claims/review/:id', component: ReviewClaim, canActivate: [authGuard, roleGuard],data: { role: 'InternalStaff' }},
{ path: 'claims/decision/:id', component: ClaimDecisionComponent,canActivate: [authGuard, roleGuard],data: { role: 'Admin' }},
{ path: 'claims/documents/:id', component: ClaimDocuments,canActivate: [authGuard]},
{ path: 'claims/upload-document/:id', component: UploadDocument, canActivate: [authGuard]},
{ path: 'claims/history/:id', component: ClaimHistory,canActivate: [authGuard]},
]
},

{
path:'**',
redirectTo:'login'
}

];