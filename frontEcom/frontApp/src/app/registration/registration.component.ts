import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  userFormGroup1! : FormGroup;
  ngOnInit(): void {

    this.userFormGroup1=this.fb.group({
      name : this.fb.control(""),
     
      email : this.fb.control(""),
      password : this.fb.control(""),
     })
  }

  
  
  constructor(private userService: UserService,private fb: FormBuilder ,private router: Router) { }
 
  
  

  register() {
    
    const user: User = this.userFormGroup1.value;

    this.userService.registerUser(user).subscribe({next: (data) => {
      console.log('User registered successfully:', data);

      // Continue avec le code après une inscription réussie
      
    },
    error: (err) => {
      if (err.status === 200) {
          // Redirection côté client
          this.router.navigate(['/login']);
          // Redirigez l'utilisateur vers l'URL spécifiée dans err.url
      } else {
          console.error('Error registering user:', err);
          // Gérer l'erreur, afficher un message à l'utilisateur, etc.
      }
  }
});
}
}
