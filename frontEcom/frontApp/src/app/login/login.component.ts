import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userFormGroup1! : FormGroup;


constructor( private fb: FormBuilder ,
             private auth : AuthService ,
             private router : Router){ }



ngOnInit(): void {
  this.userFormGroup1=this.fb.group({
   email : this.fb.control(""),
   password : this.fb.control(""),
  })

 }

 handlelogin() {

  let email= this.userFormGroup1.value.email;
  let password= this.userFormGroup1.value.password;

   this.auth.login(email,password).subscribe({

    next : data => {
     
      this.auth.loadProfile(data);
      this.router.navigateByUrl("/category/1");
      
    },

    error : err =>{
      console.log(err);
    }
    
    
    
   })


 }
}
