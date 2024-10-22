package auth

import "github.com/ctrlb-hq/ctrlb-control-plane/backend/internal/models"

type AuthService struct {
	AuthRepository *AuthRepository
}

func NewAuthService(authRepository *AuthRepository) *AuthService {
	return &AuthService{
		AuthRepository: authRepository,
	}
}

func (a *AuthService) RegisterUser(request *models.UserRegisterRequest) error {
	var user User

	user.Email = request.Email
	user.Name = request.Name
	user.Password = request.Password

	err := a.AuthRepository.RegisterUser(user)
	if err != nil {
		return err
	}
	return nil
}

func (a *AuthService) Login(request *LoginRequest) (*User, error) {
	user, err := a.AuthRepository.Login(request.Email, request.Password)
	if err != nil {
		return nil, err
	}
	return user, nil
}
