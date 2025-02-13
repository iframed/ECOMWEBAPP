package com.example.demo.Controllers;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Dto.CustomerDTO;
import com.example.demo.Entity.Customer;
import com.example.demo.Service.UserService;
import jakarta.validation.Valid;







@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtEncoder jwtEncoder;
    
    @Autowired
    private UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }



    @PostMapping("/save")
     public String registration(@Valid @ModelAttribute("user") CustomerDTO userDto,
                           BindingResult result,
                           Model model){

                            if(userDto.getPassword() == null) {
                                result.rejectValue("password", null, "Password cannot be null");
                            }
                        
                            Customer existingUser = userService.findByCustomerEmail(userDto.getEmail());

    if(existingUser != null && existingUser.getEmail() != null && !existingUser.getEmail().isEmpty()){
        result.rejectValue("email", null,
                "There is already an account registered with the same email");
    }

    if(result.hasErrors()){
        model.addAttribute("ADMIN", userDto);
        return "/register";
    }

    userService.saveUser(userDto);
   
    
    return "redirect:/register?success";
}




@GetMapping("/users")
    public List<CustomerDTO> users(Model model) {
        return userService.findAllUsers();
    }


    @PutMapping("/{id}/roles")
    public ResponseEntity<String> updateUserRoles(@PathVariable Long id, @RequestBody List<String> newRoles) {
        try {
            userService.updateUserRole(id, newRoles);
            return ResponseEntity.ok().build(); // Retourner une réponse vide avec un statut 200
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Une erreur s'est produite lors de la mise à jour des rôles de l'utilisateur.");
        }
    }



    @PostMapping("/login")
    public Map<String,String> login(@RequestParam("email") String email, @RequestParam("password") String password) {

           Authentication  authentication =   authenticationManager.authenticate(
          
           new UsernamePasswordAuthenticationToken(email, password)
           
           );
           Instant instant=Instant.now();

           //authentication.getAuthorities().map(a->a.getAuthorities()).collect(Collectors.joining(" "));
           String scope = authentication.getAuthorities()
            .stream() // Convertir la collection en un flux
            .map(GrantedAuthority::getAuthority) // Appliquer la transformation sur chaque élément du flux
          .collect(Collectors.joining(" ")); // Collecter les éléments du flux en une chaîne de caractères
           JwtClaimsSet jwtClaimsSet=JwtClaimsSet.builder()
           .issuedAt(instant)
           .expiresAt(instant.plus(20, ChronoUnit.MINUTES))
           .subject(email)
           .claim("scope",scope)

           .build();

            JwtEncoderParameters jwtEncoderParameters=
            JwtEncoderParameters.from(
            JwsHeader.with(MacAlgorithm.HS256).build(),
            jwtClaimsSet
           );

           String  jwt = jwtEncoder.encode(jwtEncoderParameters).getTokenValue();


return Map.of("access-token",jwt);


}


}
