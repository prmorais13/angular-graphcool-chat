import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient) {
    this.createUser();
    this.allUsers();
  }

  private apiUrl = 'https://api.graph.cool/simple/v1/ck15oskbz4ffe0163llxtv8k7';

  allUsers(): void {
    const body = {
      query: `
        query {
          allUsers{
            id
            name
            email
          }
        }
      `
    };

    this.http
      .post(this.apiUrl, body)
      .subscribe(res => console.log('Query:', res));
  }

  createUser(): void {
    const body = {
      query: `
        mutation createNewUser($name: String!, $email: String!, $password: String!) {
          createUser(name: $name, email: $email, password: $password) {
            id
            name
            email
          }
        }
      `,
      variables: {
        name: 'Paulo Ricardo',
        email: 'ricardo06@gmail.com',
        password: 'Ricardo06'
      }
    };

    this.http
      .post(this.apiUrl, body)
      .subscribe(res => console.log('Mutation: ', res));
  }
}
