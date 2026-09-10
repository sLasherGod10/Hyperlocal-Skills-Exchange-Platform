# API Plan

## Auth
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

## Users
GET /api/users/:id
PUT /api/users/profile
GET /api/users/discover

## Skills
GET /api/skills
POST /api/skills
POST /api/users/skills
DELETE /api/users/skills/:id

## Exchanges
POST /api/exchanges
GET /api/exchanges
PUT /api/exchanges/:id/accept
PUT /api/exchanges/:id/reject
PUT /api/exchanges/:id/complete

## Reviews
POST /api/reviews
GET /api/users/:id/reviews
