## Overview
Cinematica Gracias is a [Next.js](https://nextjs.org) and Supabase project developed as an experimental concept for storing and archiving wonderful and impactful films for the future.  This was developed to store and archive data on films around the world aided with relevant data such as the directors, producers, actors, and the reviews of the users who log authenticate to this application. Compared to Netflix or IMDB, this application wasn't intended to serve as an official reference for professional critiques in judging the quality and worth of a film. In this application, people can rate and review films. 

## Creating an Account
In this application, users can have two roles. One is an **admin**, while another one is a **collaborator**. A collaborator can view film, actor, director, and producer data within the application. They can also review and rate films. However, they cannot edit the data of these since they aren't authorized to do so.  On the other hand, Admin users have the capability to modify application data for Films, Directors, Actors, and more. However, they cannot rate or review films. 

<img width="1280" height="688" alt="image" src="https://github.com/user-attachments/assets/8563cd16-66cf-42dc-bf9c-3086ac177f63" />
<br><br>

You must provide the required data, and data validation is present to ensure the appropriateness of your user data. You have to press the toggle to determine if you are an admin or non-admin user. After you signup, you will be redirected to a success page indicating that you're also logged-in after signing up.
<br><br>
<img width="1277" height="691" alt="image" src="https://github.com/user-attachments/assets/379ea329-82e5-4724-82af-cbd56106ec34" />
<br><br>

You will then be redirected to the Films page which displays the films stored/archived. <br><br>

<img width="1280" height="689" alt="image" src="https://github.com/user-attachments/assets/1819313e-9007-4a2b-8003-090f61bc57ac" />

<br><br>


## Data Model

### Entity-Relationship Diagram
<br>
<img width="1691" height="871" alt="GoRocky drawio" src="https://github.com/user-attachments/assets/e324d8b3-7205-474c-bca3-3f808d900950" />
<br><br>

The **Users** table is separate from the **Auth User** Table. The Auth User table is Supabase's built-in table with its own built-in schemas and rules. The Auth User table is used for authentication and authorization across the application's lifecycle. On the other hand, the Users table is the custom User table developed for storing personal data. The Users table will interact with other entities in order to view and modify application data. Both **collaborators** and **admins** utilize the Auth User and Users tables. <br><br>

### User and Auth User

The Auth User and Users table have a one-to-one relationship through their id field. Creating an account would trigger the creation of both of these tables for one user. If the Auth User table is deleted, then the Users Table will also be deleted. 
<br><br>


### Associative Entities

#### Users, Reviews, and Films

Associative entities are present in order to represent the relationship between the interactions of two entities. Initially, these associative entities were initialized in the database with more attributes to describe the relationship of the tables but due to time constraints, these attributes were removed from the schema. The first associative entity would be the Review table. Many users can write a review for a film, and many films can be reviewed by a user. However, Users can only rate a film once. 
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

Requirement: The admin must be able to edit and modify application data
Features Implemented
- CRUD operations for Producer entity
- CRUD operations for Director entity
- CRUD operations for Actor entity
- CRUD operations for Film entity

Requirement: The user must be able to write a review for a film and rate it
Features Currently being Implemented
- CRUD for Review entity





