## Overview
Cinematica Gracias is a [Next.js](https://nextjs.org) and Supabase project developed as an experimental concept for storing and archiving wonderful and impactful films for the future.  This was developed to store and archive data on films around the world aided with relevant data such as the directors, producers, actors, and the reviews of the users who log authenticate to this application. Compared to Netflix or IMDB, this application wasn't intended to serve as an official reference for professional critiques in judging the quality and worth of a film. In this application, people can rate and review films. 

<img width="1277" height="687" alt="image" src="https://github.com/user-attachments/assets/268a7e23-304c-4510-835e-38ba2e72b660" />


## Creating an Account
In this application, users can have two roles. One is an **admin**, while another one is a **collaborator**. A collaborator can view film, actor, director, and producer data within the application. They can also review and rate films. However, they cannot edit the data of these since they aren't authorized to do so.  On the other hand, Admin users have the capability to modify application data for Films, Directors, Actors, and more. However, they cannot rate or review films. An anonymous user has to signup to be a collaborator in order to post reviews for films.

<img width="1280" height="688" alt="image" src="https://github.com/user-attachments/assets/785a113c-314a-4d58-a59d-2ffe81edac78" />

<br><br>

You must provide the required data, and data validation is present to ensure the appropriateness of your user data. You have to press the toggle to determine if you are an admin or non-admin user. After you signup, you will be redirected to a success page indicating that you're also logged-in after signing up.
<br><br>
<img width="1280" height="689" alt="image" src="https://github.com/user-attachments/assets/5728eec0-6892-4ea0-b26a-5a2d8c060249" />
<br><br>

You will then be redirected to the Films page which displays the films stored/archived. <br><br>

<img width="1280" height="688" alt="image" src="https://github.com/user-attachments/assets/85b43993-2f7c-4652-94b8-9280377a7e26" />

<br><br>


## Data Model

### Entity-Relationship Diagram
<br>
<img width="1691" height="871" alt="GoRocky drawio (2)" src="https://github.com/user-attachments/assets/4266b788-52a7-4110-80c7-262fb74ffac3" />
<br><br>

The **Users** table is separate from the **Auth User** Table. The Auth User table is Supabase's built-in table with its own built-in schemas and rules. The Auth User table is used for authentication and authorization across the application's lifecycle. On the other hand, the Users table is the custom User table developed for storing personal data. The Users table will interact with other entities in order to view and modify application data. Both **collaborators** and **admins** utilize the Auth User and Users tables. <br><br>

### User and Auth User

The Auth User and Users table have a one-to-one relationship through their id field. Creating an account would trigger the creation of both of these tables for one user. If the Auth User table is deleted, then the Users Table will also be deleted. 
<br><br>


### Associative Entities

#### Users, Reviews, and Films

Associative entities are present in order to represent the relationship between the interactions of two entities. Initially, these associative entities were initialized in the database with more attributes to describe the relationship of the tables but due to time constraints, these attributes were removed from the schema. The first associative entity would be the Review table. Many users can write a review for a film, and many films can be reviewed by a user. However, Users can only rate a film once, but they can provide several reviews to the same film.
<br><br>
This means that when a user reviews a film after rating it from a previous review, the rating value for the current review will be **null**. This is for ensuring less clutter with the rating data in the database, and this ensures a more streamlined context for future analytics professionals when they decide to query and analyze the average user rating per film. 
<br><br>

#### Film and its relationship with Producers and Actors

Film will always be comprised of several components such as the production equipment, the script, the budget allocated, and the decisions taken for the filming of the scenes. Producers and Actors are associated with the films they worked on. A Producer and Actor can be part of several films, and a film can contain several producers and actors. 

#### Others

Last but not the least, a many to one relationship exists between the **Director** and a **Film**. A film is mostly directed by one authority, but a director can direct multiple films. 


## Project Setup

In order to run the project locally, a Supabase URL and a Supabase Anonymous key are needed. These are set as environmental variables to be utilized by the front-end component that's calling the Supabase Client. The Supabase Client requires both of these environmental variables in order to perform the following:
- CRUD Operations
- Data Querying
- Auth User Operations
and much more.
<br><br>

The actual schema of this application was developed using PostgreSQL scripting. These scripts are saved in the Data Definition Query file provided on the `/Database` directory within the `/app` directory. This file contains `CREATE` and `DELETE` statements for ease of developing tables and removing rows from these tables. <br><br>

### Running the Server

Enter the root directory of the application, `/cinematicagracias`, and build the project to generate an optimized production build by executing `npm run build`. Afterwards, execute `npm run start` to start the application in production mode. 


### Feature Mapping

#### Requirement: The admin must be able to Create, Record, Update, and Delete application data<br>
Features Implemented
- CRUD functionalities for Producer entity
- CRUD functionalities for Director entity
- CRUD functionalities for Actor entity
- CRUD functionalities for Film entity
- All of these functionalities are accompanied with data validation
<br><br>

Samples:

<img width="1280" height="688" alt="image" src="https://github.com/user-attachments/assets/52c0f686-143f-45e1-a14f-fd8eefdd5319" />
<br>
<img width="1279" height="689" alt="image" src="https://github.com/user-attachments/assets/1c4bf497-e2bb-4aee-9549-09150ade13c4" />
<br>
<img width="1280" height="689" alt="image" src="https://github.com/user-attachments/assets/f2594f62-cf47-4b54-b3b2-a0720e83ed67" />
<br>
<img width="1279" height="690" alt="image" src="https://github.com/user-attachments/assets/1e4e4078-33d3-4a17-b1a2-76a686710134" />
<br>
<img width="1279" height="690" alt="image" src="https://github.com/user-attachments/assets/fa71e7d8-7e71-4b8c-a85a-0c68dc22adb2" />
<br>
<img width="1279" height="690" alt="image" src="https://github.com/user-attachments/assets/16e01955-10d9-4b02-ab72-f6b760a7802d" />
<br>
<img width="1280" height="690" alt="image" src="https://github.com/user-attachments/assets/a71cfd99-ddc1-4fee-9373-e5cc29ea76a7" />
<br>
<img width="1278" height="689" alt="image" src="https://github.com/user-attachments/assets/4b795224-ddfa-4298-8d98-ab20f7f60974" />
<br>
<img width="1280" height="689" alt="image" src="https://github.com/user-attachments/assets/cfe8dd49-f993-49a6-b086-787aa7d76c47" />
<br>
<img width="1280" height="691" alt="Screen Shot 2025-10-22 at 6 44 55 AM" src="https://github.com/user-attachments/assets/494ebc9d-d18c-474f-9628-e139fd816b6c" />
<br>
<img width="1278" height="691" alt="image" src="https://github.com/user-attachments/assets/f47127cb-27e4-42e8-8c4a-73beffa119c0" />
<br>

#### Requirement: A user should be able to create an account<br>
Feature Implemented
- User can signup using the signup page
- contains data validation


#### Requirement: The admin, collaborator, or an anonymous user can view films and their reviews from collaborators<br>
Feature Implemented
- View pages for Films can be accessed 
<br><br>

Samples



#### Requirements:
- The collaborator must be able to write a review for a film and rate it
- The Admin must be able to delete reviews
<br>
Feature Implemented
- Create functionality for Review entity
- Accompanied with data validation
<br><br>
<img width="1280" height="690" alt="image" src="https://github.com/user-attachments/assets/68c63823-6e44-47c3-a71a-910a8c687e99" /> <br>
<img width="1276" height="692" alt="image" src="https://github.com/user-attachments/assets/a3661bbe-c3ae-4966-b729-56305a82f9cb" />


##### Requirements that aren't mapped with a feature (as of writing in 10/22/2025)
- The collaborator must be able to edit and delete his/her review
- The average user rating of a film must change based on the rating provided by the user
  - It can be through a PostgreSQL view implementation for average rating calculation
- The user must be able to edit his/her account details
- The admin must be able to add images for a Film, Producer, Actor, and Director entity
<br><br>


## AI Tools used
The only AI tool used for this project is the free version of ChatGPT. This was mostly used for debugging Typescript errors
<br>

## What's Next
This project will be continued in the future in order to imbibe new UX principles and optimize the Typescript code used, especially in CRUD-heavy files







