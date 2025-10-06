# Fitness App Microservices

A comprehensive full-stack fitness application built using Java Spring Boot microservices architecture, featuring AI-powered recommendations, user activity tracking, and secure authentication.

## Project Overview

This project demonstrates a production-ready microservices architecture for a fitness application. It includes user management, activity tracking, AI-based recommendations, and a modern React frontend. The system uses Spring Cloud for service discovery, configuration management, and API gateway, with MongoDB for data storage and RabbitMQ for asynchronous messaging.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│────│   API Gateway   │────│  Eureka Server  │
│     (Port 3000) │    │    (Port 8080)  │    │   (Port 8761)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Service   │    │ Activity Service│    │   AI Service    │
│                 │    │   (Port 8082)   │    │   (Port 8083)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐    ┌─────────────────┐
                    │   Config Server │    │   MongoDB       │
                    │   (Port 8888)   │    │   (Port 27017)  │
                    └─────────────────┘    └─────────────────┘
                                             │
                    ┌─────────────────┐      │
                    │   RabbitMQ      │◄─────┘
                    │   (Port 5672)   │
                    └─────────────────┘
```

## Services

### Eureka Server (Port 8761)
- Service discovery and registration
- All microservices register themselves here for load balancing and communication

### Config Server (Port 8888)
- Centralized configuration management
- Provides configuration for all services via native file system

### API Gateway (Port 8080)
- Single entry point for all client requests
- Routes requests to appropriate services
- Integrated with Keycloak for OAuth2/JWT authentication
- Load balancing using Eureka

### User Service
- User management and authentication
- Integrates with Keycloak for identity management

### Activity Service (Port 8082)
- Manages fitness activities (workouts, exercises)
- Stores data in MongoDB
- Publishes activity events to RabbitMQ

### AI Service (Port 8083)
- Provides AI-powered fitness recommendations
- Uses Google Gemini API for intelligent suggestions
- Consumes activity events from RabbitMQ
- Stores recommendations in MongoDB

### Frontend (Port 3000)
- React application with Material-UI
- State management with Redux Toolkit
- OAuth2 authentication flow
- Communicates with backend via API Gateway

## Technology Stack

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Spring Cloud (Eureka, Config, Gateway)**
- **Spring Data MongoDB**
- **Spring AMQP (RabbitMQ)**
- **Spring Security OAuth2**

### Frontend
- **React 19**
- **Vite** (build tool)
- **Material-UI** (component library)
- **Redux Toolkit** (state management)
- **React Router** (routing)
- **Axios** (HTTP client)

### Infrastructure
- **MongoDB** (NoSQL database)
- **RabbitMQ** (message broker)
- **Keycloak** (identity and access management)
- **Google Gemini API** (AI recommendations)

## Prerequisites

Before running the application, ensure you have the following installed:

1. **Java 17 or higher**
2. **Maven 3.6+**
3. **MongoDB** (running on localhost:27017)
4. **RabbitMQ** (running on localhost:5672 with default credentials)
5. **Keycloak** (running on localhost:8181 with realm 'fitness-oauth2')
6. **Node.js 18+** and **npm** (for frontend)
7. **Google Gemini API Key** (set as environment variable GEMINI_API_KEY)

## How to Run

### 1. Start Infrastructure Services

```bash
# Start MongoDB
mongod

# Start RabbitMQ
rabbitmq-server

# Start Keycloak
# Configure realm 'fitness-oauth2' with appropriate clients and users
```

### 2. Start Microservices

Start services in the following order:

```bash
# 1. Eureka Server
cd eureka
mvn spring-boot:run

# 2. Config Server
cd ../configserver
mvn spring-boot:run

# 3. User Service
cd ../userservice
mvn spring-boot:run

# 4. Activity Service
cd ../activityservice
mvn spring-boot:run

# 5. AI Service
cd ../aiservice
mvn spring-boot:run

# 6. API Gateway
cd ../gateway
mvn spring-boot:run
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Config Server**: http://localhost:8888

## Application Flow

1. **User Authentication**: User logs in via Keycloak OAuth2 flow in the React frontend
2. **API Requests**: Frontend sends authenticated requests to API Gateway
3. **Request Routing**: Gateway validates JWT tokens and routes requests to appropriate services
4. **Service Discovery**: Gateway uses Eureka to discover service instances
5. **Business Logic**: Services process requests, interact with MongoDB, and publish events to RabbitMQ
6. **AI Processing**: AI Service consumes activity events and generates recommendations using Gemini API
7. **Data Persistence**: All services store data in respective MongoDB databases
8. **Response**: Processed data flows back through Gateway to frontend

## API Endpoints

### Activity Service
- `GET /api/activities` - Get user activities
- `POST /api/activities` - Create new activity
- `PUT /api/activities/{id}` - Update activity
- `DELETE /api/activities/{id}` - Delete activity

### AI Service
- `GET /api/recommendations` - Get AI recommendations
- `POST /api/recommendations` - Generate new recommendation

### User Service
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Configuration

All service configurations are managed centrally in `configserver/src/main/resources/config/`. Key configurations include:

- Database connections (MongoDB)
- Message broker settings (RabbitMQ)
- Service discovery URLs (Eureka)
- Authentication settings (Keycloak)
- AI API endpoints (Gemini)

## Development

### Building Services
```bash
# Build all services
mvn clean package
```

### Running Tests
```bash
# Run tests for a specific service
cd [service-directory]
mvn test
```

### Frontend Development
```bash
cd frontend
npm run lint    # Lint code
npm run build   # Build for production
npm run preview # Preview production build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of a learning course. Please refer to the original course materials for usage policies.
