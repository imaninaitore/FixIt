# FixIt

## Connecting Customers with Trusted Service Providers

FixIt is a web-based service marketplace that connects customers with service providers such as plumbers, electricians, cleaners, mechanics, and other professionals.

The platform provides customers with an easier way to discover, compare, and communicate with service providers, while giving service providers a platform to showcase their services and reach potential customers.

---

## Problem

Finding reliable service providers can often be difficult. Customers may depend on recommendations from friends or spend a lot of time searching through different platforms.

Service providers also face challenges reaching new customers and establishing an online presence.

FixIt aims to bring both sides together in one platform.

---

## Solution

FixIt allows customers to search and filter available service providers based on factors such as service and location.

Customers can view provider profiles, ratings, and reviews before deciding who to contact.

Service providers can create professional profiles, communicate with customers, receive reviews, and subscribe to the platform to access its services.

---

## Features

### Customer Features

* Customer registration and login
* Secure logout
* Search for service providers
* Filter service providers
* View provider profiles
* View ratings and reviews
* Leave ratings and reviews
* Communicate with service providers
* Manage account information

### Service Provider Features

* Service provider registration and login
* Secure logout
* Create and manage a service provider profile
* Add and display services
* Receive customer messages
* Receive ratings and reviews
* Subscribe to the FixIt platform
* Manage subscription status

### Admin Features

* Manage customers
* Manage service providers
* Manage reviews and ratings
* Manage subscriptions
* Monitor platform activity
* Manage users through the admin dashboard

---

## Technology Stack

### Frontend

* React
* JavaScript
* HTML
* CSS
* React Router

### Backend

* Python
* Django
* Django REST Framework

### Database

* PostgreSQL

### Authentication

* JWT Authentication

### Communication

* REST APIs
* WebSockets / Django Channels for real-time messaging

### Payments

* Payment gateway integration for service-provider subscriptions

---

## System Architecture

```text
                    FIXIT
                      |
              React Frontend
                      |
                 REST API
                      |
             Django REST Framework
                      |
          ┌───────────┴───────────┐
          |                       |
      PostgreSQL             Django Admin
          |
      Application Data
```

---

## User Roles

FixIt has three main types of users:

### Customer

Customers use the platform to find and communicate with service providers.

### Service Provider

Service providers use FixIt to advertise their services, communicate with customers, and receive reviews.

### Administrator

Administrators manage users, service providers, reviews, subscriptions, and other platform activities.

---

## Example Services

FixIt can support different types of professionals, including:

* Plumbers
* Electricians
* Mechanics
* Cleaners
* Painters
* Carpenters
* Appliance repair technicians
* Landscapers
* Movers
* Other local service professionals

---

## Project Structure

### Backend

```text
backend/
├── accounts/
├── providers/
├── reviews/
├── messaging/
├── subscriptions/
├── payments/
└── config/
```

### Frontend

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── hooks/
│   └── routes/
└── public/
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd fixit
```

### 2. Set up the Django backend

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Create an admin account:

```bash
python manage.py createsuperuser
```

Start the Django server:

```bash
python manage.py runserver
```

### 3. Set up the React frontend

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## API

The React frontend communicates with the Django backend through REST APIs.

Example endpoints:

```text
/api/auth/register/
/api/auth/login/
/api/auth/logout/

/api/providers/
/api/providers/<id>/

/api/reviews/
/api/messages/

/api/subscriptions/
/api/payments/
```

---

## Security

FixIt is designed to protect user accounts and platform data through:

* Password hashing
* JWT authentication
* API permissions
* Role-based access
* Backend validation
* Protected API endpoints
* Environment variables for sensitive configuration

---

## Future Improvements

Possible future features include:

* Service request management
* Provider availability and booking
* Location-based provider discovery
* Email notifications
* Push notifications
* Provider verification
* Advanced provider analytics
* Customer favorites
* Service categories
* Dispute management
* Mobile application
* AI-powered provider recommendations

---

## Project Goal

The goal of FixIt is to make finding and connecting with service professionals simpler, faster, and more convenient while giving service providers better access to potential customers.

---

## License

# Author
Imani Naitore