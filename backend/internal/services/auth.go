package services

import (
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"
	"github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/repositories"
)

func NewAuthService(authRepository *repositories.AuthRepository) *AuthService {
	return &AuthService{
		AuthRepository: authRepository,
	}
}

func (a *AuthService) RegisterUser(request models.UserRegisterRequest) error {
	var user models.User

	user.Email = request.Email
	user.Name = request.Name
	user.Password = request.Password

	err := a.AuthRepository.RegisterUser(user)
	if err != nil {
		return err
	}
	return nil
}

func (a *AuthService) Login(request models.LoginRequest) (*models.User, error) {
	user, err := a.AuthRepository.Login(request.Email, request.Password)
	if err != nil {
		return nil, err
	}
	return user, nil
}
