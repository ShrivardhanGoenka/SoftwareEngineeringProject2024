# ProfitPath

Redefining Transport and Delivery Services in Singapore

## Overview

ProfitPath is a one-of-a-kind community focused application aimed to revolutionise transportation and delivery services in Singapore. Following the “Carousell” model of buyer and seller which had earlier reshaped retail and the second-hand product market in Singapore, ProfitPath allows users to be both passengers and drivers, enhancing user engagement through a versatile platform. 

One of the key features of ProfitPath is to allow users to earn money by providing transport and delivery services on daily commutes! This idea harmonises with the Smart Nation initiative of the Singapore Government, by not only enabling a “people-centric” model that employs digital technology to improve people’s lives, it also aligns with the Green Nation goal by reducing carbon emissions and thus, Singapore’s carbon footprint as a whole. ProfitPath serves as a catalyst for socio-economic transformation by encouraging innovative approaches to regular commuting and offering people a chance to earn money by helping the community and the environment at large!

ProfitPath also provides an invaluable solution for individual transport and delivery needs. Users can access cheap and fast transport services or have their goods delivered in a cost-effective manner. 

## Live Application

The ProfitPath application is live and can be accessed [here](https://smart-xplorers.vercel.app/). Please note that the backend of the application is not live as the backend costs were too high. 

## Software Requirement Specifications (SRS)

The Software Requirement Specifications (SRS) document outlines the requirements for the ProfitPath application. It provides a detailed description of the system’s functional and non-functional requirements, including the user interface, system features, and constraints. The SRS document serves as a blueprint for the development team to design, implement, and test the application. 

The SRS document which the team prepared laid out the following final requirements for the ProfitPath application. The documents were split into 3 parts: 
1. Pre-development
2. Development
3. Post-development

### Pre-development

The following documents were prepared before the development of the ProfitPath application began to assist the team in the planning and design phase of the project: 
1. Use Case Model - This document outlines the various use cases of the ProfitPath application. It contains detailed descriptions of the interactions between the users and the system. There is also a use case diagram that visually represents the relationships between the actors and the system.
    
    The Use Case Model can be found [here](./Pre-Development/Use%20Case%20Model/)

    This folder contains the [Use Case Diagram](./Pre-Development/Use%20Case%20Model/Use%20Case%20Diagram.pdf) and the [Use Case Descriptions](./Pre-Development/Use%20Case%20Model/Use%20Case%20Descriptions.pdf)

2. UI Mockup - The team then proceeded to build a UI Mockup to visualise the design and layout of the ProfitPath application. The UI Mockup provides a visual representation of the user interface, including the screens, buttons, and navigation flow. Please note that the UI Mockup made at this point was not the final design of the application. It was a basic wireframe to help the team understand the layout of the application.

    The UI Mockup can be found [here](./Pre-Development/UI%20Mockup/)

    This folder contains the [UI Mockup](./Pre-Development/UI%20Mockup/UI%20Mockup.pdf)

    All images used in the UI Mockup can be found [here](./Pre-Development/UI%20Mockup/UI%20Images/)

3. After finishing the requirements, the team proceeded to create the Sequence Diagrams to correspond with the Use Case Model. The Sequence Diagrams provide a visual representation of the interactions between the actors and the system. It shows the sequence of messages exchanged between the objects in the system.

    The Sequence Diagrams can be found [here](./Pre-Development/Static%20Models/Sequence%20Diagrams.pdf)

4. The team also prepared a Stereotype Diagram to provide a visual representation of the classes and their relationships in the ProfitPath application. The Stereotype Diagram helps the team understand the structure of the system and the relationships between the classes.

    The Stereotype Diagram can be found [here](./Pre-Development/Static%20Models/Stereotype%20Diagram.pdf)

5. The team also prepared an Entity Class Diagram to show the different entities, their attributes and their relationship with each other. This diagram later helped us in creating the Entity Relationship Diagram which we used to create the database schema in the Django application.

    The Entity Class Diagram can be found [here](./Pre-Development/Static%20Models/Entity%20Class%20Diagram.pdf)

6. Finally, the team also prepared a Dialog Map to better illustrate the UI of the application. 

    The Dialog Map can be found [here](./Pre-Development/Static%20Models/Dialog%20Map.pdf)

### Development

#### Technology Stack

After the planning and design phase, the team proceeded to the technology stack used in the development of the ProfitPath application. 

1. The frontend is written in React with the help of Tailwind CSS for styling. The JSX code encapsulates both the View and the Controller of the application. We adhered to good coding practices and split the code into components to make it more modular and reusable. The frontend communicates with the backend through RESTful APIs. The frontend is hosted on Vercel. 

2. The backend is written in Django, a high-level Python web framework. We used Django REST framework to build the RESTful APIs that the frontend communicates with. The backend is hosted on AWS EC2 instance. Using Django allowed us to build a secure backend while also adhering to good coding practices. The Models in Django allowed us to encapsulate the database schema in the form of classes and functions and interact with the database in a more object-oriented manner. This was a huge advantage as it made the code more readable and maintainable. Porting the database is also easier as Django allows the use of different databases like SQLite, MySQL, PostgreSQL, etc while maintaining the same codebase. This enhanced portability and scalability.

3. The database is PostgreSQL, a powerful, open-source object-relational database system. We used PostgreSQL as it is highly scalable and has strong support for ACID transactions. The database is hosted on Aiven Cloud which provides a secure and reliable database service. There is a 99% uptime guarantee and the data is encrypted at rest and in transit which ensured the security and integrity of the data.

#### System architecture

After finalising the technology, the team proceeded to design the system architecture of the ProfitPath application. The system architecture diagram provides a high-level overview of the system’s components and their interactions. It shows the relationship between the frontend, backend, and database, and how they communicate with each other. Each component is clearly defined, and the flow of data is illustrated and labelled. The system architecture diagram helps the team understand the structure of the system and how the components work together to deliver the desired functionality.

The System Architecture Diagram can be found [here](./Development/System%20Architecture.pdf)

#### Development

The developement took place in the following stages: 

1. Stage 1: Isolated development of the frontend and backend: 
    - The backend was developed in the form of RESTful APIs using the Django REST framework. The APIs were tested using Postman to ensure that they were working as expected(Unit testing).

    - The frontend was developed in React with the help of Tailwind CSS for styling. The frontend was tested using Jest and React Testing Library to ensure that the components were rendering correctly and the functionality was working as expected(Unit testing).

2. Stage 2: Preparation of API Reference:
    - After preparing the APIs, the team proceeded to prepare the API Reference document. The API Reference document provides a detailed description of the RESTful APIs used in the ProfitPath application. It includes the API endpoints, request and response formats, and the parameters required for each API. The API Reference document serves as a guide for the development team to understand and implement the APIs in the frontend and backend.

    The API Reference document can be found [here](./Development/API%20Reference.pdf)

3. Stage 3: Integration of the frontend and backend:
    - After the frontend and backend were developed and tested, the team proceeded to integrate the two components. The frontend was connected to the backend using the RESTful APIs. The frontend made requests to the backend to fetch data and update the UI. The integration was tested to ensure that the frontend and backend were communicating correctly and the application was working as expected.

4. Stage 4: Testing:
    - After the integration was complete, the team proceeded to test the application as a whole. The team conducted black box and white box testing to ensure that the application was functioning correctly and all the requirements were met. 

    The Test plan document along with the results can be found [here](./Development/Test%20Cases.pdf)

5. Stage 5: Deployment:

    - After the testing was complete and the application was working as expected, the team proceeded to deploy the application. The frontend was hosted on Vercel and the backend was hosted on an AWS EC2 instance. The database was hosted on Aiven Cloud. The deployment was successful and the application was live and accessible to users. 

#### Source Code

The source code for the ProfitPath application can be found [here](./Development/Source%20Code/)

There is a [Getting Started](./Development/Source%20Code/Getting%20Started.md) guide available in the Source Code folder to help set up the application on a local machine.

### Post-development

After the development of the ProfitPath application was complete, as specified in the SRS document, the team proceeded to prepare a user manual and a demo video to help users understand how to use the application.

The User Manual can be found [here](./Post-Development/User%20Manual.pdf)

The Demo Video is hosted on Youtube can be found [here](https://youtu.be/t-gbtWf5HIU)

## Conclusion

The ProfitPath application is a revolutionary platform that aims to redefine transportation and delivery services in Singapore. By allowing users to be both passengers and drivers, ProfitPath enhances user engagement and offers a versatile platform for users to earn money by providing transport and delivery services on daily commutes. The application aligns with the Smart Nation initiative of the Singapore Government and serves as a catalyst for socio-economic transformation by encouraging innovative approaches to regular commuting. ProfitPath provides an invaluable solution for individual transport and delivery needs, offering cheap and fast transport services and cost-effective delivery options. The application is live and accessible to users, and the team is committed to continuously improving and enhancing the platform to meet the evolving needs of the community.
