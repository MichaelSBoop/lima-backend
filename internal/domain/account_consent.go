package domain

type AccountConsent struct {
	ClientID           string
	Permissions        []string
	Reason             string
	RequestingBank     string
	RequestingBankName string
	Status             string
	ConsentID          string
	AutoApproved       bool
}
