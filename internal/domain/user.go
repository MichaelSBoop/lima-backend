package domain

import uuid "github.com/google/uuid"

type User struct {
	ID               uuid.UUID
	Name             string
	Email            string
	SubscriptionType int
	Password         string
}
