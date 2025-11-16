package domain

type AccountConsent struct {
	ClientID           string   `json:"client_id" yaml:"client_id"`
	Permissions        []string `json:"permissions" yaml:"permissions"`
	Reason             string   `json:"reason" yaml:"reason"`
	RequestingBank     string   `json:"requesting_bank" yaml:"requesting_bank"`
	RequestingBankName string   `json:"requesting_bank_name" yaml:"requesting_bank_name"`
	Status             string   `json:"status" yaml:"status"`
	ConsentID          string   `json:"consent_id" yaml:"consent_id"`
	AutoApproved       bool     `json:"auto_approved" yaml:"auto_approved"`
	ConsentProvider    string   `json:"consent_provider" yaml:"consent_provider"`
}
