## Overview
Cinematica Gracias is a [Next.js](https://nextjs.org) and Supabase project developed as an experimental concept for storing and archiving wonderful and impactful films for the future.  This was developed to store and archive data on films around the world aided with relevant data such as the directors, producers, actors, and the reviews of the users who log authenticate to this application. Compared to Netflix or IMDB, this application wasn't intended to serve as an official reference for professional critiques in judging the quality and worth of a film. In this application, people can rate and review films. 

## Creating an Account
In this application, users can have two roles. One is an **admin**, while another one is a **collaborator**. A collaborator can view film, actor, director, and producer data within the application. They can also review and rate films. However, they cannot edit the data of these since they aren't authorized to do so.  On the other hand, Admin users have the capability to modify application data for Films, Directors, Actors, and more. However, they cannot rate or review films. 

<img width="1273" height="681" alt="Screen Shot 2025-10-20 at 12 18 53 PM" src="https://github.com/user-attachments/assets/ceeb7974-63b8-4477-b619-7326419ea368" /> <br><br>

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

### 1 to 1 Relationship

The Auth User and Users table have a one-to-one relationship through their id field. Creating an account would trigger the creation of both of these tables for one user. If the Auth User table is deleted, then the Users Table will also be deleted. 
<br><br>


### Associative Entities

#### Users, Reviews, and Films

Associative entities are present in order to represent the relationship between the interactions of two entities. Initially, these associative entities were initialized in the database with more attributes to describe the relationship of the tables but due to time constraints, these attributes were removed from the schema. The first associative entity would be the Review table. Many users can write a review for a film, and many films can be reviewed by a user. However, Users can only rate a film once. 
<br><br>
This means that when a user reviews a film after rating it from a previous review, the rating value for the current review will be **null**. This is for ensuring less clutter with the rating data in the database, and this ensures a more streamlined context for future analytics professionals when they decide to query and analyze the average user rating per film. 

<br>
#### Film and its relationship with Producers and Actors






