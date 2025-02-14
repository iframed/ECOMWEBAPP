import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  handlelogout() {
    this.isAuthenticated=false;
    this.accessToken=undefined;
    this.email=undefined;
    this.roles=undefined;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('access-token');
      localStorage.removeItem('roles');
    }
   }
 
   isAuthenticated : boolean=false;
   roles : any;
   email : any;
   accessToken! : any;
   redirectUrl?: string;
 
 
 loadProfile(data: any) {
 
   this.isAuthenticated= true;
   this.accessToken = data['access-token'];
   console.log("Access token:", this.accessToken);
   let decodedJwt : any = jwtDecode(this.accessToken);
   this.email = decodedJwt.sub;
   //this.roles = decodedJwt.scope;
   this.roles = decodedJwt.scope.split(' ');
 
 
   if (typeof localStorage !== 'undefined') {
    localStorage.setItem('access-token', this.accessToken);
    localStorage.setItem('roles', JSON.stringify(this.roles));
  }
   
  
 }
 
 isAdmin(): boolean {
   return this.roles && this.roles.includes('ADMIN');
 }
 
 loadStoredProfile() {
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('access-token');
    const roles = localStorage.getItem('roles');

 
   if (token && roles) {
     this.isAuthenticated = true;
     this.accessToken = token;
     this.roles = JSON.parse(roles);
   }
 }
}
 constructor(private http:HttpClient){
 
   this.loadStoredProfile(); 
 }
 
 public login(email : string, password :string){
 
 
   let params = new HttpParams().set("email",email).set("password", password);
   let options = {
     headers : new HttpHeaders().set("Content-Type","application/x-www-form-urlencoded")
   }    
                   
  
   return this.http.post("http://localhost:85/auth/login", params , options )
 
 }
 
 getUserEmail(): string | null {
   return this.email;
 }
 
 
 logout() {
   this.handlelogout();
 }



 /*getUserId(): string {
  if (this.email) {
    return this.email; // Retourne l'email comme identifiant unique
  }
  return localStorage.getItem('userId') || ''; // Sinon, cherche un userId dans localStorage
}*/
getUserId(): string {
  console.log("getUserId appelé");

  if (this.email) {
    console.log("ID utilisateur depuis l'email:", this.email);  // Log de l'email
    return this.email; // Retourne l'email comme identifiant unique
  }
  console.log("ID utilisateur depuis le localStorage:", localStorage.getItem('userId'));  // Log du localStorage
  return localStorage.getItem('userId') || ''; // Sinon, cherche un userId dans localStorage
}


 
}
