import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 private baseUrl = 'http://localhost:85/auth';
 //private baseUrl = environment.apiUrl;

 constructor(private http: HttpClient) { }

public registerUser(user: User): Observable<any> {
 const formData = new FormData();
 formData.append('name', user.name);
 
 formData.append('email', user.email);
 formData.append('password', user.password);

  
//'Content-Type', 'application/x-www-form-urlencoded'
  

 const options = {
   headers: new HttpHeaders()
 };
 
 return this.http.post('http://localhost:85/auth/save', formData, options);
}


/*submitUserData(userData: any): Observable<any> {
 return this.http.post(`${this.baseUrl}/user`, userData);
}
*/

submitClientData(clientData: any): Observable<any> {
 const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 return this.http.post(`${this.baseUrl}/auth/create`, JSON.stringify(clientData), { headers });
}


getUserData(): Observable<any> {
 return this.http.get<any>(`${this.baseUrl}/auth/client`);
}
}
